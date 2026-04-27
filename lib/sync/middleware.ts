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
let _userId: string | null = null;

// Track which notes are currently being synced (between edit and ACK)
const pendingSyncNotes = new Set<string>();

// Throttle quota refreshes — at most one server round-trip every 5s.
const QUOTA_REFRESH_INTERVAL_MS = 5000;
let _lastQuotaRefreshAt = 0;
let _quotaRefreshTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Mirrors `navigator.onLine`. Drives two pieces of UX that the per-channel
 * `status` events alone can't get right:
 *
 *  1. As soon as the OS reports we're offline, we want the red exclamation
 *     to appear on every dirty note and *stay there* — instead of being
 *     overwritten by the next "syncing → idle" transition that the channel
 *     emits whenever the user types.
 *  2. While offline, the per-note "pending sync" flag should NOT be cleared
 *     by the typing-pause debounce, because the change isn't actually
 *     leaving the device. The flag (and its red icon) should persist until
 *     the change is genuinely ACK'd by the server.
 *
 * `navigator.onLine` is conservative — it only flips to `false` when the
 * OS knows the link is down. That's exactly what we want here; transient
 * Supabase failures still go through the channel's `'offline'` status.
 */
let _navOnline = typeof navigator === 'undefined' ? true : navigator.onLine;
let _networkListenersInstalled = false;

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
): Promise<void> => {
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

  _userId = userId;

  // Set the authenticated session — enables automatic token refresh
  await supabaseClient.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  syncChannel = new SupabaseSyncChannel(supabaseClient, userId, {
    // Used during conflict resolution: when a remote change arrives while
    // we still have an unACK'd local edit, the channel asks Redux for the
    // freshest local snapshot of the note so OT can rebase against it.
    getLocalNoteData: (noteId: string) =>
      store.getState()?.data?.notes?.get(noteId),
  });

  const { dispatch, getState } = store;

  installNetworkListeners(store);

  // Initial connection status reflects what the OS currently reports
  dispatch({
    type: 'CHANGE_CONNECTION_STATUS',
    status: _navOnline ? 'green' : 'offline',
  });

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
    // While the OS says we're offline, never let a stale "syncing/idle"
    // event flip the indicator back to green. The channel can briefly
    // emit 'syncing' when the user types (we optimistically queue), and
    // we don't want that to hide the offline warning.
    if (!_navOnline) {
      dispatch({ type: 'CHANGE_CONNECTION_STATUS', status: 'offline' });
      return;
    }
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
    if (!_navOnline) {
      dispatch({ type: 'CHANGE_CONNECTION_STATUS', status: 'offline' });
      return;
    }
    dispatch({
      type: 'CHANGE_CONNECTION_STATUS',
      status: 'green',
    });
  });

  // When a change is acknowledged (upload complete) — this is the *only*
  // place we clear the per-note pending icon. If there's still a queued or
  // in-flight follow-up edit for the same note, leave the flag set so the
  // icon keeps reflecting the unsynced state.
  syncChannel.on('acknowledge', (noteId: string) => {
    if (
      pendingSyncNotes.has(noteId) &&
      !syncChannel?.hasPendingForNote(noteId)
    ) {
      clearPendingSyncIcon(noteId);
    }
    // Each successful ACK can move used_bytes either way (text grew or
    // shrank). Re-pull the quota row so the footer indicator stays
    // honest. The refresh helper has its own 5s throttle so this is
    // cheap to call from every ACK.
    scheduleQuotaRefresh(dispatch);
  });

  // Server refused the upload because user is over their byte cap.
  // The channel has already taken the change off the queue (otherwise
  // the same 53100 would loop forever); we just need to flip the UI
  // into "over quota" mode and surface the message.
  syncChannel.on('quota-exceeded', (noteId: string, err: any) => {
    dispatch({
      type: 'SET_QUOTA_EXCEEDED',
      noteId,
      message: String(err?.message ?? err ?? 'Cloud quota exceeded'),
    });
    // Re-pull the actual numbers so the indicator shows used vs cap
    // accurately right when the dialog appears.
    scheduleQuotaRefresh(dispatch, true);
  });

  try {
    await syncChannel.start();
  } catch (e) {
    console.error('[Sync] Failed to start:', e);
  }

  // Pull initial quota numbers (fire-and-forget — never block sync init
  // on this; missing quota_bytes column would just leave it dormant).
  scheduleQuotaRefresh(dispatch, true);

  console.log('[Sync] Supabase sync initialized for user:', userId);
};

/**
 * Pull the current `used_bytes` / `quota_bytes` row from `user_profiles`
 * and dispatch SET_QUOTA. Throttled to at most one round-trip every
 * QUOTA_REFRESH_INTERVAL_MS (5s by default) — passing `immediate: true`
 * bypasses the throttle, useful for the very first refresh after sync
 * init and right after a 53100 error.
 */
