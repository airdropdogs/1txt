import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

import actions from '../../state/actions';
import {
  INSERT_MARKDOWN_EVENT,
  InsertMarkdownDetail,
} from '../../note-toolbar/markdown-snippets';
import * as S from '../../state';
import * as T from '../../types';

type OwnProps = {
  noteId: T.EntityId;
};

type StateProps = {
  note: T.Note | null;
  noteId: T.EntityId;
};

type DispatchProps = {
  editNote: (noteId: T.EntityId, changes: Partial<T.Note>) => any;
};

type Props = OwnProps & StateProps & DispatchProps;

// The app sets the theme as `body[data-theme='light' | 'dark']`. The legacy
// "theme__dark" *class* check used here at first never matched, so Vditor was
// always being constructed with the 'classic' (light) theme — that's the
// reason inline code and fenced blocks blended into the background in dark
// mode. Read from data-theme instead.
const isDarkTheme = (): boolean =>
  typeof document !== 'undefined' && document.body.dataset.theme === 'dark';

// CSS injected AFTER Vditor init, using real class names from Vditor source
const OVERRIDE_CSS = `
/* Hide the popover (up/down/delete floating bar) */
.vditor-panel { display: none !important; }

/* Hide heading labels (H1, H2, H3, H4, H5, H6) */
.vditor-wysiwyg > .vditor-reset > h1::before,
.vditor-wysiwyg > .vditor-reset > h2::before,
.vditor-wysiwyg > .vditor-reset > h3::before,
.vditor-wysiwyg > .vditor-reset > h4::before,
.vditor-wysiwyg > .vditor-reset > h5::before,
.vditor-wysiwyg > .vditor-reset > h6::before,
.vditor-wysiwyg div.vditor-wysiwyg__block::before,
.vditor-wysiwyg div[data-type="link-ref-defs-block"]::before,
.vditor-wysiwyg div[data-type="footnotes-block"]::before,
.vditor-wysiwyg .vditor-toc::before {
  content: none !important;
  display: none !important;
}

/* Hide Vditor toolbar */
.vditor-toolbar { display: none !important; }

/* Remove border, full height */
.vditor {
  border: none !important;
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}

/* Vditor content fills available space and scrolls */
.vditor-content {
  flex: 1 1 auto !important;
  overflow: hidden !important;
  display: flex !important;
  min-height: 0 !important;
}

.vditor-wysiwyg {
  height: 100% !important;
  overflow: hidden !important;
}

/* THE scrollable element — this is where text lives */
.vditor-wysiwyg pre.vditor-reset {
  /* Match Simplenote Narrow width by default */
  padding: 16px calc((100% - 768px) / 2) !important;
  font-size: 16px !important;
  line-height: 1.7 !important;
  overflow-y: auto !important;
  height: 100% !important;
}

@media only screen and (max-width: 1400px) {
  .vditor-wysiwyg pre.vditor-reset {
    padding: 16px 10% !important;
  }
}

/* Match Simplenote Full width when App has .is-line-length-full */
.is-line-length-full .vditor-wysiwyg pre.vditor-reset {
  padding: 16px 25px !important;
}

/* Fix note-editor flex to allow shrink and fill width */
.note-editor {
  min-height: 0 !important;
  flex: 1 1 auto !important;
  overflow: hidden !important;
  width: 100% !important;
}

/* Ensure wrapper fills entire area */
.note-detail-wrapper {
  width: 100% !important;
}

/* Ensure container ignores padding for pure 100% width matching */
.note-detail-wrapper .vditor {
  width: 100% !important;
  max-width: 100% !important;
}

/* ─────────────────────────────────────────────────────────────────────────
   Code rendering (light theme).

   Vditor's stock styles in WYSIWYG mode give inline <code> almost no
   contrast against the editor background — on dark themes the foreground
   and background end up only ~5% apart and the text is essentially
   invisible. We force GitHub-ish high-contrast colors that work in both
   themes (the dark overrides live in the block below this one).
   ───────────────────────────────────────────────────────────────────── */
.vditor-wysiwyg .vditor-reset :not(pre) > code {
  background: rgba(175, 184, 193, 0.22);
  color: #cf222e;
  padding: 0.15em 0.4em;
  margin: 0 0.1em;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.92em;
}

.vditor-wysiwyg .vditor-reset pre {
  background: #f6f8fa !important;
  color: #24292f !important;
  padding: 12px 14px !important;
  border-radius: 6px !important;
  border: 1px solid #d0d7de !important;
  overflow-x: auto !important;
  margin: 1em 0 !important;
}

.vditor-wysiwyg .vditor-reset pre > code {
  background: transparent !important;
  color: inherit !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace !important;
  font-size: 0.92em !important;
  display: block;
}

/* Dark theme overrides */
body[data-theme='dark'] .vditor-wysiwyg .vditor-reset :not(pre) > code {
  background: rgba(110, 118, 129, 0.4);
  color: #ff7b72;
}

body[data-theme='dark'] .vditor-wysiwyg .vditor-reset pre {
  background: #161b22 !important;
  color: #c9d1d9 !important;
  border-color: #30363d !important;
}
`;

