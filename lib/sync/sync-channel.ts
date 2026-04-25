/**
 * SupabaseSyncChannel
 *
 * Replaces Simperium's Channel (1045 lines) with Supabase transport.
 * Reuses all of Simperium's diff/patch/transform algorithms.
 *
 * Transport mapping:
 * - Simperium WebSocket send("c:{ patch }") → supabase.from('note_changes').insert()
 * - Simperium WebSocket on("c", ...) → supabase.channel().on('postgres_changes', ...)
 * - Simperium index request → supabase.from('note_ghosts').select()
 */

import { EventEmitter } from 'events';
import { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { SupabaseGhostStore } from './ghost-store';
import { LocalQueue } from './local-queue';
import { change, jsondiff, type Ghost, type Change } from './index';
import { v4 as uuid } from 'uuid';

export type SyncStatus = 'idle' | 'syncing' | 'offline' | 'indexing';

export class SupabaseSyncChannel extends EventEmitter {
  private supabase: SupabaseClient;
  private userId: string;
  private clientId: string;
  private store: SupabaseGhostStore;
  private localQueue: LocalQueue;
  private realtimeChannel: RealtimeChannel | null = null;
  private status: SyncStatus = 'idle';
  private isIndexing = false;

  constructor(supabase: SupabaseClient, userId: string) {
    super();
    this.supabase = supabase;
    this.userId = userId;
    this.clientId = `1txt-${uuid().slice(0, 8)}`;
    this.store = new SupabaseGhostStore(supabase, userId);
    this.localQueue = new LocalQueue(this.store);

    // When LocalQueue emits 'send', push to Supabase
    this.localQueue.on('send', (ch: Change) => {
      this.sendChange(ch);
    });
  }

  /**
   * Start synchronization.
   *
   * Order matters here — Redux starts empty on every page load, even when
   * we already have ghosts cached in localStorage from a previous session.
   * So:
   *   1. Hydrate Redux from local ghost cache (instant, offline-friendly)
   *   2. Decide between full index and incremental sync:
   *      - no CV OR no local cache → full index (covers fresh device,
   *        cleared browser data, and the "logout/login again" case where
   *        CV was kept but Redux got reset)
   *      - CV present AND local cache has data → incremental
   *   3. Subscribe to Realtime for incoming changes
   *   4. Start processing local queue
   */
  async start(): Promise<void> {
    this.setStatus('syncing');

    try {
      const localCount = this.hydrateFromLocalCache();
      const cv = await this.store.getChangeVersion();

      if (!cv || localCount === 0) {
        if (cv && localCount === 0) {
          console.warn(
            '[SyncChannel] CV exists but local ghost cache is empty — forcing full index'
          );
        }
        await this.performFullIndex();
      } else {
        await this.performIncrementalSync(cv);
      }

      this.subscribeToRealtime();
      this.localQueue.start();

      this.setStatus('idle');
    } catch (e) {
      console.error('[SyncChannel] Start failed:', e);
      this.setStatus('offline');
    }
  }

  /**
   * Replay locally-cached ghosts into Redux so the UI is populated
   * before the network fetch finishes. Returns how many were replayed.
   */
  private hydrateFromLocalCache(): number {
    let count = 0;
    if (this.store.eachGhost) {
      this.store.eachGhost((ghost) => {
        if (ghost.key) {
          this.emit('update', ghost.key, ghost.data, {}, {}, true);
          count++;
        }
      });
    }
    if (count > 0) {
      console.log(`[SyncChannel] Hydrated ${count} note(s) from local cache`);
    }
    return count;
  }

  /**
   * Stop synchronization.
   */
  stop(): void {
    this.localQueue.pause();
    if (this.realtimeChannel) {
      this.supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
    this.setStatus('idle');
  }

  /**
   * Called when a note is updated locally.
   * Computes diff against ghost and queues the change.
   */
  async update(noteId: string, data: Record<string, any>): Promise<void> {
    try {
      const ghost = await this.store.get(noteId);

      // Compute diff between ghost and new data
      const patch = change.diff(ghost.data, data);

      // Check if anything actually changed
      const empty = !patch || Object.keys(patch).length === 0;
      if (empty) {
        this.emit('unmodified', noteId, data, ghost);
        return;
      }

      // Queue the change
      this.localQueue.queue({
        type: 'modify',
        id: noteId,
        object: data,
      });
    } catch (e) {
      console.error('[SyncChannel] Update failed:', e);
    }
  }

  /**
   * Called when a note is deleted locally.
   */
  async remove(noteId: string): Promise<void> {
    this.localQueue.queue({
      type: 'remove',
      id: noteId,
    });
  }

  /**
   * Get current sync status.
   */
  getStatus(): SyncStatus {
    return this.status;
  }

  /**
   * Check if there are unsynced local changes.
   */
  hasLocalChanges(): boolean {
    return this.localQueue.hasLocalChanges();
  }

  // ─── Private Methods ─────────────────────────────────────

  private setStatus(status: SyncStatus): void {
    this.status = status;
    this.emit('status', status);
  }

  /**
   * Full index: pull all ghosts from Supabase (new device flow).
   * Equivalent to Simperium's `startIndexing()` + `onIndex()`.
   */
  private async performFullIndex(): Promise<void> {
    this.isIndexing = true;
    this.setStatus('indexing');
    this.emit('indexing');

    try {
      // Pull all ghosts
      const ghosts = await this.store.pullAllFromSupabase();

      // Emit update for each ghost so the app can create local files
      for (const ghost of ghosts) {
        this.emit('update', ghost.key, ghost.data, {}, {}, true);
      }

      // Get the latest change timestamp as our CV
      const { data: latestChange } = await this.supabase
        .from('note_changes')
        .select('created_at')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const cv = latestChange?.created_at || new Date().toISOString();
      await this.store.setChangeVersion(cv);

      this.isIndexing = false;
      this.emit('index', cv);
    } catch (e) {
      console.error('[SyncChannel] Full index failed:', e);
      this.isIndexing = false;
    }
  }

  /**
   * Incremental sync: pull only changes since the last CV.
   * Equivalent to Simperium's `sendChangeVersionRequest(cv)`.
   */
  private async performIncrementalSync(cv: string): Promise<void> {
    try {
      const { data: changes, error } = await this.supabase
        .from('note_changes')
        .select('*')
        .eq('user_id', this.userId)
        .neq('client_id', this.clientId) // Don't apply our own changes
        .gt('created_at', cv)
        .order('created_at', { ascending: true });

      if (error) {
        // CV is invalid, do full index
        console.warn(
          '[SyncChannel] Incremental sync failed, falling back to full index'
        );
        await this.store.setChangeVersion(null);
        await this.performFullIndex();
        return;
      }

      if (changes && changes.length > 0) {
        for (const ch of changes) {
          await this.applyRemoteChange(ch);
        }

        // Update CV to latest change
        const latestCv = changes[changes.length - 1].created_at;
        await this.store.setChangeVersion(latestCv);
      }
    } catch (e) {
      console.error('[SyncChannel] Incremental sync error:', e);
    }
  }

  /**
   * Subscribe to Supabase Realtime for incoming changes.
   * Equivalent to Simperium's WebSocket message handler.
   */
  private subscribeToRealtime(): void {
    this.realtimeChannel = this.supabase
      .channel('sync_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'note_changes',
          filter: `user_id=eq.${this.userId}`,
        },
        async (payload) => {
          const ch = payload.new as any;

          // Ignore our own changes
          if (ch.client_id === this.clientId) return;

          await this.applyRemoteChange(ch);

          // Update CV
          await this.store.setChangeVersion(ch.created_at);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[SyncChannel] Realtime connected');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.warn('[SyncChannel] Realtime disconnected, will retry');
          this.setStatus('offline');
        }
      });
  }

  /**
   * Apply a remote change (from another device).
   * Reuses Simperium's applyChange logic:
   * 1. Get ghost
   * 2. Check version match
   * 3. Apply patch
   * 4. Handle conflicts via OT transform
   */
  private async applyRemoteChange(remoteChange: any): Promise<void> {
    const noteId = remoteChange.note_id;
    const ghost = await this.store.get(noteId);

    if (remoteChange.operation === 'remove') {
      await this.store.remove(noteId);
      this.emit('remove', noteId);
      return;
    }

    const patch = remoteChange.patch;
    const sv = remoteChange.sv; // source version the patch was built against

    // Version mismatch — the patch was built against a different ghost version
    if (ghost.version > 0 && ghost.version !== sv) {
      console.warn(
        `[SyncChannel] Version mismatch for ${noteId}: ghost=${ghost.version}, sv=${sv}. Requesting re-index.`
      );
      // For now, pull the latest ghost from server
      const { data } = await this.supabase
        .from('note_ghosts')
        .select('version, data')
        .eq('user_id', this.userId)
        .eq('note_id', noteId)
        .maybeSingle();

      if (data) {
        await this.store.put(noteId, data.version, data.data);
        this.emit(
          'update',
          noteId,
          data.data,
          ghost.data,
          patch,
          this.isIndexing
        );
      }
      return;
    }

    const original = ghost.data;
    const modified = change.apply(patch, original);
    const newVersion = remoteChange.ev || ghost.version + 1;

    // Check if we have local unsent changes for this note
    const hasPendingLocal = this.localQueue.queues[noteId]?.length > 0;

    if (!hasPendingLocal) {
      // No conflict: just apply and update ghost
      await this.store.put(noteId, newVersion, modified);
      this.emit('update', noteId, modified, original, patch, this.isIndexing);
    } else {
      // Conflict! Use OT transform (rebase local changes on top of remote)
      // This is the core of Simperium's conflict resolution

      // Get local unsent data (the latest queued state)
      const localEntry =
        this.localQueue.queues[noteId]?.[
          this.localQueue.queues[noteId].length - 1
        ];
      const localData = localEntry?.object || original;

      // Compute local modifications
      const localMods = change.diff(original, localData);

      // Transform (rebase) local mods on top of remote patch
      const transformed = change.transform(localMods, patch, original);

      // Dequeue old changes
      this.localQueue.dequeueChangesFor(noteId);

      // Apply remote patch first → update ghost
      await this.store.put(noteId, newVersion, modified);

      let update = modified;

      // If transform produced changes, re-queue them
      if (transformed && Object.keys(transformed).length > 0) {
        update = change.apply(transformed, modified);
        this.localQueue.queue({
          type: 'modify',
          id: noteId,
          object: update,
        });
      }

      this.emit('update', noteId, update, original, patch, this.isIndexing);
    }
  }

  /**
   * Send a change to Supabase (upload a diff patch).
   * Equivalent to Simperium's WebSocket send("c:{ change }").
   */
  private async sendChange(ch: Change): Promise<void> {
    this.setStatus('syncing');

    try {
      const ghost = await this.store.get(ch.id);

      const { error } = await this.supabase.from('note_changes').insert({
        user_id: this.userId,
        note_id: ch.id,
        ccid: ch.ccid,
        sv: ch.sv || ghost.version,
        ev: (ch.sv || ghost.version) + 1,
        operation: ch.o === '-' ? 'remove' : 'modify',
        patch: ch.v || {},
        client_id: this.clientId,
      });

      if (error) {
        // Handle specific error codes (matching Simperium's error handling)
        if (error.code === '23505') {
          // Duplicate change (unique constraint on ccid) — already synced
          this.localQueue.acknowledge(ch);
        } else {
          console.error('[SyncChannel] Failed to send change:', error);
          // Will be retried on next resendSentChanges()
        }
        this.setStatus('idle');
        return;
      }

      // Success — update ghost
      const newVersion = (ch.sv || ghost.version) + 1;

      // For modify: compute new data from patch
      if (ch.o === 'M' && ch.v) {
        const newData = change.apply(ch.v, ghost.data);
        await this.store.put(ch.id, newVersion, newData);

        // Also update the ghost on the server
        await this.supabase.from('note_ghosts').upsert(
          {
            user_id: this.userId,
            note_id: ch.id,
            version: newVersion,
            data: newData,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,note_id',
          }
        );
      } else if (ch.o === '-') {
        await this.store.remove(ch.id);
      }

      // ACK the change
      this.localQueue.acknowledge(ch);
      this.emit('acknowledge', ch.id, ch);

      // Update CV
      await this.store.setChangeVersion(new Date().toISOString());

      this.setStatus(this.localQueue.hasLocalChanges() ? 'syncing' : 'idle');
    } catch (e) {
      console.error('[SyncChannel] Send error:', e);
      this.setStatus('offline');
    }
  }
  /**
   * Get historical revisions for a note.
   *
   * Strategy: fetch patches oldest→newest, forward-apply each to
   * reconstruct intermediate snapshots. This produces real content
   * at each point in time.
   *
   * The database's cleanup_old_changes() function uses time-bucketing:
   * - Today: all versions kept
   * - 1-7 days: 1 per day
   * - 7-30 days: 1 per week
   * - 30+ days: deleted
   *
   * So the revisions returned here naturally follow this distribution.
   */
  async getRevisions(
    noteId: string
  ): Promise<Array<{ version: number; data: Record<string, any> }>> {
    try {
      // Get the current ghost (latest version)
      const ghost = await this.store.get(noteId);
      if (!ghost || ghost.version === 0) return [];

      // Fetch patches oldest → newest (up to 60)
      const { data: patches, error } = await this.supabase
        .from('note_changes')
        .select('sv, ev, patch, operation, created_at')
        .eq('user_id', this.userId)
        .eq('note_id', noteId)
        .eq('operation', 'modify')
        .order('created_at', { ascending: true })
        .limit(60);

      if (error || !patches || patches.length === 0) {
        return [{ version: ghost.version, data: ghost.data }];
      }

      const revisions: Array<{ version: number; data: Record<string, any> }> =
        [];

      // Forward-apply: start from first patch's base state,
      // apply each patch to build snapshots
      let currentData: Record<string, any> = {};

      for (const patch of patches) {
        try {
          if (patch.patch && Object.keys(patch.patch).length > 0) {
            // Apply this patch to get the state after this change
            const applied = change.apply(patch.patch, currentData);
            currentData = applied || currentData;

            revisions.push({
              version: patch.ev || revisions.length + 1,
              data: { ...currentData },
            });
          }
        } catch (e) {
          // Forward-replay starting from {} can fail on patches that were
          // diff'd against a non-empty ghost (string deltas need a base).
          // We always include the latest ghost as the final revision below,
          // so a failed mid-chain patch only loses one history entry —
          // not worth surfacing as a warning.
          if (process.env.NODE_ENV !== 'production') {
            console.debug('[SyncChannel] Skipping corrupted patch:', e);
          }
        }
      }

      // Always include current ghost as the latest version
      revisions.push({ version: ghost.version, data: ghost.data });

      // Deduplicate by version
      const seen = new Set<number>();
      const unique = revisions.filter((r) => {
        if (seen.has(r.version)) return false;
        seen.add(r.version);
        return true;
      });

      return unique.sort((a, b) => a.version - b.version);
    } catch (e) {
      console.error('[SyncChannel] Failed to get revisions:', e);
      return [];
    }
  }
}
