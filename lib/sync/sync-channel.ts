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

export interface SyncChannelOptions {
  /**
   * Optional callback to read the latest local note data straight from
   * the host store (e.g. Redux). Used during conflict resolution when a
   * remote change arrives while we still have an unACK'd local edit
   * sitting in the LocalQueue's `sent` slot — the queue itself only
   * keeps the in-flight Change, not the post-edit object.
   */
  getLocalNoteData?: (noteId: string) => Record<string, any> | undefined;
}

export class SupabaseSyncChannel extends EventEmitter {
  private supabase: SupabaseClient;
  private userId: string;
  private clientId: string;
  private store: SupabaseGhostStore;
  private localQueue: LocalQueue;
  private realtimeChannel: RealtimeChannel | null = null;
  private status: SyncStatus = 'idle';
  private isIndexing = false;
  private getLocalNoteData?: (
    noteId: string
  ) => Record<string, any> | undefined;

  constructor(
    supabase: SupabaseClient,
    userId: string,
    options: SyncChannelOptions = {}
  ) {
    super();
    this.supabase = supabase;
    this.userId = userId;
    this.clientId = `1txt-${uuid().slice(0, 8)}`;
    this.store = new SupabaseGhostStore(supabase, userId);
    this.localQueue = new LocalQueue(this.store);
    this.getLocalNoteData = options.getLocalNoteData;

    // When LocalQueue emits 'send', push to Supabase
    this.localQueue.on('send', (ch: Change) => {
      this.sendChange(ch);
    });
  }

