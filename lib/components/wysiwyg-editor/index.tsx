import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

import actions from '../../state/actions';
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

    const vd = new Vditor(containerRef.current, {
      mode: 'wysiwyg',
      value: note?.content || '',
      height: '100%',
      toolbar: [],
      outline: { enable: false, position: 'left' },
      counter: { enable: false },
      cache: { enable: false },
      theme: document.body.classList.contains('theme__dark')
        ? 'dark'
        : 'classic',
      // Vditor calls this function for each block type, must be a function
      customWysiwygToolbar: () => {},
      preview: {
        theme: {
          current: document.body.classList.contains('theme__dark')
            ? 'dark'
            : 'light',
        },
        hljs: { style: 'github' },
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
