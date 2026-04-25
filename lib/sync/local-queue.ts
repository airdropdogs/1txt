/**
 * LocalQueue — Local change queue with natural compression
 *
 * 100% reuse of Simperium's LocalQueue logic.
 * Only change: emit('send') is replaced with a callback that inserts into Supabase.
 *
 * Key behaviors (same as Simperium):
 * - Changes are queued per note ID
 * - If a previous change for the same note is awaiting ACK, new changes wait
 * - When processing, multiple queued changes for the same note are compressed:
 *   only the final state diff is sent (natural compression, no artificial debounce)
 * - Remove operations take priority over modify operations
 */

import { EventEmitter } from 'events';
import {
  change,
  buildOperationChange,
  type GhostStore,
  type Change,
  type QueueEntry,
} from './index';

export class LocalQueue extends EventEmitter {
  store: GhostStore;
  sent: Record<string, Change>;
  queues: Record<string, QueueEntry[]>;
  ready: boolean;

  constructor(store: GhostStore) {
    super();
    this.store = store;
    this.sent = {};
    this.queues = {};
    this.ready = false;
  }

  /**
   * Start processing queued changes.
   * Called after initial indexing is complete.
   */
  start(): void {
    this.ready = true;
    for (const queueId in this.queues) {
      this.processQueue(queueId);
    }
  }

  /**
   * Pause processing (e.g., during indexing).
   */
  pause(): void {
    this.ready = false;
  }

  /**
   * Acknowledge a change has been synced.
   * Removes it from 'sent' and processes the next queued change.
   */
  acknowledge(ch: Change): void {
    if (this.sent[ch.id] === ch) {
      delete this.sent[ch.id];
    }
    this.processQueue(ch.id);
  }

  /**
   * Queue a change for a note.
   * If ready, immediately processes the queue (natural compression).
   */
  queue(entry: QueueEntry): void {
    let q = this.queues[entry.id];
    if (!q) {
      q = [];
      this.queues[entry.id] = q;
    }
    q.push(entry);
    this.emit('queued', entry.id, entry, q);
    if (!this.ready) return;
    this.processQueue(entry.id);
  }

  /**
   * Remove all pending changes for a note.
   * Returns the dequeued changes.
   */
  dequeueChangesFor(id: string): (Change | QueueEntry)[] {
    const changes: (Change | QueueEntry)[] = [];
    const sent = this.sent[id];
    const queue = this.queues[id];

    if (sent) {
      changes.push(sent);
    }
    if (queue) {
      delete this.queues[id];
      changes.push(...queue);
    }
    return changes;
  }

  /**
   * Process the queue for a given note ID.
   *
   * KEY BEHAVIOR (natural compression):
   * All queued changes are reduced to a single operation.
   * The ghost is fetched, and a single diff from ghost → latest state is computed.
   * This means rapid edits produce only ONE network request.
   */
  processQueue(id: string): void {
    const queue = this.queues[id];

    // No queue, nothing to do
    if (!queue) return;

    // Queue is empty, clean up
    if (queue.length === 0) {
      delete this.queues[id];
      return;
    }

    // Still waiting for ACK on a previous change
    if (this.sent[id]) {
      this.emit('wait', id);
      return;
    }

    this.store.get(id).then((ghost) => {
      const changes = this.queues[id];

      // A change was sent before we could process
      if (this.sent[id]) {
        this.emit('wait', id);
        return;
      }

      if (!changes || changes.length === 0) {
        delete this.queues[id];
        return;
      }

      // Compress: if any entry is 'remove', use that; otherwise use the latest
      const sending = changes.reduce((chosen: QueueEntry, next: QueueEntry) => {
        return chosen.type === 'remove' ? chosen : next;
      });

      // Build the actual change using the ghost
      const ch = buildOperationChange(sending, ghost);
      this.queues[id] = [];

      if (change.isEmptyChange(ch)) {
        return;
      }

      this.sent[id] = ch;
      this.emit('send', ch);
    });
  }

  /**
   * Resend all changes that were sent but not yet acknowledged.
   * Called after reconnection.
   */
  resendSentChanges(): void {
    for (const id in this.sent) {
      this.emit('send', this.sent[id]);
    }
  }

  /**
   * Check if there are any pending local changes.
   */
  hasLocalChanges(): boolean {
    return (
      Object.keys(this.queues).length > 0 || Object.keys(this.sent).length > 0
    );
  }
}