  /**
   * Re-attempt sending any locally queued / unACK'd changes.
   *
   * Call this after the network comes back online or after the Realtime
   * channel reconnects. Mirrors Simperium's `resendSentChanges()` plus a
   * sweep of any compressed-but-blocked queue entries.
   */
  flushPending(): void {
    if (!this.localQueue.ready) {
      this.localQueue.start();
    }
    this.localQueue.resendSentChanges();
    for (const id in this.localQueue.queues) {
      this.localQueue.processQueue(id);
    }
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

  /**
   * Per-note: is anything still queued or in flight for this note?
   * Used by the middleware to decide whether to clear the per-note
   * "pending" icon on ACK — we only clear when the last in-flight
   * change for the note has been acknowledged.
   */
  hasPendingForNote(noteId: string): boolean {
    return (
      !!this.localQueue.sent[noteId] ||
      (this.localQueue.queues[noteId]?.length ?? 0) > 0
    );
  }

  // ─── Private Methods ─────────────────────────────────────

  private setStatus(status: SyncStatus): void {
    this.status = status;
    this.emit('status', status);
  }

  /**
   * Pull a single note's authoritative ghost from Supabase and overwrite
   * our local copy. Used after we discover our local sv has drifted
   * (e.g. a 23505 duplicate-key on resend means the server already
   * applied a change we have no record of). Also emits `update` so the
   * UI/store re-syncs to the canonical content.
   */
  private async refreshGhostFromServer(noteId: string): Promise<void> {
    const { data, error } = await this.supabase
      .from('note_ghosts')
      .select('version, data')
      .eq('user_id', this.userId)
      .eq('note_id', noteId)
      .maybeSingle();

    if (error || !data) return;

    const local = await this.store.get(noteId);
    if (data.version <= local.version) return;

    await this.store.put(noteId, data.version, data.data);
    this.emit('update', noteId, data.data, local.data, {}, this.isIndexing);
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
          const wasOffline = this.status === 'offline';
          console.log('[SyncChannel] Realtime connected');
          if (wasOffline) {
            // We were offline and just came back — push out anything that
            // accumulated locally before the network gave up on us.
            this.flushPending();
          }
          this.setStatus(
            this.localQueue.hasLocalChanges() ? 'syncing' : 'idle'
          );
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

    // Detect ALL pending local work — not just the queued (waiting) entries
    // but also the sent-but-not-yet-ACK'd one in `sent[]`. The original
    // version of this check only looked at `queues[]`, which meant offline
    // edits that had already been "sent" (and silently failed) were
    // overwritten by remote changes when the network came back.
    const queueEntries = this.localQueue.queues[noteId];
    const sentChange = this.localQueue.sent[noteId];
    const hasPendingLocal = (queueEntries?.length ?? 0) > 0 || !!sentChange;

    if (!hasPendingLocal) {
      // No conflict: just apply and update ghost
      await this.store.put(noteId, newVersion, modified);
      this.emit('update', noteId, modified, original, patch, this.isIndexing);
      return;
    }

    // Conflict! Use OT transform (rebase local changes on top of remote)
    // This is the core of Simperium's conflict resolution.
    //
    // The "local" snapshot we want to preserve is, in priority order:
    //   1. The most recent queued entry's full object (latest user state)
    //   2. The Redux-side snapshot (still authoritative if only `sent` exists)
    //   3. The patch carried in `sent` re-applied on top of `original`
    //   4. Worst case, fall back to the ghost itself
    let localData: Record<string, any> = original;
    const lastQueueEntry = queueEntries?.[queueEntries.length - 1];
    if (lastQueueEntry?.object) {
      localData = lastQueueEntry.object;
    } else if (this.getLocalNoteData) {
      const fromHost = this.getLocalNoteData(noteId);
      if (fromHost) {
        localData = fromHost;
      }
    }
    if (localData === original && sentChange?.v) {
      try {
        localData = change.apply(sentChange.v, original) || original;
      } catch (e) {
        console.warn(
          '[SyncChannel] Could not re-apply in-flight patch, falling back to ghost:',
          e
        );
      }
    }

    // Compute local modifications relative to the pre-remote ghost
    const localMods = change.diff(original, localData);

    // Transform (rebase) local mods on top of remote patch
    const transformed =
      localMods && Object.keys(localMods).length > 0
        ? change.transform(localMods, patch, original)
        : null;

    // Dequeue old changes (drops both `sent[id]` and `queues[id]`)
    this.localQueue.dequeueChangesFor(noteId);

    // Apply remote patch first → update ghost
    await this.store.put(noteId, newVersion, modified);

    let update = modified;

    // If transform produced changes, re-queue them so the local edits
    // survive the merge and get retried on the next send opportunity.
    if (transformed && Object.keys(transformed).length > 0) {
      update = change.apply(transformed, modified) || modified;
      this.localQueue.queue({
        type: 'modify',
        id: noteId,
        object: update,
      });
    }

    this.emit('update', noteId, update, original, patch, this.isIndexing);
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
          // Duplicate change (unique constraint on ccid). This means the
          // request actually succeeded earlier but we lost the response —
          // typical when the network blipped right after the insert. The
          // server already applied this change; we just never advanced
          // our local ghost, so any *future* change for this note would
          // also fail with sv mismatch unless we sync the ghost first.
          await this.refreshGhostFromServer(ch.id).catch((e) =>
            console.warn(
              '[SyncChannel] Could not resync ghost after 23505 for',
              ch.id,
              e
            )
          );
          this.localQueue.acknowledge(ch);
          this.emit('acknowledge', ch.id, ch);
          this.setStatus(
            this.localQueue.hasLocalChanges() ? 'syncing' : 'idle'
          );
          return;
        }
        // Quota exhausted on the server (note_ghosts trigger raises
        // SQLSTATE 53100). The server WILL keep refusing this change
        // until the user frees up space, so we must drop it from the
        // queue — otherwise we'd retry-spin forever and burn battery.
        // Local edits are still safe in IndexedDB; the upload simply
        // resumes once SET_QUOTA reports headroom again.
        if (
          error.code === '53100' ||
          /quota_exceeded/i.test(error.message ?? '')
        ) {
          console.warn(
            '[SyncChannel] Quota exceeded — pausing uploads for',
            ch.id
          );
          this.emit('quota-exceeded', ch.id, error);
          this.localQueue.acknowledge(ch);
          this.setStatus('idle');
          return;
        }
        // Other errors → leave the change in `sent[]` so flushPending()
        // (called on online / Realtime reconnect) can retry it later.
        console.error('[SyncChannel] Failed to send change:', error);
        this.setStatus('offline');
        return;
      }

      // Success — update ghost
      const newVersion = (ch.sv || ghost.version) + 1;

