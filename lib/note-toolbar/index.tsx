import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CmdOrCtrl } from '../utils/platform';

import BackIcon from '../icons/back';
import EllipsisOutlineIcon from '../icons/ellipsis-outline';
import IconButton from '../icon-button';
import NewNoteIcon from '../icons/new-note';
import SidebarIcon from '../icons/sidebar';
import InsertMenu from './insert-menu';
import actions from '../state/actions';

import * as S from '../state';
import * as T from '../types';

type StateProps = {
  editMode: boolean;
  editorViewMode: 'source' | 'wysiwyg' | 'preview';
  markdownEnabled: boolean;
  note: T.Note | null;
  showPreviewButton: boolean;
};

type DispatchProps = {
  deleteNoteForever: () => any;
  newNote: () => any;
  restoreNote: () => any;
  toggleEditMode: () => any;
  toggleFocusMode: () => any;
  toggleNoteActions: () => any;
  toggleNoteList: () => any;
  setViewMode: (mode: string) => any;
};

type Props = DispatchProps & StateProps & React.HTMLProps<HTMLDivElement>;

export class NoteToolbar extends Component<Props> {
  static displayName = 'NoteToolbar';

  render() {
    const { 'aria-hidden': ariaHidden, note } = this.props;
    return (
      <div aria-hidden={ariaHidden} className="note-toolbar-wrapper">
        {note?.deleted ? this.renderTrashed() : this.renderNormal()}
      </div>
    );
  }

  renderNormal = () => {
    const {
      newNote,
      markdownEnabled,
      note,
      showPreviewButton,
      toggleNoteActions,
    } = this.props;

    return !note ? (
      <div className="note-toolbar-placeholder" />
    ) : (
      <div aria-label="note actions" role="toolbar" className="note-toolbar">
        <div className="note-toolbar__column-left">
          <div className="note-toolbar__button new-note-toolbar__button-sidebar">
            <IconButton
              icon={<NewNoteIcon />}
              onClick={() => newNote()}
              title={`New Note • ${CmdOrCtrl}+Shift+I`}
            />
          </div>
          <div className="note-toolbar__button note-toolbar__button-sidebar">
            <IconButton
              icon={<SidebarIcon />}
              onClick={this.props.toggleFocusMode}
              title="Toggle Focus Mode"
            />
          </div>
          <div className="note-toolbar__button note-toolbar-back">
            <IconButton
              icon={<BackIcon />}
              onClick={this.props.toggleNoteList}
              title={`Back • ${CmdOrCtrl}+Shift+L`}
            />
          </div>
        </div>
        <div className="note-toolbar__column-right">
          {markdownEnabled && (
            <div className="note-toolbar__mode-switcher">
              <button
                type="button"
                className={`mode-btn ${this.props.editorViewMode === 'source' ? 'active' : ''}`}
                onClick={() => this.props.setViewMode('source')}
                title="Source"
              >
                &lt;/&gt;
              </button>
              <button
                type="button"
                className={`mode-btn ${this.props.editorViewMode === 'wysiwyg' ? 'active' : ''}`}
                onClick={() => this.props.setViewMode('wysiwyg')}
                title="WYSIWYG"
              >
                Aa
              </button>
              {showPreviewButton && (
                <button
                  type="button"
                  className={`mode-btn ${this.props.editorViewMode === 'preview' ? 'active' : ''}`}
                  onClick={() => this.props.setViewMode('preview')}
                  title="Preview (read-only)"
                >
                  👁
                </button>
              )}
            </div>
          )}
          {/* Insert Markdown only makes sense for markdown notes — for plain
              text notes the snippets would just dump literal `# ` / `**bold**`
              characters that nothing renders. So when a user turns Markdown
              off in Note Actions we hide the trigger entirely. */}
          {markdownEnabled && (
            <div className="note-toolbar__button">
              <InsertMenu />
            </div>
          )}
          <div className="note-toolbar__button">
            <IconButton
              icon={<EllipsisOutlineIcon />}
              onClick={toggleNoteActions}
              title="Actions"
            />
          </div>
        </div>
      </div>
    );
  };

  renderTrashed = () => {
    return (
      <div className="note-toolbar-trashed">
        <div className="note-toolbar__column-left">
          <IconButton
            icon={<BackIcon />}
            onClick={this.props.toggleNoteList}
            title={`Back • ${CmdOrCtrl}+Shift+L`}
          />
        </div>
        <div className="note-toolbar__column-right">
          <div className="note-toolbar__button">
            <button
              type="button"
              className="button button-compact button-danger"
              onClick={this.props.deleteNoteForever}
            >
              Delete Forever
            </button>
          </div>
          <div className="note-toolbar__button">
            <button
              type="button"
              className="button button-primary button-compact"
              onClick={this.props.restoreNote}
            >
              Restore Note
            </button>
          </div>
        </div>
      </div>
    );
  };
}

const mapStateToProps: S.MapState<StateProps> = ({
  data,
  settings,
  ui: { editMode, editorViewMode, openedNote },
}) => {
  const note = openedNote ? (data.notes.get(openedNote) ?? null) : null;

  return {
    editMode,
    editorViewMode,
    markdownEnabled: note?.systemTags.includes('markdown') || false,
    note,
    showPreviewButton: !!settings.showPreviewButton,
  };
};

const mapDispatchToProps: S.MapDispatch<DispatchProps> = {
  deleteNoteForever: actions.ui.deleteOpenNoteForever,
  newNote: actions.ui.createNote,
  restoreNote: actions.ui.restoreOpenNote,
  toggleEditMode: actions.ui.toggleEditMode,
  toggleFocusMode: actions.settings.toggleFocusMode,
  toggleNoteActions: actions.ui.toggleNoteActions,
  toggleNoteList: actions.ui.toggleNoteList,
  setViewMode: (mode: string) => ({
    type: 'SET_EDITOR_VIEW_MODE' as const,
    mode: mode as 'source' | 'wysiwyg' | 'preview',
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteToolbar as any);
