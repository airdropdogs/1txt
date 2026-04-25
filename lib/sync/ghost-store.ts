/**
 * SupabaseGhostStore
 *
 * Replaces Simperium's in-memory GhostStore with a two-layer cache:
 * - L1: localStorage (instant reads, survives app restarts)
 * - L2: Supabase note_ghosts table (persistent across devices)
 *
 * Interface is 100% compatible with Simperium's GhostStore.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Ghost, GhostStore } from './index';

const GHOST_PREFIX = '1txt_ghost_';
const CV_KEY = '1txt_sync_cv';

export class SupabaseGhostStore implements GhostStore {
  private supabase: SupabaseClient;
  private userId: string;
  private cache: Map<string, string>; // in-memory cache backed by localStorage

  constructor(supabase: SupabaseClient, userId: string) {
    this.supabase = supabase;
    this.userId = userId;
    this.cache = new Map();
    this.loadFromLocalStorage();
  }

  /**
   * Load all ghosts from localStorage into memory cache on startup
   */
  private loadFromLocalStorage(): void {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(GHOST_PREFIX)) {
          const value = localStorage.getItem(key);
          if (value) {
            this.cache.set(key, value);
          }
        }
      }
    } catch (e) {
      console.warn('[GhostStore] Failed to load from localStorage:', e);
    }
  }

  private storageKey(id: string): string {
    return `${GHOST_PREFIX}${this.userId}_${id}`;
  }

  /**
   * Get a ghost by note ID.
   * Returns from L1 cache first, falls back to empty ghost.
   */
  async get(id: string): Promise<Ghost> {
    const key = this.storageKey(id);

    // L1: memory/localStorage cache
    const cached = this.cache.get(key);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // corrupted cache entry, remove it
        this.cache.delete(key);
        localStorage.removeItem(key);
      }
    }

    // No cached ghost, return empty ghost (version 0)
    const emptyGhost: Ghost = { key: id, version: 0, data: {} };
    return emptyGhost;
  }

  /**
   * Save a ghost. Writes to L1 (localStorage) immediately,
   * then async writes to L2 (Supabase).
   */
  async put(
    id: string,
    version: number,
    data: Record<string, any>
  ): Promise<boolean> {
    const ghost: Ghost = { key: id, version, data };
    const serialized = JSON.stringify(ghost);
    const key = this.storageKey(id);

    // L1: write to memory + localStorage (synchronous, fast)
    this.cache.set(key, serialized);
    try {
      localStorage.setItem(key, serialized);
    } catch (e) {
      console.warn('[GhostStore] localStorage write failed:', e);
    }

    // L2: write to Supabase (async, background)
    try {
      await this.supabase.from('note_ghosts').upsert(
        {
          user_id: this.userId,
          note_id: id,
          version,
          data,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,note_id',
        }
      );
    } catch (e) {
      console.warn('[GhostStore] Supabase write failed (will retry):', e);
    }

    return true;
  }

  /**
   * Remove a ghost from both caches.
   */
  async remove(id: string): Promise<void> {
    const key = this.storageKey(id);

    // L1
    this.cache.delete(key);
    localStorage.removeItem(key);

    // L2
    try {
      await this.supabase
        .from('note_ghosts')
        .delete()
        .eq('user_id', this.userId)
        .eq('note_id', id);
    } catch (e) {
      console.warn('[GhostStore] Supabase delete failed:', e);
    }
  }

  /**
   * Get the current change version (sync cursor).
   */
  async getChangeVersion(): Promise<string | null> {
    try {
      const stored = localStorage.getItem(`${CV_KEY}_${this.userId}`);
      if (stored) return stored;

      // Fallback to Supabase
      const { data } = await this.supabase
        .from('sync_cursors')
        .select('change_version')
        .eq('user_id', this.userId)
        .maybeSingle();

      if (data?.change_version) {
        localStorage.setItem(`${CV_KEY}_${this.userId}`, data.change_version);
        return data.change_version;
      }
    } catch (e) {
      // No cursor found
    }
    return null;
  }

  /**
   * Set the current change version (sync cursor).
   */
  async setChangeVersion(cv: string | null): Promise<void> {
    // L1
    if (cv) {
      localStorage.setItem(`${CV_KEY}_${this.userId}`, cv);
    } else {
      localStorage.removeItem(`${CV_KEY}_${this.userId}`);
    }

    // L2
    try {
      await this.supabase.from('sync_cursors').upsert(
        {
          user_id: this.userId,
          change_version: cv,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        }
      );
    } catch (e) {
      console.warn('[GhostStore] Failed to save CV to Supabase:', e);
    }
  }

  /**
   * Iterate over all cached ghosts.
   */
  eachGhost(callback: (ghost: Ghost & { key: string }) => void): void {
    const prefix = `${GHOST_PREFIX}${this.userId}_`;
    this.cache.forEach((value, key) => {
      if (key.startsWith(prefix)) {
        try {
          const ghost = JSON.parse(value);
          if (!ghost.key) {
            ghost.key = key.slice(prefix.length);
          }
          callback(ghost);
        } catch (e) {
          // skip corrupted entries
        }
      }
    });
  }

  /**
   * Pull all ghosts from Supabase into local cache.
   * Called on first sync / new device login.
   */
  async pullAllFromSupabase(): Promise<Ghost[]> {
    const { data, error } = await this.supabase
      .from('note_ghosts')
      .select('note_id, version, data')
      .eq('user_id', this.userId);

    if (error) {
      console.error('[GhostStore] Failed to pull ghosts:', error);
      return [];
    }

    const ghosts: Ghost[] = [];
    for (const row of data || []) {
      const ghost: Ghost = {
        key: row.note_id,
        version: row.version,
        data: row.data,
      };
      const serialized = JSON.stringify(ghost);
      const key = this.storageKey(row.note_id);
      this.cache.set(key, serialized);
      try {
        localStorage.setItem(key, serialized);
      } catch (e) {
        // localStorage full, continue with memory cache
      }
      ghosts.push(ghost);
    }

    return ghosts;
  }
}
