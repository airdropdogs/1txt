/**
 * 1TXT Sync Module — Diff-Patch Cloud Sync
 *
 * Reuses Simperium's core algorithms:
 * - jsondiff (JSON diff/patch with diff-match-patch for strings)
 * - change utils (build, apply, transform, compress)
 * - operation (build change from queue entry)
 * - LocalQueue (local change queue with natural compression)
 *
 * Replaces Simperium's transport layer:
 * - GhostStore → localStorage + Supabase
 * - Channel → Supabase REST + Realtime
 */

// Re-export the Simperium jsondiff instance (pre-configured with list_diff: false)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsondiffModule = require('simperium/lib/simperium/jsondiff');
export const jsondiff = jsondiffModule.default || jsondiffModule;

// Re-export change utilities
// eslint-disable-next-line @typescript-eslint/no-var-requires
const changeModule = require('simperium/lib/simperium/util/change');
export const change = {
  buildChange: changeModule.buildChange,
  compressChanges: changeModule.compressChanges,
  transform: changeModule.transform,
  modify: changeModule.modify,
  apply: changeModule.apply,
  isEmptyChange: changeModule.isEmptyChange,
  diff: changeModule.diff,
  type: changeModule.type,
};

// Re-export operation builder
// eslint-disable-next-line @typescript-eslint/no-var-requires
const operationModule = require('simperium/lib/simperium/util/operation');
export const buildOperationChange = operationModule.default || operationModule;

// Type definitions
export interface Ghost {
  key?: string;
  version: number;
  data: Record<string, any>;
}

export interface Change {
  o: string; // operation: 'M' (modify) or '-' (remove)
  id: string; // note ID
  ccid: string; // client change ID (for idempotency)
  v?: Record<string, any>; // patch data (JSONDiff output)
  sv?: number; // source version
  ev?: number; // end version
  d?: Record<string, any>; // full data (for 'full' type)
  clientid?: string;
  error?: number;
}

export interface QueueEntry {
  type: 'modify' | 'remove' | 'full';
  id: string;
  object?: Record<string, any>;
  originalChange?: Change;
}

export interface GhostStore {
  get(id: string): Promise<Ghost>;
  put(id: string, version: number, data: Record<string, any>): Promise<any>;
  remove(id: string): Promise<any>;
  getChangeVersion(): Promise<string | null>;
  setChangeVersion(cv: string | null): Promise<any>;
  eachGhost?(callback: (ghost: Ghost) => void): void;
}