const scheduleQuotaRefresh = (
  dispatch: (action: any) => any,
  immediate = false
) => {
  if (!supabaseClient || !_userId) return;
  const now = Date.now();
  const since = now - _lastQuotaRefreshAt;

  if (immediate || since >= QUOTA_REFRESH_INTERVAL_MS) {
    _lastQuotaRefreshAt = now;
    if (_quotaRefreshTimer) {
      clearTimeout(_quotaRefreshTimer);
      _quotaRefreshTimer = null;
    }
    refreshQuota(dispatch).catch((e) =>
      console.warn('[Sync] refreshQuota failed:', e)
    );
    return;
  }

  // Debounce: schedule one trailing refresh at the throttle boundary so
  // the indicator catches up after a burst of ACKs.
  if (_quotaRefreshTimer) return;
  _quotaRefreshTimer = setTimeout(() => {
    _quotaRefreshTimer = null;
    _lastQuotaRefreshAt = Date.now();
    refreshQuota(dispatch).catch((e) =>
      console.warn('[Sync] refreshQuota failed:', e)
    );
  }, QUOTA_REFRESH_INTERVAL_MS - since);
};

/**
 * Healing path for the "stale refresh_token" symptom: when Supabase's
 * `POST /auth/v1/token?grant_type=refresh_token` 400s during boot, the
 * SDK silently keeps a JWT whose `auth.uid()` no longer matches our
 * stored `_userId`. RLS then filters every `user_profiles` row away
 * even though the row exists.
 *
 * We try one self-heal: ask the SDK to re-issue tokens. If it works,
 * a follow-up SELECT will succeed. If the refresh itself fails, we
 * tear the local session down so the next boot lands on /login.
 */
let _selfHealedThisSession = false;
const trySelfHealOrLogout = async (dispatch: (action: any) => any) => {
  if (_selfHealedThisSession || !supabaseClient) return false;
  _selfHealedThisSession = true;
  try {
    const { data, error } = await supabaseClient.auth.refreshSession();
    if (error || !data?.session) {
      console.warn(
        '[Sync] Session is broken and refreshSession failed; forcing logout',
        error
      );
      dispatch({ type: 'LOGOUT' });
      return false;
    }
    console.log('[Sync] Session refreshed successfully, retrying quota fetch');
    return true;
  } catch (e) {
    console.warn('[Sync] refreshSession threw:', e);
    dispatch({ type: 'LOGOUT' });
    return false;
  }
};

const refreshQuota = async (dispatch: (action: any) => any) => {
  if (!supabaseClient || !_userId) return;

  const run = async () =>
    supabaseClient!
      .from('user_profiles')
      .select('used_bytes, quota_bytes')
      .eq('id', _userId!)
      .maybeSingle();

  let { data, error } = await run();

  // RLS returned 0 rows for our own row → JWT belongs to someone else
  // (or the SDK is sitting on a stale half-broken session). Heal once.
  if (!error && !data) {
    const healed = await trySelfHealOrLogout(dispatch);
    if (!healed) return;
    ({ data, error } = await run());
  }

  if (error) {
    if (error.code !== 'PGRST116') {
      console.warn('[Sync] refreshQuota query error:', error);
    }
    return;
  }
  if (!data) return;

  dispatch({
    type: 'SET_QUOTA',
    used: Number(data.used_bytes) || 0,
    total: Number(data.quota_bytes) || 1048576,
  });
};

/**
 * Simple debounce queue per note ID.
 *
 * The sidebar sync icon represents "this note has unsynced edits". The
 * pending flag is set as soon as the user types and is cleared *only* on
 * a real server ACK (or a duplicate-key 23505 which we treat as an ACK).
 * That way, when the network drops, the red offline exclamation persists
 * truthfully — both online and offline states are honest about whether
 * the data has actually reached the server.
 *
 * - Text edits: 300ms — only the upload is debounced; the icon stays put
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

    // Important: do NOT clear the pending flag here. The flag must reflect
    // "edit not yet on the server" — it's the ACK handler below that owns
    // the clear. Otherwise an offline send would silently look "synced".
    if (!syncChannel) return;
    const note = _getState?.()?.data?.notes?.get(noteId);
    if (note) {
      syncChannel.update(noteId, note);
    }
  }, delay);
};

/**
 * Install (once) global online/offline listeners that drive the
 * connection-status reducer and trigger a flush of any local backlog
 * the moment the network returns. Idempotent — safe to call from every
 * `initSupabaseSync` invocation (relogin, etc.).
 */
const installNetworkListeners = (store: any) => {
  if (_networkListenersInstalled || typeof window === 'undefined') return;
  _networkListenersInstalled = true;

  window.addEventListener('offline', () => {
    _navOnline = false;
    store.dispatch({ type: 'CHANGE_CONNECTION_STATUS', status: 'offline' });
  });

  window.addEventListener('online', () => {
    _navOnline = true;
    if (!syncChannel) {
      store.dispatch({ type: 'CHANGE_CONNECTION_STATUS', status: 'green' });
      return;
    }
    // Push any backlog we accumulated while disconnected. The status will
    // flip to 'syncing' / 'idle' as the channel reports back; we hold off
    // dispatching 'green' here so the UI doesn't flash a healthy state
    // before sends actually succeed.
    try {
      syncChannel.flushPending();
    } catch (e) {
      console.warn('[Sync] flushPending after reconnect failed:', e);
    }
  });
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
  if (_quotaRefreshTimer) {
    clearTimeout(_quotaRefreshTimer);
    _quotaRefreshTimer = null;
  }
  _lastQuotaRefreshAt = 0;
  _userId = null;
  _selfHealedThisSession = false;
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
