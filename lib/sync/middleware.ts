/**
 * 1TXT Supabase Sync Middleware
 *
 * Replaces Simperium's middleware (state/simperium/middleware.ts).
 * Connects our SupabaseSyncChannel to Redux:
 *
 * 1. When Redux dispatches note edit actions → SyncChannel.update()
 * 2. When SyncChannel receives remote changes → dispatch REMOTE_NOTE_UPDATE
 * 3. Sync status → dispatch connection state changes
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient } from './supabase-client';
import { SupabaseSyncChannel } from './sync-channel';
import type * as T from '../types';

let syncChannel: SupabaseSyncChannel | null = null;
let supabaseClient: SupabaseClient | null = null;
let _logout: (() => void) | null = null;

// Track which notes are currently being synced (between edit and ACK)
const pendingSyncNotes = new Set<string>();

/**
 * Check if a specific note is currently being synced.
 * Used by the note list to show/hide per-note sync icon.
 */
export const isNotePendingSync = (noteId: string): boolean => {
  return pendingSyncNotes.has(noteId);
};

/**
 * Initialize the Supabase sync system.
 * Called from boot-with-auth.tsx after successful login.
 *
 * Uses supabase.auth.setSession() for automatic token refresh.
 * Without this, JWT expires after ~1 hour and all requests return 401.
 */
export const initSupabaseSync = async (
  store: any,
  userId: string,
  accessToken: string,
  refreshToken: string,
  logout?: () => void
) => {
  supabaseClient = getSupabaseClient();
  if (!supabaseClient) {
    console.warn(
      '[Sync] No Supabase config (supabase_url/supabase_key missing), skipping cloud sync'
    );
    return;
  }

  if (logout) {
    _logout = logout;
  }

  // Set the authenticated session — enables automatic token refresh
  await supabaseClient.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  syncChannel = new SupabaseSyncChannel(supabaseClient, userId);

  const { dispatch, getState } = store;

  // Immediately set status to green (we're initialized and online)
  dispatch({ type: 'CHANGE_CONNECTION_STATUS', status: 'green' });

  // ── Incoming: SyncChannel → Redux ──────────────────────

  // When a note is updated from another device
  syncChannel.on(
    'update',
    (
      noteId: string,
      data: any,
      original?: any,
      patch?: any,
      isIndexing?: boolean
    ) => {
      if (original && patch && typeof isIndexing !== 'undefined') {
        dispatch({
          type: 'REMOTE_NOTE_UPDATE',
          noteId: noteId as T.EntityId,
          note: data,
          remoteInfo: { original, patch, isIndexing },
        });
      } else {
        dispatch({
          type: 'REMOTE_NOTE_UPDATE',
          noteId: noteId as T.EntityId,
          note: data,
        });
      }
    }
  );

  // When a note is deleted from another device
  syncChannel.on('remove', (noteId: string) => {
    dispatch({
      type: 'REMOTE_NOTE_DELETE_FOREVER',
      noteId,
    });
  });

  // Sync status changes
  syncChannel.on('status', (status: string) => {
    dispatch({
      type: 'CHANGE_CONNECTION_STATUS',
      status:
        status === 'syncing'
          ? 'green'
          : status === 'offline'
            ? 'offline'
            : 'green', // 'idle' = connected and synced
    });
  });

  // Indexing state
  syncChannel.on('indexing', () => {
    dispatch({
      type: 'CHANGE_CONNECTION_STATUS',
      status: 'green',
    });
  });

  // When a change is acknowledged (upload complete) — the icon was already
  // cleared by `clearPendingSyncIcon` when the debounce timer fired, so this
  // is just a safety net for the edge case where the timer never ran (e.g.
  // a metadata-only change synced via a separate path).
  syncChannel.on('acknowledge', (noteId: string) => {
    if (pendingSyncNotes.has(noteId)) {
      clearPendingSyncIcon(noteId);
    }
  });

  // Start sync
  syncChannel.start().catch((e) => {
    console.error('[Sync] Failed to start:', e);
  });

  console.log('[Sync] Supabase sync initialized for user:', userId);
};

/**
 * Simple debounce queue per note ID.
 *
 * The sidebar "syncing" icon is intentionally decoupled from server
 * acknowledgement: it reflects "the user is actively editing" rather than
 * "bytes are flying to the server". The icon clears as soon as the debounce
 * timer fires (i.e. typing has paused), and the actual upload happens
 * asynchronously after that. Real failures surface through the offline
 * warning icon driven by `connectionStatus`.
 *
 * - Text edits: 300ms — feels instant after a typing pause
 * - Metadata changes (pin/trash/tag/etc.): 10ms — effectively immediate
 */
const syncTimers: Record<string, ReturnType<typeof setTimeout>> = {};

const clearPendingSyncIcon = (noteId: string) => {
  if (pendingSyncNotes.delete(noteId)) {
    _dispatch?.({
      type: 'ACKNOWLEDGE_PENDING_CHANGE',
      entityId: noteId as T.EntityId,
      ccid: '',
    });
  }
};

