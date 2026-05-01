import { v4 as uuid } from 'uuid';

import { tagHashOf } from '../../utils/tag-hash';
import exportZipArchive from '../../utils/export';
import { withTag } from '../../utils/tag-hash';

import type * as A from '../action-types';
import type * as S from '../';
import type * as T from '../../types';
import { numberOfNonEmailTags, openedTag } from '../selectors';

const getPublicNoteApiBaseUrl = () => {
  if (
    typeof window !== 'undefined' &&
    /^https?:/.test(window.location.origin)
  ) {
    return window.location.origin;
  }

  return config.public_web_url?.replace(/\/$/, '') || '';
};

const getStoredAccessToken = () => {
  if (typeof window === 'undefined') return '';

  const storedUserData = localStorage.getItem('stored_user');
  if (storedUserData) {
    try {
      const storedUser = JSON.parse(storedUserData);
      if (storedUser?.accessToken) {
        return storedUser.accessToken;
      }
    } catch (e) {
      // Ignore malformed legacy auth state and fall back to access_token.
    }
  }

  return localStorage.getItem('access_token') || '';
};

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
  const baseUrl = getPublicNoteApiBaseUrl();
  if (!baseUrl) return;

  const endpoint = `${baseUrl}/api/public-notes${shouldPublish ? '' : `/${publishURL}`}`;
  const accessToken = getStoredAccessToken();
  const headers: Record<string, string> = {};

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (shouldPublish) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: publishURL,
        noteId,
        title,
        content,
        updatedAt,
      }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return;
  }

  const response = await fetch(endpoint, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
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
            console.error('[Publish] Sync failed:', error);
            if (typeof window !== 'undefined') {
              window.alert?.(
                action.shouldPublish
                  ? 'Publish failed. Please try again.'
                  : 'Unpublish failed. Please try again.'
              );
            }
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
