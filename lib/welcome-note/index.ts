import { v4 as uuid } from 'uuid';

import * as S from '../state';
import * as T from '../types';

/**
 * The first-launch welcome note.
 *
 * Why this exists
 * ---------------
 * A brand new account staring at an empty editor learns nothing about what
 * 1TXT can do. Every "official" markdown app handles this the same way: seed
 * one short welcome document the very first time the app is opened. We
 * follow the Simplenote / Bear / Obsidian / Joplin pattern of a single,
 * friendly note that points at the most-used parts of the UI.
 *
 * Sync model
 * ----------
 * The welcome note is created via a regular `CREATE_NOTE_WITH_ID` action,
 * which means:
 *   - It is saved to IndexedDB like any other note.
 *   - It is queued for upload by the Supabase sync middleware.
 *   - On a second device the user just signs in and gets the same welcome
 *     pulled down — we will NOT re-seed because `data.notes.size > 0`
 *     after the initial sync.
 *   - If the user deletes it, it stays deleted across devices.
 *
 * Re-seeding rules
 * ----------------
 * Seeding happens at most once per device:
 *   - We require `awaitInitialSync === true` (i.e., a fresh OTP login that
 *     just completed initial sync) so we know the empty state is real and
 *     not just "sync hasn't pulled anything yet".
 *   - We require `data.notes.size === 0` after sync.
 *   - We persist a localStorage flag (`1txt:welcome-note-seeded`) so a user
 *     who signs out / back in on the same device doesn't get a duplicate.
 *
 * Edge case: if a user wipes their cloud account empty and signs in on a
 * brand-new machine (no localStorage flag), they will see a fresh welcome
 * note. That is acceptable — the alternative is staring at an empty app.
 */

const SEEDED_FLAG_KEY = '1txt:welcome-note-seeded';

export const WELCOME_NOTE_CONTENT = `## Welcome to 1TXT

1TXT is a minimalist, markdown-standard note-taking application that supports
synchronization across different devices.

## Get Started

- **Switch Views**
  - Use the \`</>\` (Source Code) and \`Aa\` (WYSIWYG) buttons
    in the top right toolbar.
- **Insert Markdown Formatting**
  - Click the **MI** label to quickly get example content (including
    headings, lists, links, code blocks, etc.).
- **Tags**
  - Add a tag in the "Add tag…" field at the bottom.
  - Click a tag later to filter notes by that tag.
  - You can also find tags via search or the menu.
  - Use **tags** instead of folders to keep things minimal and flat.
- **Publish**
  - Click **publish** in the top right menu to share your note
    with anyone.
  - Demo: [The Story of 1txt](/p/a14ce330-161f-4125-9f00-1461ded6c8ae)

> Happy Writing!
> Official Website: [1txt.xyz](https://1txt.xyz)
`;

type SeedOptions = {
  /**
   * If true, also dispatch SET_EDITOR_VIEW_MODE → 'wysiwyg' so the welcome
   * note is rendered, not raw. We only do this on the seed itself, never
   * for subsequent notes the user opens — their view-mode preference is
   * theirs to keep.
   */
  forceWysiwyg?: boolean;
};

export const seedWelcomeNoteIfNeeded = (
  store: S.Store,
  options: SeedOptions = {}
): T.EntityId | null => {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  if (localStorage.getItem(SEEDED_FLAG_KEY) === '1') {
    return null;
  }

  const state = store.getState();

  // If the user already has notes (e.g., they signed in on a new device with
  // an existing account), we don't seed — but we do mark the flag so we
  // never bother checking again on this machine.
  if (state.data.notes.size > 0) {
    localStorage.setItem(SEEDED_FLAG_KEY, '1');
    return null;
  }

  const noteId = uuid() as T.EntityId;
  const now = Date.now() / 1000;

  store.dispatch({
    type: 'CREATE_NOTE_WITH_ID',
    noteId,
    note: {
      content: WELCOME_NOTE_CONTENT,
      systemTags: ['markdown'],
      tags: [],
      creationDate: now,
      modificationDate: now,
      deleted: false,
      publishURL: '',
      shareURL: '',
    },
    meta: {
      nextNoteToOpen: noteId,
    },
  } as any);

  store.dispatch({ type: 'SELECT_NOTE', noteId } as any);

  if (options.forceWysiwyg) {
    store.dispatch({
      type: 'SET_EDITOR_VIEW_MODE',
      mode: 'wysiwyg',
    } as any);
  }

  localStorage.setItem(SEEDED_FLAG_KEY, '1');
  return noteId;
};