      // For modify: compute new data from patch
      let revisionData: Record<string, any> | null = null;
      if (ch.o === 'M' && ch.v) {
        const newData = change.apply(ch.v, ghost.data);
        await this.store.put(ch.id, newVersion, newData);

        // Also update the ghost on the server. If this fails with quota
        // (53100) the upsert returns an error rather than throwing, so
        // we must check explicitly and emit so the UI can react.
        const { error: ghostError } = await this.supabase
          .from('note_ghosts')
          .upsert(
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
        if (ghostError) {
          if (
            ghostError.code === '53100' ||
            /quota_exceeded/i.test(ghostError.message ?? '')
          ) {
            console.warn(
              '[SyncChannel] Quota exceeded on ghost upsert for',
              ch.id
            );
            this.emit('quota-exceeded', ch.id, ghostError);
            this.localQueue.acknowledge(ch);
            this.setStatus('idle');
            return;
          }
          console.warn(
            '[SyncChannel] Ghost upsert failed (non-fatal):',
            ghostError
          );
        }
        revisionData = newData;
      } else if (ch.o === '-') {
        await this.store.remove(ch.id);
      }

      // ACK the change
      this.localQueue.acknowledge(ch);
      this.emit('acknowledge', ch.id, ch);

      // Update CV
      await this.store.setChangeVersion(new Date().toISOString());

      // Record a snapshot of the post-ACK state (modify only).
      // Best-effort: never let a failed revision write break the sync ACK.
      if (revisionData) {
        await this.recordRevision(ch.id, newVersion, revisionData);
      }

      this.setStatus(this.localQueue.hasLocalChanges() ? 'syncing' : 'idle');
    } catch (e) {
      console.error('[SyncChannel] Send error:', e);
      this.setStatus('offline');
    }
  }

  /**
   * Record a full snapshot of a note's post-ACK state into the
   * dedicated `note_revisions` table.
   *
   * Decoupled from the diff-patch chain on purpose — reconstructing
   * history by forward-replaying patches from {} is fragile (string
   * deltas need an exact base) and incompatible with aggressive
   * `note_changes` cleanup. With this table, getRevisions() is just a
   * single SELECT.
   *
   * Errors here are logged and swallowed — a missing snapshot row never
   * justifies failing the user-visible sync ACK.
   */
  private async recordRevision(
    noteId: string,
    version: number,
    data: Record<string, any>
  ): Promise<void> {
    try {
      const { error } = await this.supabase.from('note_revisions').insert({
        user_id: this.userId,
        note_id: noteId,
        version,
        content: data,
      });
      if (error) {
        // 23505 = duplicate (user_id, note_id, version) — this snapshot
        // was already recorded (idempotent retry). Treat as success.
        if (error.code === '23505') return;
        console.warn('[SyncChannel] recordRevision failed:', error);
      }
    } catch (e) {
      console.warn('[SyncChannel] recordRevision threw:', e);
    }
  }
  /**
   * Get historical revisions for a note.
   *
   * v3.1+: revisions are full snapshots, written one row per ACK into
   * the dedicated `note_revisions` table. Reading history is now a
   * single SELECT with no replay logic — the previous forward-apply-
   * from-`{}` approach was fragile (string deltas need an exact base)
   * and could silently drop most of the chain.
   *
   * Server-side `cleanup_old_revisions()` thins this table on the same
   * schedule the UI advertises:
   *   - Today:    keep all
   *   - 1–7 days: 1 per day
   *   - 7–30d:    1 per week
   *   - >30 days: delete
   */
  async getRevisions(
    noteId: string
  ): Promise<Array<{ version: number; data: Record<string, any> }>> {
    try {
      const { data, error } = await this.supabase
        .from('note_revisions')
        .select('version, content, created_at')
        .eq('user_id', this.userId)
        .eq('note_id', noteId)
        .order('version', { ascending: true });

      if (error) {
        console.warn('[SyncChannel] getRevisions failed:', error);
        return [];
      }

      const rows =
        (data ?? []).map((r: any) => ({
          version: r.version as number,
          data: r.content as Record<string, any>,
        })) ?? [];

      // Always make sure the current ghost is the last entry, even if a
      // recent revision row hasn't been written yet (e.g. snapshot insert
      // failed but ACK succeeded — recordRevision is best-effort).
      try {
        const ghost = await this.store.get(noteId);
        if (
          ghost &&
          ghost.version > 0 &&
          (rows.length === 0 || rows[rows.length - 1].version < ghost.version)
        ) {
          rows.push({ version: ghost.version, data: ghost.data });
        }
      } catch {
        // ghost lookup is just a safety net — ignore failures
      }

      return rows;
    } catch (e) {
      console.error('[SyncChannel] Failed to get revisions:', e);
      return [];
    }
  }
}
