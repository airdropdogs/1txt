import { v4 as uuid } from 'uuid';

import { tagHashOf } from '../../utils/tag-hash';
import exportZipArchive from '../../utils/export';
import { withTag } from '../../utils/tag-hash';
import { getSupabaseClient } from '../../sync/supabase-client';

import type * as A from '../action-types';
import type * as S from '../';
import type * as T from '../../types';
import { numberOfNonEmailTags, openedTag } from '../selectors';

const syncPublicNote = async ({
  noteId,
  title,
  content,
  updatedAt,
  publishURL,
  shouldPublish,
}: {
  noteId: T.EntityId;
  title: string;
  content: string;
  updatedAt: string;
  publishURL: string;
  shouldPublish: boolean;
}) => {
  console.log('[Publish] Starting syncPublicNote', {
    shouldPublish,
    publishURL,
    noteId,
  });

  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error(
      '[Publish] getSupabaseClient() returned null — check SUPABASE_URL / SUPABASE_KEY config'
    );
    throw new Error('Supabase client is not configured');
  }
  console.log('[Publish] Supabase client OK');

  if (shouldPublish) {
    console.log('[Publish] Fetching user from auth...');
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      console.error('[Publish] auth.getUser() error:', userError);
      throw userError;
    }
    if (!user) {
      console.error('[Publish] auth.getUser() returned null user');
      throw new Error('Not authenticated');
    }
    console.log('[Publish] User OK:', user.id);

    console.log('[Publish] Upserting public_notes...');
    const { error } = await supabase.from('public_notes').upsert(
      {
        id: publishURL,
        user_id: user.id,
        note_id: noteId,
        title,
        content,
        updated_at: updatedAt,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.error('[Publish] upsert error:', error);
      throw error;
    }
    console.log('[Publish] upsert success');
    return;
  }

  console.log('[Publish] Deleting public note...');
  const { error } = await supabase
    .from('public_notes')
    .delete()
    .eq('id', publishURL);
  if (error) {
    console.error('[Publish] delete error:', error);
    throw error;
  }
  console.log('[Publish] delete success');
};

const pendingPublishSyncs = new Map<string, ReturnType<typeof setTimeout>>();

const schedulePublishSync = (
  store: S.Store,
  noteId: T.EntityId,
  delay = 2000
) => {
  const existing = pendingPublishSyncs.get(noteId);
  if (existing) clearTimeout(existing);

  pendingPublishSyncs.set(
    noteId,
    setTimeout(() => {
      pendingPublishSyncs.delete(noteId);
      const note = store.getState().data.notes.get(noteId);
      if (!note?.publishURL || !note.systemTags.includes('published')) return;

      void syncPublicNote({
        noteId,
        title: note.content.split('\n')[0] || 'Untitled',
        content: note.content,
        updatedAt: new Date(note.modificationDate * 1000).toISOString(),
        publishURL: note.publishURL,
        shouldPublish: true,
      }).catch((error) => {
        console.error(
          '[Publish] Debounced sync failed:',
          (error as Error).message
        );
      });
    }, delay)
  );
};

