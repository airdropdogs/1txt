import * as A from './action-types';
import * as S from './';
import * as T from '../types';
import { tagHashOf } from '../utils/tag-hash';

const DB_VERSION = 2020065;
let keepSyncing = true;

export const stopSyncing = (): void => {
  keepSyncing = false;
};

// Validate the persisted workspace blob ({ collection, openedNote }) against
// the just-loaded notes/tags maps. Anything dangling (tag was deleted, note
// was trashed/wiped) gracefully degrades so the UI never points at "ghost"
// entities right after restart.
const sanitizeWorkspace = (
  workspace: any,
  notes: Map<T.EntityId, T.Note>,
  tags: Map<T.TagHash, { name: T.TagName }>
): { collection: T.Collection; openedNote: T.EntityId | null } | null => {
  if (!workspace || typeof workspace !== 'object') {
    return null;
  }

  let collection: T.Collection = { type: 'all' };
  const persistedCollection = workspace.collection;
  if (persistedCollection && typeof persistedCollection === 'object') {
    switch (persistedCollection.type) {
      case 'all':
      case 'trash':
      case 'untagged':
        collection = { type: persistedCollection.type };
        break;
      case 'tag': {
        const tagName: T.TagName | undefined = persistedCollection.tagName;
        if (typeof tagName === 'string' && tags.has(tagHashOf(tagName))) {
          collection = { type: 'tag', tagName };
        }
        break;
      }
      default:
        break;
    }
  }

  let openedNote: T.EntityId | null = null;
  const persistedOpenedNote = workspace.openedNote;
  if (
    typeof persistedOpenedNote === 'string' &&
    notes.has(persistedOpenedNote as T.EntityId)
  ) {
    openedNote = persistedOpenedNote as T.EntityId;
  }

  return { collection, openedNote };
};

const openDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const r = indexedDB.open('simplenote_v2', DB_VERSION);

    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject();
    r.onupgradeneeded = () => {
      const db = r.result;

      if (!db.objectStoreNames.contains('state')) {
        db.createObjectStore('state');
      }

      if (!db.objectStoreNames.contains('revisions')) {
        db.createObjectStore('revisions');
      }
    };
    r.onblocked = () => reject();
  });

/**
 * v3 → v3.1 migration: the IndexedDB `revisions` store was populated by
 * the old `getRevisions()` that forward-replayed patches from `{}`. Most
 * of those rows are reconstructions of an empty/garbled state and only
 * caused noise in the UI history slider. v3.1+ persists real server
 * snapshots from `note_revisions`, so we wipe the store once and let the
 * fresh data flow in.
 *
 * Gated by a localStorage flag so the wipe runs at most once per device.
 */
const RESET_FLAG_KEY = '1txt_revisions_v3.1_reset';

const wipeLegacyRevisionsOnce = (db: IDBDatabase): Promise<void> =>
  new Promise((resolve) => {
    try {
      if (typeof localStorage === 'undefined') {
        resolve();
        return;
      }
      if (localStorage.getItem(RESET_FLAG_KEY)) {
        resolve();
        return;
      }
      if (!db.objectStoreNames.contains('revisions')) {
        localStorage.setItem(RESET_FLAG_KEY, '1');
        resolve();
        return;
      }
      const tx = db.transaction('revisions', 'readwrite');
      tx.objectStore('revisions').clear();
      tx.oncomplete = () => {
        try {
          localStorage.setItem(RESET_FLAG_KEY, '1');
        } catch {
          // ignore quota/security errors — worst case we wipe again
        }
        resolve();
      };
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    } catch {
      resolve();
    }
  });