const WysiwygEditor: React.FC<Props> = ({ editNote, note, noteId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const vditorRef = useRef<Vditor | null>(null);
  const isInternalUpdate = useRef(false);
  const lastNoteId = useRef<string>('');

  useEffect(() => {
    if (!containerRef.current) return;

    // Inject CSS overrides once
    if (!document.getElementById('1txt-vditor-overrides')) {
      const style = document.createElement('style');
      style.id = '1txt-vditor-overrides';
      style.textContent = OVERRIDE_CSS;
      document.head.appendChild(style);
    }

    const dark = isDarkTheme();
    const vd = new Vditor(containerRef.current, {
      mode: 'wysiwyg',
      value: note?.content || '',
      height: '100%',
      toolbar: [],
      outline: { enable: false, position: 'left' },
      counter: { enable: false },
      cache: { enable: false },
      theme: dark ? 'dark' : 'classic',
      // Vditor calls this function for each block type, must be a function
      customWysiwygToolbar: () => {},
      preview: {
        theme: {
          current: dark ? 'dark' : 'light',
        },
        hljs: { style: dark ? 'github-dark' : 'github' },
      },
      input: (value: string) => {
        if (!isInternalUpdate.current && noteId) {
          editNote(noteId, { content: value });
        }
      },
      after: () => {
        vditorRef.current = vd;
        lastNoteId.current = noteId;
      },
    } as any);

    return () => {
      vditorRef.current?.destroy();
      vditorRef.current = null;
    };
  }, [noteId]);

  // Listen to the toolbar's "Insert Markdown" dropdown. Vditor exposes
  // `insertValue(value, render)` — passing `render: true` makes Vditor
  // immediately re-parse and rerender the inserted markdown so a heading
  // snippet shows up as an actual H1, a list as a real list, etc. Without
  // `render: true` the raw markdown text would just get pasted in.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<InsertMarkdownDetail>).detail;
      if (!detail || typeof detail.snippet !== 'string') return;
      const vd = vditorRef.current;
      if (!vd) return;
      try {
        vd.insertValue(detail.snippet, true);
      } catch (err) {
        console.warn('[WysiwygEditor] insertValue failed:', err);
      }
    };
    window.addEventListener(INSERT_MARKDOWN_EVENT, handler, true);
    return () =>
      window.removeEventListener(INSERT_MARKDOWN_EVENT, handler, true);
  }, []);

  // Sync external changes
  useEffect(() => {
    if (!vditorRef.current || !note?.content) return;
    if (lastNoteId.current !== noteId) return;

    const currentValue = vditorRef.current.getValue();
    if (currentValue !== note.content) {
      isInternalUpdate.current = true;
      vditorRef.current.setValue(note.content);
      setTimeout(() => {
        isInternalUpdate.current = false;
      }, 50);
    }
  }, [note?.content]);

  // ─────────────────────────────────────────────────────────────────────
  // Live theme switching for Vditor.
  //
  // Vditor's theme is baked in at construction time. If we don't react
  // to theme changes, switching the app theme leaves Vditor running with
  // the previous theme's CSS — visible as washed-out colors, the wrong
  // syntax-highlight palette, and (most annoyingly) preview-mode color
  // residue. Calling `setTheme(theme, contentTheme, codeTheme)` swaps
  // all three in place without losing cursor / scroll state.
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof MutationObserver === 'undefined') return;
    const apply = () => {
      const vd = vditorRef.current as any;
      if (!vd || typeof vd.setTheme !== 'function') return;
      const dark = isDarkTheme();
      try {
        vd.setTheme(
          dark ? 'dark' : 'classic',
          dark ? 'dark' : 'light',
          dark ? 'github-dark' : 'github'
        );
      } catch (err) {
        console.warn('[WysiwygEditor] setTheme failed:', err);
      }
    };
    const observer = new MutationObserver((mutations) => {
      if (
        mutations.some(
          (m) => m.type === 'attributes' && m.attributeName === 'data-theme'
        )
      ) {
        apply();
      }
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  if (!note) return null;

  return (
    <div
      className="note-detail-wrapper"
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        minHeight: 0,
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <div
        ref={containerRef}
        style={{
          flex: '1 1 auto',
          minHeight: 0,
          height: '100%',
          overflow: 'hidden',
        }}
      />
    </div>
  );
};

const mapStateToProps: S.MapState<StateProps, OwnProps> = (state, props) => {
  const noteId = props.noteId ?? state.ui.openedNote;
  return {
    note: state.data.notes.get(noteId) || null,
    noteId,
  };
};

const mapDispatchToProps: S.MapDispatch<DispatchProps> = {
  editNote: actions.data.editNote,
};

export default connect(mapStateToProps, mapDispatchToProps)(WysiwygEditor);
