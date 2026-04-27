import React, { Component, RefObject, createRef } from 'react';
import { connect } from 'react-redux';
import { Overlay } from 'react-overlays';
import { invoke, negate } from 'lodash';

import isEmailTag from '../utils/is-email-tag';
import EmailToolTip from '../tag-email-tooltip';
import TagChip from '../components/tag-chip';
import TagInput from '../tag-input';
import classNames from 'classnames';
import { tagHashOf, MAX_TAG_HASH_LENGTH } from '../utils/tag-hash';
import { noteCanonicalTags } from '../state/selectors';

import type * as S from '../state';
import type * as T from '../types';

type OwnProps = {
  storeFocusTagField: (focusSetter: () => any) => any;
  storeHasFocus: (focusGetter: () => boolean) => any;
};

type OwnState = {
  selectedTag: T.TagName;
  showEmailTooltip?: boolean;
  tagInput: string;
};

type StateProps = {
  tags: T.TagName[];
  keyboardShortcuts: boolean;
  noteId: T.EntityId | null;
  note: T.Note | undefined;
};

type DispatchProps = {
  addTag: (noteId: T.EntityId, tagName: T.TagName) => any;
  openTag: (tagName: T.TagName) => any;
  removeTag: (noteId: T.EntityId, tagName: T.TagName) => any;
};

type Props = OwnProps & DispatchProps & StateProps;

const KEY_BACKSPACE = 8;
const KEY_TAB = 9;
const KEY_RIGHT = 39;

export class TagField extends Component<Props, OwnState> {
  container = createRef<HTMLDivElement>();
  focusInput?: () => any;
  hiddenTag?: RefObject<HTMLInputElement> | null;
  inputHasFocus?: () => boolean;
  tagInput = createRef<HTMLDivElement>();

  static displayName = 'TagField';

  state = {
    selectedTag: '' as T.TagName,
    showEmailTooltip: false,
    tagInput: '',
  };

  componentDidMount() {
    this.props.storeFocusTagField(this.focusTagField);
    this.props.storeHasFocus(this.hasFocus);

    document.addEventListener('click', this.unselect, true);
    window.addEventListener('keydown', this.preventStealingFocus, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.unselect, true);
    window.removeEventListener('keydown', this.preventStealingFocus, true);
  }

  componentDidUpdate() {
    if (this.hasSelection()) {
      this.hiddenTag?.current?.focus();
    }
  }

  addTag = (tags: string) => {
    const { note, noteId } = this.props;
    const newTags = tags.trim().replace(/\s+/g, ',').split(',') as T.TagName[];

    if (newTags.some(isEmailTag)) {
      this.showEmailTooltip();
    }

    const sameTags = new Set(note.tags.map(tagHashOf));

    newTags.forEach((tag) => {
      if (sameTags.has(tagHashOf(tag))) {
        return;
      }

      sameTags.add(tagHashOf(tag));
      this.props.addTag(noteId, tag);
    });

    this.storeTagInput('');
    invoke(this, 'tagInput.focus');
  };

  hasSelection = () =>
    this.state.selectedTag && !!this.state.selectedTag.length;

  deleteTag = (tagName: T.TagName) => {
    const { noteId } = this.props;
    const { selectedTag } = this.state;

    this.props.removeTag(noteId, tagName);

    if (selectedTag === tagName) {
      this.setState({ selectedTag: '' as T.TagName }, () =>
        this.tagInput?.current?.focus()
      );
    }
  };

  deleteSelection = () => {
    if (this.hasSelection()) {
      this.deleteTag(this.state.selectedTag as T.TagName);
    }
  };

  hideEmailTooltip = () => this.setState({ showEmailTooltip: false });

  hasFocus = () => !!this.inputHasFocus && this.inputHasFocus();

  focusTagField = () => this.focusInput && this.focusInput();

  interceptKeys: React.KeyboardEventHandler = (e) => {
    if (KEY_BACKSPACE === e.which) {
      if ('' !== this.state.tagInput) {
        return;
      }

      if (this.hasSelection()) {
        this.deleteSelection();
      }

      this.selectLastTag();
      e.preventDefault();
      return;
    }
    if (KEY_RIGHT === e.which && this.hasSelection()) {
      this.unselect(e);
      this.focusTagField();
      return;
    }
    if (KEY_TAB === e.which && this.hasSelection()) {
      this.unselect(e);
      return;
    }
    if (this.hasSelection()) {
      this.unselect(e);
    }
  };

  preventStealingFocus = ({
    ctrlKey,
    key,
    metaKey,
    shiftKey,
  }: KeyboardEvent) => {
    if (!this.props.keyboardShortcuts) {
      return;
    }
    const cmdOrCtrl = ctrlKey || metaKey;

    if (cmdOrCtrl && shiftKey && 'y' === key.toLowerCase()) {
      this.setState({ selectedTag: '' as T.TagName });
    }

    return true;
  };