export const middleware: S.Middleware =
  (store) =>
  (next: (action: A.ActionType) => A.ActionType) =>
  (action: A.ActionType) => {
    const state = store.getState();

    switch (action.type) {
      case 'CREATE_NOTE': {
        const noteId = uuid() as T.EntityId;

        // preserve last markdown setting; for brand new users with no notes
        // yet, default Markdown ON (1TXT is markdown-first).
        const topNoteId = state.ui.filteredNotes[0];
        const topNote = topNoteId && state.data.notes.get(topNoteId);
        const useMarkdown = topNote
          ? topNote.systemTags.includes('markdown')
          : true;
        const markdownInNote =
          action.note?.systemTags?.indexOf('markdown') ?? -1;
        const systemTags = action.note?.systemTags?.slice() ?? [];

        if (useMarkdown && -1 === markdownInNote) {
          systemTags.push('markdown');
        } else if (!useMarkdown && markdownInNote >= 0) {
          systemTags.splice(markdownInNote, 1);
        }

        // apply selected tag by default
        const selectedTag = openedTag(state);
        const givenTags = action.note?.tags ?? [];
        const tags = selectedTag ? withTag(givenTags, selectedTag) : givenTags;

        return next({
          type: 'CREATE_NOTE_WITH_ID',
          noteId,
          note: { ...action.note, systemTags, tags },
          meta: {
            nextNoteToOpen: noteId,
          },
        });
      }

      case 'DELETE_OPEN_NOTE_FOREVER':
        if (!state.ui.openedNote) {
          return;
        }

        return next({
          type: 'DELETE_NOTE_FOREVER',
          noteId: state.ui.openedNote,
        });

      case 'EMPTY_TRASH': {
        const result = next(action);
        state.data.notes.forEach((note, noteId) => {
          if (note.deleted) {
            store.dispatch({ type: 'DELETE_NOTE_FOREVER', noteId: noteId });
          }
        });
        return result;
      }

      case 'EXPORT_NOTES':
        exportZipArchive(state.data.notes);
        return next(action);

      case 'IMPORT_NOTE':
        return next({
          type: 'IMPORT_NOTE_WITH_ID',
          noteId: uuid() as T.EntityId,
          note: action.note,
        });

      case 'EDIT_NOTE': {
        const editNote = state.data.notes.get(action.noteId);
        if (editNote?.publishURL && editNote.systemTags.includes('published')) {
          schedulePublishSync(store, action.noteId);
        }
        return next(action);
      }

      case 'OPEN_NOTE':
      case 'SELECT_NOTE': {
        // Before opening the new note, sync the currently-open note
        // to Supabase if it's published — keeps the public copy up to date.
        const leavingNoteId = state.ui.openedNote;
        if (leavingNoteId && leavingNoteId !== action.noteId) {
          const leavingNote = state.data.notes.get(leavingNoteId);
          if (
            leavingNote?.publishURL &&
            leavingNote.systemTags.includes('published')
          ) {
            void syncPublicNote({
              noteId: leavingNoteId,
              title: leavingNote.content.split('\n')[0] || 'Untitled',
              content: leavingNote.content,
              updatedAt: new Date(
                leavingNote.modificationDate * 1000
              ).toISOString(),
              publishURL: leavingNote.publishURL,
              shouldPublish: true,
            }).catch((error) => {
              console.error(
                '[Publish] Auto-sync failed:',
                (error as Error).message
              );
            });
          }
        }
        return next(action);
      }

      case 'RESTORE_OPEN_NOTE':
        if (!state.ui.openedNote) {
          return;
        }

        return next({
          type: 'RESTORE_NOTE',
          noteId: state.ui.openedNote,
        });

      case 'PUBLISH_NOTE': {
        if (!state.data.notes.has(action.noteId)) {
          return next(action);
        }

        const note = state.data.notes.get(action.noteId)!;
        const nextPublishURL = action.shouldPublish
          ? action.publishURL || note.publishURL || uuid()
          : '';
        const syncPublishURL = action.shouldPublish
          ? nextPublishURL
          : action.publishURL || note.publishURL || '';

        const result = next({
          ...action,
          publishURL: nextPublishURL,
        } as A.PublishNote);

        if (syncPublishURL) {
          void syncPublicNote({
            noteId: action.noteId,
            title: note.content.split('\n')[0] || 'Untitled',
            content: note.content,
            updatedAt: new Date(note.modificationDate * 1000).toISOString(),
            publishURL: syncPublishURL,
            shouldPublish: action.shouldPublish,
          }).catch((error) => {
            console.error('[Publish] Sync failed:', {
              message: (error as Error).message,
              shouldPublish: action.shouldPublish,
              publishURL: syncPublishURL,
            });
            if (action.shouldPublish) {
              store.dispatch({
                ...action,
                shouldPublish: false,
                publishURL: syncPublishURL,
              } as A.PublishNote);
            }
          });
        }

        return result;
      }

      case 'TRASH_OPEN_NOTE':
        if (!state.ui.openedNote) {
          return;
        }

        return next({
          type: 'TRASH_NOTE',
          noteId: state.ui.openedNote,
        });

      case 'TRASH_TAG':
        return state.data.tags.has(tagHashOf(action.tagName))
          ? next({
              ...action,
              remainingTags: numberOfNonEmailTags(state) - 1,
            })
          : null;

      default:
        return next(action);
    }
  };

export default middleware;