export const loadState = (
  accountName: string | null
): Promise<[T.RecursivePartial<S.State>, S.Middleware | null]> =>
  openDB()
    .then(async (db) => {
      await wipeLegacyRevisionsOnce(db);
      return db;
    })
    .then(
      (db): Promise<[T.RecursivePartial<S.State>, S.Middleware | null]> =>
        new Promise((resolve) => {
          let stillGood = true;

          const tx = db.transaction(['state', 'revisions'], 'readonly');

          db.onversionchange = () => {
            stillGood = false;
            resolve([{}, middleware]);
          };

          const stateRequest = tx.objectStore('state').get('state');
          stateRequest.onsuccess = () => {
            if (!stillGood) {
              resolve([{}, middleware]);
              return;
            }

            const state = stateRequest.result;
            if (!state) {
              resolve([{}, middleware]);
              return;
            }

            try {
              if (accountName !== null && state.accountName !== accountName) {
                resolve([{}, middleware]);
                return;
              }

              const noteTags = new Map(
                state.noteTags.map(([tagHash, noteIds]) => [
                  tagHash,
                  new Set(noteIds),
                ])
              );

              const notesMap = new Map(state.notes) as Map<T.EntityId, T.Note>;
              const tagsMap = new Map(state.tags) as Map<
                T.TagHash,
                { name: T.TagName }
              >;

              // Restore the last selected tag/collection and the last opened
              // note across app restarts. We only persist these two fields
              // (not editor selection / scroll position) because they give
              // the strongest "pick up where I left off" feel without the
              // editor-mount timing complexity of restoring cursors.
              const restoredWorkspace = sanitizeWorkspace(
                state.workspace,
                notesMap,
                tagsMap
              );

              const data: T.RecursivePartial<S.State> = {
                data: {
                  notes: notesMap,
                  noteTags,
                  tags: tagsMap,
                },
                settings: {
                  accountName: state.accountName,
                },
                simperium: {
                  ghosts: [new Map(state.cvs), new Map(state.ghosts)],
                  lastRemoteUpdate: new Map(state.lastRemoteUpdate),
                  lastSync: new Map(state.lastSync),
                },
                ...(restoredWorkspace ? { ui: restoredWorkspace } : {}),
              };

              const hasPreferences = 'preferences' in state;
              if (!hasPreferences) {
                data.simperium.ghosts[0].delete('preferences');
                data.simperium.ghosts[1].delete('preferences');
              } else {
                data.data.preferences = new Map(state.preferences);
              }

              const revisionsRequest = tx.objectStore('revisions').openCursor();
              const noteRevisions = new Map<T.EntityId, Map<number, T.Note>>();
              revisionsRequest.onsuccess = () => {
                if (!stillGood) {
                  resolve([data, middleware]);
                  return;
                }

                const cursor = revisionsRequest.result;
                if (cursor) {
                  noteRevisions.set(cursor.key, new Map(cursor.value));
                  cursor.continue();
                } else {
                  resolve([
                    {
                      ...data,
                      data: {
                        ...data.data,
                        noteRevisions,
                      },
                    },
                    middleware,
                  ]);
                }
              };
              revisionsRequest.onerror = () => resolve([data, middleware]);
            } catch (e) {
              resolve([{}, middleware]);
            }
          };

          stateRequest.onerror = () => resolve([{}, middleware]);
        })
    )
    .catch(() => [{}, null]);

const persistRevisions = async (
  noteId: T.EntityId,
  revisions: [number, T.Note][]
) => {
  const tx = (await openDB()).transaction('revisions', 'readwrite');

  const readRequest = tx.objectStore('revisions').get(noteId);
  readRequest.onsuccess = () => {
    // we might have some stored revisions
    const savedRevisions = readRequest.result;

    // so merge them to store as many as we can
    const merged: [number, T.Note][] = savedRevisions?.slice() ?? [];
    const seen = new Set<number>(merged.map(([version]) => version));

    revisions.forEach(([version, note]) => {
      if (!seen.has(version)) {
        merged.push([version, note]);
        seen.add(version);
      }
    });
    merged.sort((a, b) => a[0] - b[0]);

    tx.objectStore('revisions').put(merged, noteId);
  };
  readRequest.onerror = () => {
    // it's fine if we have no saved revisions
    tx.objectStore('revisions').put(revisions, noteId);
  };
};

export const saveState = (state: S.State) => {
  const notes = Array.from(state.data.notes);
  const noteTags = Array.from(state.data.noteTags).map(([tagHash, noteIds]) => [
    tagHash,
    Array.from(noteIds),
  ]);
  const preferences = Array.from(state.data.preferences);
  const tags = Array.from(state.data.tags);
  const cvs = Array.from(state.simperium.ghosts[0]);
  const ghosts = Array.from(state.simperium.ghosts[1]);
  const lastRemoteUpdate = Array.from(state.simperium.lastRemoteUpdate);
  const lastSync = Array.from(state.simperium.lastSync);

  const data = {
    accountName: state.settings.accountName,
    notes,
    noteTags,
    preferences,
    tags,
    cvs,
    ghosts,
    lastRemoteUpdate,
    lastSync,
    workspace: {
      collection: state.ui.collection,
      openedNote: state.ui.openedNote,
    },
  };

  return openDB().then((db) => {
    const tx = db.transaction('state', 'readwrite');
    tx.objectStore('state').put(data, 'state');
  });
};

export const middleware: S.Middleware =
  ({ dispatch, getState }) =>
  (next) => {
    let worker: ReturnType<typeof setTimeout> | null = null;

    return (action: A.ActionType) => {
      const result = next(action);

      if (worker) {
        clearTimeout(worker);
      }
      if (keepSyncing) {
        worker = setTimeout(() => keepSyncing && saveState(getState()), 1000);
      }

      if (action.type === 'LOAD_REVISIONS' && action.revisions.length > 0) {
        persistRevisions(action.noteId, action.revisions);
      }

      return result;
    };
  };