  selectLastTag = () =>
    this.setState({
      selectedTag: this.props.note?.tags.slice(-1).shift() as T.TagName,
    });

  // Clicking a tag chip's body now means "jump to this tag" (i.e. switch the
  // sidebar collection to that tag, mirroring sidebar tag clicks). The actual
  // removal moved to the explicit × button on the chip.
  jumpToTag = (event: React.MouseEvent<HTMLDivElement>) => {
    const {
      currentTarget: {
        dataset: { tagName },
      },
    } = event;

    if (!tagName) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.props.openTag(tagName as T.TagName);
  };

  // Invoked by TagChip's × button. The chip already stops propagation on its
  // own click handler so we don't receive a phantom jumpToTag call.
  removeTagChip = (tagName: T.TagName) => {
    this.deleteTag(tagName);
  };

  showEmailTooltip = () => {
    this.setState({ showEmailTooltip: true });

    setTimeout(() => this.setState({ showEmailTooltip: false }), 5000);
  };

  onKeyDown = (e: React.KeyboardEvent) => {
    if (this.state.showEmailTooltip) {
      this.hideEmailTooltip();
    }

    if (
      tagHashOf(this.state.tagInput as T.TagName).length >
        MAX_TAG_HASH_LENGTH &&
      String.fromCharCode(e.which).match(/([^,\s])/g)
    ) {
      e.preventDefault();
    }

    return this.interceptKeys(e);
  };

  storeFocusInput = (f: () => any) => (this.focusInput = f);

  storeHasFocus = (f: () => any) => (this.inputHasFocus = f);

  storeHiddenTag = (r: RefObject<HTMLInputElement>) => (this.hiddenTag = r);

  storeInputRef = (r: RefObject<HTMLDivElement>) => (this.tagInput = r);

  storeTagInput = (value: string, callback?: (...args: any) => any) =>
    this.setState({ tagInput: value }, callback);

  unselect = (event: React.KeyboardEvent | MouseEvent) => {
    if (!this.state.selectedTag) {
      return;
    }

    if (
      this.hiddenTag?.current !== event.relatedTarget ||
      this.hiddenTag?.current === undefined
    ) {
      this.setState({ selectedTag: '' as T.TagName });
    }
  };

  render() {
    const { tags } = this.props;
    const { selectedTag, showEmailTooltip, tagInput } = this.state;

    return (
      <div ref={this.container} className="tag-field">
        <div
          aria-label="Tags for the current note. Click a tag to filter the list by it, click × to remove."
          className={classNames('tag-editor', {
            'has-selection': this.hasSelection(),
          })}
          tabIndex={-1}
          onKeyDown={this.onKeyDown}
        >
          <input
            aria-hidden="true"
            className="hidden-tag"
            tabIndex={-1}
            ref={this.storeHiddenTag}
          />
          {tags.map((tagName) => (
            <TagChip
              key={tagName}
              tagName={tagName}
              selected={tagName === selectedTag}
              onSelect={this.jumpToTag}
              onRemove={this.removeTagChip}
            />
          ))}
          <TagInput
            inputRef={this.storeInputRef}
            value={tagInput}
            onChange={this.storeTagInput}
            onSelect={this.addTag}
            storeFocusInput={this.storeFocusInput}
            storeHasFocus={this.storeHasFocus}
          />
          <Overlay
            container={this.container.current}
            onHide={this.hideEmailTooltip}
            placement="top"
            rootClose={true}
            shouldUpdatePosition={true}
            show={showEmailTooltip}
            target={this.tagInput.current}
          >
            {() => <EmailToolTip />}
          </Overlay>
        </div>
      </div>
    );
  }
}

const mapStateToProps: S.MapState<StateProps> = (state) => {
  const noteId = state.ui.openedNote;
  const note = noteId ? state.data.notes.get(noteId) : undefined;
  const tags = noteId ? noteCanonicalTags(state, note) : [];

  return {
    tags,
    keyboardShortcuts: state.settings.keyboardShortcuts,
    noteId,
    note,
  };
};

export default connect(mapStateToProps, {
  addTag: (noteId, tagName) => ({
    type: 'ADD_NOTE_TAG',
    noteId,
    tagName,
  }),
  openTag: (tagName) => ({
    type: 'OPEN_TAG',
    tagName,
  }),
  removeTag: (noteId, tagName) => ({
    type: 'REMOVE_NOTE_TAG',
    noteId,
    tagName,
  }),
} as S.MapDispatch<DispatchProps>)(TagField);