const queueSyncUpdate = (noteId: string, delay: number = 300) => {
  // Mark this note as pending sync — drives the per-note sync icon in the
  // sidebar via the `pendingChanges` reducer slice.
  if (!pendingSyncNotes.has(noteId)) {
    pendingSyncNotes.add(noteId);
    _dispatch?.({
      type: 'SUBMIT_PENDING_CHANGE',
      entityId: noteId as T.EntityId,
      ccid: '',
    });
  }

  if (syncTimers[noteId]) {
    clearTimeout(syncTimers[noteId]);
  }

  syncTimers[noteId] = setTimeout(() => {
    delete syncTimers[noteId];

    // Clear the icon immediately, regardless of upload outcome —
    // the user has stopped editing, so the visual feedback should stop too.
    clearPendingSyncIcon(noteId);

    if (!syncChannel) return;
    const note = _getState?.()?.data?.notes?.get(noteId);
    if (note) {
      syncChannel.update(noteId, note);
    }
  }, delay);
};

// Store reference for getting state / dispatching inside timers
let _getState: (() => any) | null = null;
let _dispatch: ((action: any) => any) | null = null;

/**
 * Redux middleware that intercepts note actions and forwards to SyncChannel.
 *
 * - Text edits → 300ms debounce (icon clears as soon as typing pauses)
 * - Metadata changes (pin/trash/tag) → 10ms (nearly instant)
 */
export const supabaseSyncMiddleware =
  (store: any) => (next: any) => (action: any) => {
    const result = next(action);

    // Always-handled actions (must work even before sync is initialized,
    // otherwise the desktop window can never be closed)
    if (action.type === 'CLOSE_WINDOW') {
      store.dispatch({ type: 'REALLY_CLOSE_WINDOW' });
      return result;
    }

    if (!syncChannel) return result;

    _getState = store.getState.bind(store);
    _dispatch = store.dispatch.bind(store);

    switch (action.type) {
      // ── Text edits → short debounce ──
      case 'CREATE_NOTE_WITH_ID':
      case 'EDIT_NOTE':
      case 'INSERT_TASK_INTO_NOTE':
      case 'RESTORE_NOTE_REVISION':
      case 'IMPORT_NOTE_WITH_ID': {
        if (action.noteId) {
          queueSyncUpdate(action.noteId);
        }
        break;
      }

      // ── Metadata changes → near-instant sync (10ms) ──
      case 'MARKDOWN_NOTE':
      case 'PIN_NOTE':
      case 'PUBLISH_NOTE':
      case 'RESTORE_NOTE':
      case 'TRASH_NOTE':
      case 'ADD_NOTE_TAG':
      case 'REMOVE_NOTE_TAG':
      case 'ADD_COLLABORATOR':
      case 'REMOVE_COLLABORATOR': {
        if (action.noteId) {
          queueSyncUpdate(action.noteId, 10);
        }
        break;
      }

      // ── Note deletion → immediate sync ──
      case 'DELETE_NOTE_FOREVER': {
        syncChannel.remove(action.noteId);
        break;
      }

      // ── Logout → stop sync, clear local cloud state, then trigger app logout ──
      case 'LOGOUT':
      case 'REALLY_LOG_OUT': {
        stopSync();
        try {
          localStorage.removeItem('1txt_refresh_token');
          localStorage.removeItem('1txt_user_id');
          // Drop the ghost cache and sync cursor too, otherwise the next
          // session keeps a stale CV and skips its full re-index.
          const stale: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (
              k &&
              (k.startsWith('1txt_ghost_') || k.startsWith('1txt_sync_cv_'))
            ) {
              stale.push(k);
            }
          }
          stale.forEach((k) => localStorage.removeItem(k));
          localStorage.setItem('simplenote_logout', Math.random().toString());
        } catch (e) {
          // ignore storage errors
        }
        if (_logout) {
          _logout();
          _logout = null;
        }
        break;
      }

      // ── Revisions: load when opening a note or toggling history ──
      case 'FILTER_NOTES':
      case 'OPEN_NOTE':
      case 'SELECT_NOTE': {
        const noteId =
          action.noteId ??
          action.meta?.nextNoteToOpen ??
          store.getState().ui.openedNote;

        const nextState = store.getState();
        if (
          noteId &&
          !nextState.data.noteRevisions.get(noteId)?.size &&
          !_hasRequestedRevisions.has(noteId)
        ) {
          _hasRequestedRevisions.add(noteId);
          setTimeout(() => {
            if (store.getState().ui.openedNote === noteId) {
              loadRevisionsForNote(noteId, store.dispatch);
            }
          }, 500);
        }
        break;
      }

      case 'REVISIONS_TOGGLE': {
        const state2 = store.getState();
        if (state2.ui.showRevisions && state2.ui.openedNote) {
          loadRevisionsForNote(state2.ui.openedNote, store.dispatch);
        }
        break;
      }
    }

    return result;
  };

const _hasRequestedRevisions = new Set<string>();

async function loadRevisionsForNote(noteId: string, dispatch: any) {
  if (!syncChannel) return;
  try {
    const revisions = await syncChannel.getRevisions(noteId);
    dispatch({
      type: 'LOAD_REVISIONS',
      noteId,
      revisions: revisions
        .map(({ version, data }): [number, any] => [version, data])
        .sort((a, b) => a[0] - b[0]),
    });
  } catch (e) {
    console.warn('[Sync] Failed to load revisions for', noteId, e);
  }
}

/**
 * Stop the sync channel and clean up.
 */
export const stopSync = () => {
  if (syncChannel) {
    syncChannel.stop();
    syncChannel = null;
  }
};

/**
 * Get current sync status.
 */
export const getSyncStatus = () => {
  return syncChannel?.getStatus() || 'idle';
};

/**
 * Check if there are unsynced changes.
 */
export const hasUnsyncedChanges = () => {
  return syncChannel?.hasLocalChanges() || false;
};
