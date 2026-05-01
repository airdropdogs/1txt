'use strict';
(self.webpackChunk = self.webpackChunk || []).push([
  [9403],
  {
    16760: (e, t, o) => {
      o.r(t), o.d(t, { NoteEditor: () => J, default: () => $ });
      var n = o(41705),
        i = o(63696),
        r = o(80249),
        s = o(255);
      function a() {
        return i.createElement(
          'svg',
          {
            className: 'icon-chevron-right',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          i.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          i.createElement('path', {
            d: 'M10.11 21.19L8.7 19.78 16.48 12 8.7 4.22l1.41-1.41L19.3 12 10.11 21.19z',
          })
        );
      }
      var l = (e) => {
        var {
          selectedSearchMatchIndex: t,
          numberOfMatchesInNote: o,
          setSearchSelection: n,
        } = e;
        return i.createElement(
          'div',
          { className: 'search-results' },
          i.createElement(
            'div',
            null,
            null === t
              ? ''.concat(o, ' ').concat(o > 1 ? 'Results' : 'Result')
              : ''.concat(t + 1, ' of ').concat(o)
          ),
          i.createElement(
            'span',
            { className: 'search-results-next' },
            i.createElement(s.A, {
              disabled: o <= 1,
              icon: i.createElement(a, null),
              onClick: (e) => {
                n((o + (null != t ? t : -1) + 1) % o);
              },
              title: 'Next',
            })
          ),
          i.createElement(
            'span',
            { className: 'search-results-prev' },
            i.createElement(s.A, {
              disabled: o <= 1,
              icon: i.createElement(a, null),
              onClick: (e) => {
                n((o + (null != t ? t : -1) - 1) % o);
              },
              title: 'Prev',
            })
          )
        );
      };
      l.displayName = 'SearchResultsBar';
      const d = (0, r.Ng)(
        (e) => {
          var {
            ui: { selectedSearchMatchIndex: t, numberOfMatchesInNote: o },
          } = e;
          return { selectedSearchMatchIndex: t, numberOfMatchesInNote: o };
        },
        (e) => ({
          setSearchSelection: (t) =>
            e({ type: 'STORE_SEARCH_SELECTION', index: t }),
        })
      )(l);
      var c = o(60832),
        h = o(17243),
        u = o(59874),
        p = o(27528);
      const g = (0, r.Ng)(null, (e) => ({
        openShareDialog: () => e((0, p.showDialog)('SHARE')),
      }))((e) => {
        var { openShareDialog: t } = e;
        return i.createElement(
          'div',
          { className: 'tag-email-tooltip' },
          i.createElement('div', { className: 'tag-email-tooltip__arrow' }),
          i.createElement(
            'div',
            { className: 'tag-email-tooltip__inside' },
            'Collaboration has moved. Press the Share icon in the toolbar to access the ',
            i.createElement(
              'a',
              { href: '#', onClick: t },
              'Collaborate screen'
            ),
            '.'
          )
        );
      });
      var m = o(70103),
        v = o(62285),
        f = (e) => {
          if (!e || !window.getSelection) return 0;
          var t = window.getSelection();
          if (!t || t.rangeCount < 1) return 0;
          var o = t.getRangeAt(0),
            n = o.cloneRange();
          return (
            n.selectNodeContents(e),
            n.setEnd(o.endContainer, o.endOffset),
            n.toString().length
          );
        };
      class y extends i.Component {
        constructor() {
          for (var e, t = arguments.length, o = new Array(t), i = 0; i < t; i++)
            o[i] = arguments[i];
          super(...o),
            (e = this),
            (0, n.A)(this, 'caretPosition', 0),
            (0, n.A)(this, 'state', { isComposing: !1 }),
            (0, n.A)(this, 'completeSuggestion', function () {
              var t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : h.identity,
                { onChange: o, note: n, tags: i, value: r } = e.props;
              if (r.length) {
                var s = null;
                for (var a of i.values())
                  if (!n.tags.includes(a.name) && a.name.startsWith(r)) {
                    s = a.name;
                    break;
                  }
                s &&
                  o(s, () => {
                    var o;
                    t(s),
                      (e.caretPosition =
                        (null === (o = s) || void 0 === o
                          ? void 0
                          : o.length) || 0),
                      e.focusInput();
                  });
              }
            }),
            (0, n.A)(this, 'focusInput', () => {
              if (this.inputField) {
                var e = this.inputField;
                e.focus();
                var t = document.createRange();
                t.selectNodeContents(e),
                  null !== e.firstChild &&
                    t.toString().length > this.caretPosition &&
                    t.setEnd(e.firstChild, this.caretPosition),
                  t.collapse(!1);
                var o = window.getSelection();
                o.removeAllRanges(), o.addRange(t);
              }
            }),
            (0, n.A)(
              this,
              'hasFocus',
              () => document.activeElement === this.inputField
            ),
            (0, n.A)(this, 'interceptKeys', (e) =>
              (0, h.invoke)(
                {
                  13: this.submitTag,
                  32: this.submitTag,
                  188: this.submitTag,
                  9: this.interceptTabPress,
                  39: this.interceptRightArrow,
                },
                e.keyCode,
                e
              )
            ),
            (0, n.A)(this, 'interceptRightArrow', (e) => {
              var { value: t } = this.props;
              f(e.currentTarget) === t.length &&
                (this.completeSuggestion(),
                e.preventDefault(),
                e.stopPropagation());
            }),
            (0, n.A)(this, 'interceptTabPress', (e) => {
              this.completeSuggestion(this.submitTag),
                e.preventDefault(),
                e.stopPropagation();
            }),
            (0, n.A)(this, 'onInputMutation', (e) => {
              e.forEach((e) => {
                var t = (0, h.get)(e, 'target.data', '');
                'childList' === e.type &&
                  e.addedNodes.length &&
                  (t = (0, h.get)(e, 'target.innerText', '')),
                  this.onInput(t);
              });
            }),
            (0, n.A)(this, 'onInput', function (t) {
              var { moveCaretToEndOfValue: o = !1 } =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {};
              e.state.isComposing ||
                ((e.caretPosition = o ? t.length : f(e.inputField)),
                e.props.onChange(t.trim(), e.focusInput));
            }),
            (0, n.A)(this, 'onCompositionEnd', (e) => {
              var t = e.target.textContent;
              this.setState({ isComposing: !1 }, () => this.onInput(t));
            }),
            (0, n.A)(this, 'parsePastedInput', (e) => {
              var t;
              (0, h.get)(e, 'clipboardData.getData')
                ? (t = e.clipboardData.getData('text/plain'))
                : (0, h.get)(window, 'clipboardData.getData') &&
                  (t = window.clipboardData.getData('Text'));
              var o = t
                  .split(/\s|,|\n/)
                  .filter((e) => (0, v.YG)(e).length <= v.oH),
                n = o.slice(0, o.length - 1),
                [i] = o.slice(o.length - 1);
              n.filter(Boolean).forEach(this.props.onSelect),
                this.onInput(i, { moveCaretToEndOfValue: !0 }),
                e.preventDefault(),
                e.stopPropagation();
            }),
            (0, n.A)(this, 'storeInput', (e) => {
              (this.inputField = e),
                this.props.inputRef(e),
                (0, h.invoke)(
                  this,
                  'inputField.addEventListener',
                  'paste',
                  this.parsePastedInput,
                  !1
                );
            }),
            (0, n.A)(this, 'submitTag', (e) => {
              var { onSelect: t, value: o } = this.props;
              o.trim().length && t(o.trim()),
                (0, h.invoke)(e, 'preventDefault'),
                (0, h.invoke)(e, 'stopPropagation');
            });
        }
        componentDidMount() {
          this.props.storeFocusInput(this.focusInput),
            this.props.storeHasFocus(this.hasFocus),
            (this.inputObserver = new MutationObserver(this.onInputMutation)),
            this.inputObserver.observe(this.inputField, {
              characterData: !0,
              childList: !0,
              subtree: !0,
            });
        }
        componentWillUnmount() {
          (0, h.invoke)(
            this,
            'inputField.removeEventListener',
            'paste',
            this.parsePastedInput,
            !1
          ),
            this.inputObserver.disconnect();
        }
        render() {
          var { note: e, tags: t, value: o } = this.props,
            n = null;
          if (o.length > 0)
            for (var r of t.values())
              if (!e.tags.includes(r.name) && r.name.startsWith(o)) {
                n = r.name;
                break;
              }
          var s = '' === o && !this.state.isComposing;
          return i.createElement(
            'div',
            {
              className: 'tag-input',
              onClick: () => {
                (this.caretPosition = f(this.inputField)), this.focusInput();
              },
            },
            s &&
              i.createElement(
                'span',
                { 'aria-hidden': !0, className: 'tag-input__placeholder' },
                'Add tag…'
              ),
            i.createElement(
              'div',
              {
                'aria-label': 'Add tag…',
                ref: this.storeInput,
                className: 'tag-input__entry',
                contentEditable: 'true',
                onBlur: this.submitTag,
                onCompositionStart: () => this.setState({ isComposing: !0 }),
                onCompositionEnd: this.onCompositionEnd,
                onKeyDown: this.interceptKeys,
                spellCheck: !1,
                suppressContentEditableWarning: !0,
              },
              o
            ),
            i.createElement(
              'div',
              {
                className: 'tag-input__suggestion',
                disabled: !0,
                type: 'text',
              },
              n ? n.substring(o.length) : ''
            )
          );
        }
      }
      (0, n.A)(y, 'displayName', 'TagInput'),
        (0, n.A)(y, 'defaultProps', {
          inputRef: h.identity,
          onChange: h.identity,
          onSelect: h.identity,
          storeFocusInput: h.noop,
          storeHasFocus: h.noop,
        });
      const b = (0, r.Ng)((e) => ({
        note: e.data.notes.get(e.ui.openedNote),
        tags: e.data.tags,
      }))(y);
      var w = o(4452),
        S = o.n(w),
        C = o(1962);
      class E extends i.Component {
        constructor() {
          for (var e = arguments.length, t = new Array(e), o = 0; o < e; o++)
            t[o] = arguments[o];
          super(...t),
            (0, n.A)(this, 'container', (0, i.createRef)()),
            (0, n.A)(this, 'tagInput', (0, i.createRef)()),
            (0, n.A)(this, 'state', {
              selectedTag: '',
              showEmailTooltip: !1,
              tagInput: '',
            }),
            (0, n.A)(this, 'addTag', (e) => {
              var { note: t, noteId: o } = this.props,
                n = e.trim().replace(/\s+/g, ',').split(',');
              n.some(u.A) && this.showEmailTooltip();
              var i = new Set(t.tags.map(v.YG));
              n.forEach((e) => {
                i.has((0, v.YG)(e)) ||
                  (i.add((0, v.YG)(e)), this.props.addTag(o, e));
              }),
                this.storeTagInput(''),
                (0, h.invoke)(this, 'tagInput.focus');
            }),
            (0, n.A)(
              this,
              'hasSelection',
              () => this.state.selectedTag && !!this.state.selectedTag.length
            ),
            (0, n.A)(this, 'deleteTag', (e) => {
              var { noteId: t } = this.props,
                { selectedTag: o } = this.state;
              this.props.removeTag(t, e),
                o === e &&
                  this.setState({ selectedTag: '' }, () => {
                    var e;
                    return null === (e = this.tagInput) ||
                      void 0 === e ||
                      null === (e = e.current) ||
                      void 0 === e
                      ? void 0
                      : e.focus();
                  });
            }),
            (0, n.A)(this, 'deleteSelection', () => {
              this.hasSelection() && this.deleteTag(this.state.selectedTag);
            }),
            (0, n.A)(this, 'hideEmailTooltip', () =>
              this.setState({ showEmailTooltip: !1 })
            ),
            (0, n.A)(
              this,
              'hasFocus',
              () => !!this.inputHasFocus && this.inputHasFocus()
            ),
            (0, n.A)(
              this,
              'focusTagField',
              () => this.focusInput && this.focusInput()
            ),
            (0, n.A)(this, 'interceptKeys', (e) => {
              if (8 === e.which) {
                if ('' !== this.state.tagInput) return;
                return (
                  this.hasSelection() && this.deleteSelection(),
                  this.selectLastTag(),
                  void e.preventDefault()
                );
              }
              if (39 === e.which && this.hasSelection())
                return this.unselect(e), void this.focusTagField();
              ((9 === e.which && this.hasSelection()) || this.hasSelection()) &&
                this.unselect(e);
            }),
            (0, n.A)(this, 'preventStealingFocus', (e) => {
              var { ctrlKey: t, key: o, metaKey: n, shiftKey: i } = e;
              if (this.props.keyboardShortcuts)
                return (
                  (t || n) &&
                    i &&
                    'y' === o.toLowerCase() &&
                    this.setState({ selectedTag: '' }),
                  !0
                );
            }),
            (0, n.A)(this, 'selectLastTag', () => {
              var e;
              return this.setState({
                selectedTag:
                  null === (e = this.props.note) || void 0 === e
                    ? void 0
                    : e.tags.slice(-1).shift(),
              });
            }),
            (0, n.A)(this, 'jumpToTag', (e) => {
              var {
                currentTarget: {
                  dataset: { tagName: t },
                },
              } = e;
              t &&
                (e.preventDefault(),
                e.stopPropagation(),
                this.props.openTag(t));
            }),
            (0, n.A)(this, 'removeTagChip', (e) => {
              this.deleteTag(e);
            }),
            (0, n.A)(this, 'showEmailTooltip', () => {
              this.setState({ showEmailTooltip: !0 }),
                setTimeout(() => this.setState({ showEmailTooltip: !1 }), 5e3);
            }),
            (0, n.A)(
              this,
              'onKeyDown',
              (e) => (
                this.state.showEmailTooltip && this.hideEmailTooltip(),
                (0, v.YG)(this.state.tagInput).length > v.oH &&
                  String.fromCharCode(e.which).match(/([^,\s])/g) &&
                  e.preventDefault(),
                this.interceptKeys(e)
              )
            ),
            (0, n.A)(this, 'storeFocusInput', (e) => (this.focusInput = e)),
            (0, n.A)(this, 'storeHasFocus', (e) => (this.inputHasFocus = e)),
            (0, n.A)(this, 'storeHiddenTag', (e) => (this.hiddenTag = e)),
            (0, n.A)(this, 'storeInputRef', (e) => (this.tagInput = e)),
            (0, n.A)(this, 'storeTagInput', (e, t) =>
              this.setState({ tagInput: e }, t)
            ),
            (0, n.A)(this, 'unselect', (e) => {
              var t, o;
              this.state.selectedTag &&
                (((null === (t = this.hiddenTag) || void 0 === t
                  ? void 0
                  : t.current) === e.relatedTarget &&
                  void 0 !==
                    (null === (o = this.hiddenTag) || void 0 === o
                      ? void 0
                      : o.current)) ||
                  this.setState({ selectedTag: '' }));
            });
        }
        componentDidMount() {
          this.props.storeFocusTagField(this.focusTagField),
            this.props.storeHasFocus(this.hasFocus),
            document.addEventListener('click', this.unselect, !0),
            window.addEventListener('keydown', this.preventStealingFocus, !0);
        }
        componentWillUnmount() {
          document.removeEventListener('click', this.unselect, !0),
            window.removeEventListener(
              'keydown',
              this.preventStealingFocus,
              !0
            );
        }
        componentDidUpdate() {
          var e;
          this.hasSelection() &&
            (null === (e = this.hiddenTag) ||
              void 0 === e ||
              null === (e = e.current) ||
              void 0 === e ||
              e.focus());
        }
        render() {
          var { tags: e } = this.props,
            { selectedTag: t, showEmailTooltip: o, tagInput: n } = this.state;
          return i.createElement(
            'div',
            { ref: this.container, className: 'tag-field' },
            i.createElement(
              'div',
              {
                'aria-label':
                  'Tags for the current note. Click a tag to filter the list by it, click × to remove.',
                className: S()('tag-editor', {
                  'has-selection': this.hasSelection(),
                }),
                tabIndex: -1,
                onKeyDown: this.onKeyDown,
              },
              i.createElement('input', {
                'aria-hidden': 'true',
                className: 'hidden-tag',
                tabIndex: -1,
                ref: this.storeHiddenTag,
              }),
              e.map((e) =>
                i.createElement(m.A, {
                  key: e,
                  tagName: e,
                  selected: e === t,
                  onSelect: this.jumpToTag,
                  onRemove: this.removeTagChip,
                })
              ),
              i.createElement(b, {
                inputRef: this.storeInputRef,
                value: n,
                onChange: this.storeTagInput,
                onSelect: this.addTag,
                storeFocusInput: this.storeFocusInput,
                storeHasFocus: this.storeHasFocus,
              }),
              i.createElement(
                c.A,
                {
                  container: this.container.current,
                  onHide: this.hideEmailTooltip,
                  placement: 'top',
                  rootClose: !0,
                  shouldUpdatePosition: !0,
                  show: o,
                  target: this.tagInput.current,
                },
                () => i.createElement(g, null)
              )
            )
          );
        }
      }
      (0, n.A)(E, 'displayName', 'TagField');
      const N = (0, r.Ng)(
        (e) => {
          var t = e.ui.openedNote,
            o = t ? e.data.notes.get(t) : void 0;
          return {
            tags: t ? (0, C.g7)(e, o) : [],
            keyboardShortcuts: e.settings.keyboardShortcuts,
            noteId: t,
            note: o,
          };
        },
        {
          addTag: (e, t) => ({ type: 'ADD_NOTE_TAG', noteId: e, tagName: t }),
          openTag: (e) => ({ type: 'OPEN_TAG', tagName: e }),
          removeTag: (e, t) => ({
            type: 'REMOVE_NOTE_TAG',
            noteId: e,
            tagName: t,
          }),
        }
      )(E);
      var T = o(65871),
        k = o(96094),
        A = o(71559),
        I = o(61943),
        x = o(48940),
        M = o(16742),
        F = () => {
          sessionStorage.removeItem('note_positions');
        },
        L = () => {
          var e,
            t = sessionStorage.getItem('note_positions');
          if (t)
            try {
              return JSON.parse(t);
            } catch (e) {
              return {};
            }
          else e = {};
          return e;
        },
        D = o(51938),
        O = o(45851);
      function R(e, t) {
        var o = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            o.push.apply(o, n);
        }
        return o;
      }
      function K(e) {
        for (var t = 1; t < arguments.length; t++) {
          var o = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? R(Object(o), !0).forEach(function (t) {
                (0, n.A)(e, t, o[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(o))
              : R(Object(o)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(o, t)
                  );
                });
        }
        return e;
      }
      var P = { color: '#3361cc', position: k.EN.OverviewRulerLane.Full },
        H = (e) => ({
          range: e,
          options: {
            inlineClassName: 'selected-search',
            zIndex: 10,
            overviewRuler: P,
          },
        });
      class _ extends i.Component {
        constructor() {
          super(...arguments),
            (0, n.A)(this, 'bootTimer', null),
            (0, n.A)(this, 'editor', null),
            (0, n.A)(this, 'monaco', null),
            (0, n.A)(this, 'contentDiv', (0, i.createRef)()),
            (0, n.A)(this, 'matchesInNote', []),
            (0, n.A)(this, 'state', {
              content: '',
              editor: 'fast',
              noteId: null,
              overTodo: !1,
              searchQuery: '',
            }),
            (0, n.A)(this, 'toggleShortcuts', (e) => {
              e
                ? window.addEventListener('keydown', this.handleShortcut, !0)
                : window.removeEventListener(
                    'keydown',
                    this.handleShortcut,
                    !0
                  );
            }),
            (0, n.A)(this, 'completionProvider', (e, t) => ({
              triggerCharacters: ['['],
              provideCompletionItems(t, o, n, i) {
                var r = t.getLineContent(o.lineNumber),
                  s = r.lastIndexOf('[', o.column),
                  a = r.lastIndexOf(']', o.column),
                  l = s >= 0 && a < s ? s : -1,
                  d = l >= 0 ? r.slice(l + 1, o.column) : '',
                  c = (0, A.Sz)(
                    {
                      collection: { type: 'all' },
                      excludeIDs: e ? [e] : [],
                      searchTags: (0, A.u)(d),
                      searchTerms: (0, x.S)(d),
                      titleOnly: !0,
                    },
                    5
                  )
                    .filter((e) => {
                      var [t, o] = e;
                      return void 0 !== o;
                    })
                    .map((e) => {
                      var [t, o] = e;
                      return K(
                        {
                          noteId: t,
                          content: o.content,
                          isPinned: o.systemTags.includes('pinned'),
                        },
                        (0, M.Cb)(o)
                      );
                    }),
                  h =
                    l >= 0
                      ? [
                          {
                            text: '',
                            range: {
                              startLineNumber: o.lineNumber,
                              startColumn: l,
                              endLineNumber: o.lineNumber,
                              endColumn: o.column,
                            },
                          },
                        ]
                      : [];
                return {
                  incomplete: !0,
                  suggestions: c.map((e, t) => ({
                    additionalTextEdits: h,
                    kind: e.isPinned
                      ? k.eo.CompletionItemKind.Snippet
                      : k.eo.CompletionItemKind.File,
                    label: e.title,
                    documentation: e.content,
                    insertText: '['
                      .concat(e.title, '](simplenote://note/')
                      .concat(e.noteId, ')'),
                    sortText: t.toString(),
                    range: {
                      startLineNumber: o.lineNumber,
                      startColumn: o.column,
                      endLineNumber: o.lineNumber,
                      endColumn: o.column,
                    },
                  })),
                };
              },
            })),
            (0, n.A)(this, 'handleShortcut', (e) => {
              var { ctrlKey: t, metaKey: o, shiftKey: n } = e,
                i = e.key.toLowerCase(),
                r = t || o;
              return r && n && 'g' === i
                ? (this.setPrevSearchSelection(),
                  e.stopPropagation(),
                  e.preventDefault(),
                  !1)
                : window.electron || !r || n || 'g' !== i
                  ? void 0
                  : (this.setNextSearchSelection(),
                    e.stopPropagation(),
                    e.preventDefault(),
                    !1);
            }),
            (0, n.A)(this, 'setDecorators', () => {
              var e,
                t,
                o,
                n,
                i,
                r,
                s = this.getTitleDecoration();
              if (
                (s &&
                  (null === (e = this.editor) ||
                    void 0 === e ||
                    e.createDecorationsCollection([s])),
                (this.matchesInNote =
                  null !== (t = this.searchMatches()) && void 0 !== t ? t : []),
                this.props.storeNumberOfMatchesInNote(
                  this.matchesInNote.length
                ),
                null === (o = this.decorations) || void 0 === o || o.clear(),
                0 !== this.matchesInNote.length)
              ) {
                (this.decorations =
                  null === (n = this.editor) || void 0 === n
                    ? void 0
                    : n.createDecorationsCollection(this.matchesInNote)),
                  null === (i = this.selectedDecoration) ||
                    void 0 === i ||
                    i.clear();
                var a =
                  null === (r = this.editor) || void 0 === r
                    ? void 0
                    : r.getSelection();
                a &&
                  this.matchesInNote.forEach((e) => {
                    var t;
                    e.range === a &&
                      (null === (t = this.editor) ||
                        void 0 === t ||
                        t.createDecorationsCollection([H(a)]));
                  });
              }
            }),
            (0, n.A)(this, 'getTitleDecoration', () => {
              var e,
                t,
                o =
                  null === (e = this.editor) || void 0 === e
                    ? void 0
                    : e.getModel();
              if (o)
                for (var n = 1; n <= o.getLineCount(); n++)
                  if (o.getLineContent(n).trim().length > 0)
                    return (
                      (t = n),
                      {
                        range: new k.Q6(t, 1, t, 1),
                        options: {
                          isWholeLine: !0,
                          inlineClassName: 'note-title',
                          stickiness:
                            k.EN.TrackedRangeStickiness
                              .NeverGrowsWhenTypingAtEdges,
                        },
                      }
                    );
            }),
            (0, n.A)(this, 'searchMatches', () => {
              if (this.editor && this.props.searchQuery) {
                var e = this.editor.getModel(),
                  t = (0, x.S)(this.props.searchQuery)
                    .map((e) => e.normalize().toLowerCase())
                    .filter((e) => e.trim().length > 0);
                return 0 === t.length
                  ? []
                  : t.reduce((t, o) => {
                      var n =
                        null == e
                          ? void 0
                          : e.findMatches(o, !0, !1, !1, null, !1);
                      return (
                        null == n ||
                          n.forEach((e) => {
                            t.push({
                              options: {
                                inlineClassName: 'search-decoration',
                                overviewRuler: P,
                              },
                              range: e.range,
                            });
                          }),
                        t
                      );
                    }, []);
              }
            }),
            (0, n.A)(this, 'focusEditor', () => {
              var e;
              return null === (e = this.editor) || void 0 === e
                ? void 0
                : e.focus();
            }),
            (0, n.A)(this, 'hasFocus', () => {
              var e;
              return (
                (null === (e = this.editor) || void 0 === e
                  ? void 0
                  : e.hasTextFocus()) || !1
              );
            }),
            (0, n.A)(this, 'handleChecklist', (e) => {
              var t;
              null === (t = this.editor) ||
                void 0 === t ||
                t.trigger('editorCommand', 'insertChecklist', null);
            }),
            (0, n.A)(this, 'handleInsertMarkdown', (e) => {
              var t = this.editor;
              if (t) {
                var o = e.detail;
                if (o && 'string' == typeof o.snippet) {
                  var n = t.getSelection();
                  if (n) {
                    var i = t.getModel();
                    if (i) {
                      var r = o.snippet,
                        s = 0;
                      if (o.blockLevel) {
                        var a = n.startColumn;
                        a > 1 &&
                          '\n' !==
                            i.getValueInRange(
                              new k.Q6(
                                n.startLineNumber,
                                a - 1,
                                n.startLineNumber,
                                a
                              )
                            ) &&
                          ((r = '\n' + r), (s = 1));
                      }
                      var l = {
                        identifier: { major: 1, minor: 1 },
                        range: n,
                        text: r,
                        forceMoveMarkers: !0,
                      };
                      t.executeEdits('insertMarkdown', [l]);
                      var d = (e, t, o) => {
                          for (var n = e, i = t, r = 0; r < o.length; r++)
                            10 === o.charCodeAt(r)
                              ? ((n += 1), (i = 1))
                              : (i += 1);
                          return new k.yX(n, i);
                        },
                        c = (e, t, o, n) => d(e, t, o.slice(0, n));
                      if (
                        o.selectionAnchor &&
                        2 === o.selectionAnchor.length &&
                        o.selectionAnchor[0] >= 0 &&
                        o.selectionAnchor[1] >= o.selectionAnchor[0]
                      ) {
                        var [h, u] = o.selectionAnchor,
                          p = c(n.startLineNumber, n.startColumn, r, s + h),
                          g = c(n.startLineNumber, n.startColumn, r, s + u);
                        t.setSelection(
                          new k.LN(
                            p.lineNumber,
                            p.column,
                            g.lineNumber,
                            g.column
                          )
                        );
                      } else {
                        var m = d(n.startLineNumber, n.startColumn, r);
                        t.setPosition(m);
                      }
                      t.focus();
                    }
                  }
                }
              }
            }),
            (0, n.A)(this, 'handleUndoRedo', (e) => {
              var t,
                o,
                n = e;
              switch (n.inputType) {
                case 'historyUndo':
                  return (
                    null === (t = this.editor) ||
                      void 0 === t ||
                      t.trigger('browserMenu', 'undo', null),
                    n.preventDefault(),
                    void n.stopPropagation()
                  );
                case 'historyRedo':
                  return (
                    null === (o = this.editor) ||
                      void 0 === o ||
                      o.trigger('browserMenu', 'redo', null),
                    n.preventDefault(),
                    void n.stopPropagation()
                  );
              }
            }),
            (0, n.A)(this, 'cancelSelectionOrSearch', (e) => {
              this.props.searchQuery.length > 0 && this.matchesInNote.length > 0
                ? this.props.clearSearch()
                : e.trigger('customAction', 'cancelSelection', null);
            }),
            (0, n.A)(this, 'insertOrRemoveCheckboxes', (e) => {
              var t = e.getSelection();
              if (t)
                for (var o = t.startLineNumber; o <= t.endLineNumber; o++)
                  this.toggleChecklistForLine(e, o);
              else {
                var n = e.getPosition();
                if (!n) return;
                this.toggleChecklistForLine(e, n.lineNumber);
              }
            }),
            (0, n.A)(this, 'toggleChecklistForLine', (e, t) => {
              var o,
                n,
                i = e.getModel();
              if (i) {
                var r = i.getLineContent(t),
                  s = /^(\s*)([-+*\u2022]\s*)?([\ue000\ue001]\s+)?/.exec(r);
                if (s) {
                  var [a, l, d, c] = s,
                    h = void 0 !== c,
                    u =
                      l.length +
                      (null !== (o = null == d ? void 0 : d.length) &&
                      void 0 !== o
                        ? o
                        : 0) +
                      1,
                    p = h ? '' : ' ',
                    g = {
                      identifier: { major: 1, minor: 1 },
                      range: new k.Q6(
                        t,
                        u,
                        t,
                        u +
                          (null !== (n = null == c ? void 0 : c.length) &&
                          void 0 !== n
                            ? n
                            : 0)
                      ),
                      text: p,
                      forceMoveMarkers: !0,
                    };
                  e.executeEdits('insertOrRemoveCheckboxes', [g]),
                    this.props.insertTask();
                }
              }
            }),
            (0, n.A)(this, 'editorInit', (e) => {
              k.EN.defineTheme('simplenote', {
                base: 'vs',
                inherit: !0,
                rules: [],
                colors: {
                  'editor.foreground': '#2c3338',
                  'editor.background': '#ffffff',
                  'editor.selectionBackground': '#ced9f2',
                  'scrollbarSlider.activeBackground': '#8c8f94',
                  'scrollbarSlider.background': '#c3c4c7',
                  'scrollbarSlider.hoverBackground': '#a7aaad',
                  'textLink.foreground': '#1d4fc4',
                },
              }),
                k.EN.defineTheme('simplenote-dark', {
                  base: 'vs-dark',
                  inherit: !0,
                  rules: [],
                  colors: {
                    'editor.foreground': '#ffffff',
                    'editor.background': '#1d2327',
                    'editor.selectionBackground': '#646970',
                    'scrollbarSlider.activeBackground': '#646970',
                    'scrollbarSlider.background': '#2c3338',
                    'scrollbarSlider.hoverBackground': '#1d2327',
                    'textLink.foreground': '#ced9f2',
                  },
                });
            }),
            (0, n.A)(this, 'editorReady', (e, t) => {
              var o, n, i;
              (this.editor = e),
                t.languages.registerLinkProvider('plaintext', {
                  provideLinks: (e) => ({
                    links: e
                      .findMatches(
                        'simplenote://note/[a-zA-Z0-9-]+',
                        !0,
                        !0,
                        !1,
                        null,
                        !1
                      )
                      .map((e) => {
                        var { range: t } = e;
                        return { range: t };
                      }),
                  }),
                  resolveLink: (t) => {
                    var o,
                      n,
                      i =
                        null !==
                          (o =
                            null === (n = e.getModel()) || void 0 === n
                              ? void 0
                              : n.getValueInRange(t.range)) && void 0 !== o
                          ? o
                          : '',
                      r = /^simplenote:\/\/note\/(.+)$/.exec(i);
                    if (r) {
                      var [s, a] = r;
                      return (
                        this.props.notes.has(a) && this.props.openNote(a),
                        K(K({}, t), {}, { url: '#' })
                      );
                    }
                  },
                });
              var r = ['editor.action.changeAll', 'editor.action.quickCommand'],
                s = this.editor.getContribution('editor.contrib.contextmenu'),
                a = s._getMenuActions;
              (s._getMenuActions = function () {
                for (
                  var e = arguments.length, t = new Array(e), o = 0;
                  o < e;
                  o++
                )
                  t[o] = arguments[o];
                return a.apply(s, t).filter(function (e) {
                  return !r.includes(e.id);
                });
              }),
                [
                  'editor.action.quickCommand',
                  'editor.action.commentLine',
                  'editor.action.transposeLetters',
                  'expandLineSelection',
                  'editor.action.gotoLine',
                  'editor.action.changeAll',
                  'actions.find',
                  'actions.findWithSelection',
                  'editor.action.addSelectionToNextFindMatch',
                  'editor.action.nextMatchFindAction',
                  'editor.action.selectHighlights',
                ].forEach(function (e) {
                  t.editor.addKeybindingRule({
                    keybinding: 0,
                    command: '-' + e,
                  });
                }),
                e.createContextKey('allowBrowserKeybinding', !window.electron),
                e.addAction({
                  id: 'context_undo',
                  label: 'Undo',
                  keybindings: [t.KeyMod.CtrlCmd | t.KeyCode.KeyZ],
                  keybindingContext: 'allowBrowserKeybinding',
                  contextMenuGroupId: '1_modification',
                  contextMenuOrder: 2,
                  run: () => {
                    e.trigger('contextMenu', 'undo', null);
                  },
                }),
                e.addAction({
                  id: 'context_redo',
                  label: 'Redo',
                  keybindings: [
                    t.KeyMod.WinCtrl | t.KeyCode.KeyY,
                    t.KeyMod.CtrlCmd | t.KeyMod.Shift | t.KeyCode.KeyZ,
                  ],
                  keybindingContext: 'allowBrowserKeybinding',
                  contextMenuGroupId: '1_modification',
                  contextMenuOrder: 3,
                  run: () => {
                    e.trigger('contextMenu', 'redo', null);
                  },
                }),
                t.editor.addKeybindingRules([
                  {
                    keybinding: t.KeyMod.CtrlCmd | t.KeyCode.KeyX,
                    command: 'editor.action.clipboardCutAction',
                    when: 'allowBrowserKeybinding && editorTextFocus',
                  },
                  {
                    keybinding: t.KeyMod.CtrlCmd | t.KeyCode.KeyC,
                    command: 'editor.action.clipboardCopyAction',
                    when: 'allowBrowserKeybinding && editorTextFocus',
                  },
                  {
                    keybinding: t.KeyMod.CtrlCmd | t.KeyCode.KeyV,
                    command: 'editor.action.clipboardPasteAction',
                    when: 'allowBrowserKeybinding && editorTextFocus',
                  },
                ]),
                e.addAction({
                  id: 'cancel_selection',
                  label: 'Cancel Selection',
                  keybindings: [t.KeyCode.Escape],
                  keybindingContext: '!suggestWidgetVisible',
                  run: this.cancelSelectionOrSearch,
                }),
                e.addAction({
                  id: 'select_all',
                  label: 'Select All',
                  contextMenuGroupId: '9_cutcopypaste',
                  contextMenuOrder: 4,
                  keybindings: [t.KeyMod.CtrlCmd | t.KeyCode.KeyA],
                  keybindingContext:
                    'allowBrowserKeybinding && editorTextFocus',
                  run: () => {
                    var t,
                      o =
                        null === (t = e.getModel()) || void 0 === t
                          ? void 0
                          : t.getFullModelRange();
                    o && e.setSelection(o);
                  },
                }),
                e.addAction({
                  id: 'insertChecklist',
                  label: 'Insert Checklist',
                  keybindings: [
                    t.KeyMod.CtrlCmd | t.KeyMod.Shift | t.KeyCode.KeyC,
                    t.KeyMod.WinCtrl | t.KeyMod.Shift | t.KeyCode.KeyC,
                  ],
                  keybindingContext:
                    'allowBrowserKeybinding && editorTextFocus',
                  contextMenuGroupId: '10_checklist',
                  contextMenuOrder: 1,
                  run: this.insertOrRemoveCheckboxes,
                }),
                e.addCommand(t.KeyCode.Tab, () => {
                  var t,
                    o,
                    n =
                      null === (t = e.getPosition()) || void 0 === t
                        ? void 0
                        : t.lineNumber;
                  if (n) {
                    var i =
                      null === (o = e.getModel()) || void 0 === o
                        ? void 0
                        : o.getLineContent(n);
                    i && /^(\s*)([-+*\u2022\ue000\ue001])(\s+)/.test(i)
                      ? e.trigger('commands', 'editor.action.indentLines', null)
                      : e.trigger('commands', 'tab', null);
                  }
                }),
                null === (o = window.electron) ||
                  void 0 === o ||
                  o.receive('editorCommand', (t) => {
                    switch (t.action) {
                      case 'findAgain':
                        return void this.setNextSearchSelection();
                      case 'insertChecklist':
                        return void e.trigger(
                          'editorCommand',
                          'insertChecklist',
                          null
                        );
                      case 'redo':
                        return void (e.hasTextFocus()
                          ? e.trigger('editorCommand', 'redo', null)
                          : document.execCommand('redo'));
                      case 'selectAll':
                        if (e.hasTextFocus()) {
                          var o,
                            n =
                              null === (o = e.getModel()) || void 0 === o
                                ? void 0
                                : o.getFullModelRange();
                          n && e.setSelection(n);
                        } else document.execCommand('selectAll');
                        return;
                      case 'undo':
                        return void (e.hasTextFocus()
                          ? e.trigger('editorCommand', 'undo', null)
                          : document.execCommand('undo'));
                    }
                  }),
                window.electron ||
                  window.addEventListener('input', this.handleUndoRedo, !0),
                this.setDecorators(),
                this.setState({}),
                e.onDidChangeModelContent(() => this.setDecorators());
              var l = t.languages.registerCompletionItemProvider(
                'plaintext',
                this.completionProvider(this.state.noteId, e)
              );
              e.onDidDispose(() => (null == l ? void 0 : l.dispose())),
                (document.oncopy = (e) => {
                  var t;
                  null === (t = e.clipboardData) ||
                    void 0 === t ||
                    t.setData(
                      'text/plain',
                      (0, D.TC)(e.clipboardData.getData('text/plain'))
                    );
                });
              var [d, c, h] = this.props.editorSelection,
                u =
                  null === (n = this.editor.getModel()) || void 0 === n
                    ? void 0
                    : n.getPositionAt(d),
                p =
                  null === (i = this.editor.getModel()) || void 0 === i
                    ? void 0
                    : i.getPositionAt(c);
              u &&
                p &&
                this.editor.setSelection(
                  k.LN.createWithDirection(
                    u.lineNumber,
                    u.column,
                    p.lineNumber,
                    p.column,
                    'RTL' === h ? k.SB.RTL : k.SB.LTR
                  )
                ),
                u && e.revealLine(u.lineNumber, k.EN.ScrollType.Immediate),
                e.onDidChangeCursorSelection((t) => {
                  var o, n;
                  if (
                    t.reason !== k.EN.CursorChangeReason.Undo &&
                    t.reason !== k.EN.CursorChangeReason.Redo
                  ) {
                    var i =
                        null === (o = e.getModel()) || void 0 === o
                          ? void 0
                          : o.getOffsetAt(t.selection.getStartPosition()),
                      r =
                        null === (n = e.getModel()) || void 0 === n
                          ? void 0
                          : n.getOffsetAt(t.selection.getEndPosition()),
                      s =
                        t.selection.getDirection() === k.SB.LTR ? 'LTR' : 'RTL';
                    i &&
                      r &&
                      this.props.storeEditorSelection(
                        this.props.noteId,
                        i,
                        r,
                        s
                      );
                  }
                }),
                e.onMouseMove((t) => {
                  var { content: o } = this.state,
                    {
                      target: { range: n },
                    } = t;
                  if (n && !(n.endColumn - n.startColumn > 1)) {
                    var i = e.getModel();
                    if (i) {
                      var r = i.getOffsetAt({
                          lineNumber: n.startLineNumber,
                          column: n.startColumn,
                        }),
                        s = '' === o[r] || '' === o[r];
                      this.state.overTodo !== s &&
                        this.setState({ overTodo: s });
                    }
                  }
                }),
                e.onMouseDown((t) => {
                  if (
                    !(
                      (t.event.ctrlKey && t.event.leftButton) ||
                      t.event.rightButton
                    )
                  ) {
                    var { editNote: o, noteId: n } = this.props,
                      { content: i } = this.state,
                      {
                        target: { range: r },
                      } = t;
                    if (r && !(r.endColumn - r.startColumn > 1)) {
                      var s = e.getModel();
                      if (s) {
                        var a = s.getOffsetAt({
                          lineNumber: r.startLineNumber,
                          column: r.startColumn,
                        });
                        '' === i[a]
                          ? o(n, {
                              content: (0, D.TC)(
                                i.slice(0, a) + '' + i.slice(a + 1)
                              ),
                            })
                          : '' === i[a] &&
                            o(n, {
                              content: (0, D.TC)(
                                i.slice(0, a) + '' + i.slice(a + 1)
                              ),
                            });
                      }
                    }
                  }
                });
            }),
            (0, n.A)(this, 'updateNote', (e, t) => {
              var { editNote: o, noteId: n } = this.props;
              if (this.editor) {
                var i =
                  (() => {
                    if (this.editor && !t.isRedoing && !t.isUndoing) {
                      var o = t.changes.find((e) => {
                        var { text: t } = e;
                        return (
                          ('\r' === t[0] || '\n' === t[0]) && '' === t.trim()
                        );
                      });
                      if (o) {
                        var n = o.range.startLineNumber;
                        if (0 !== n && n === o.range.endLineNumber) {
                          var i = this.editor.getModel(),
                            r =
                              (null == i ? void 0 : i.getLineContent(n)) || '',
                            s = /^(\s*)([-+*\u2022\ue000\ue001])(\s+)/.exec(r);
                          if (null !== s) {
                            var a =
                              (null == i ? void 0 : i.getLineContent(n + 1)) ||
                              '';
                            if (/^\s*$/.test(a)) {
                              if (
                                0 !== a.trim().length ||
                                r.length !== s[0].length
                              ) {
                                var l =
                                    null == i
                                      ? void 0
                                      : i.getOffsetAt({
                                          column: 0,
                                          lineNumber: n + 1,
                                        }),
                                  d =
                                    null == i
                                      ? void 0
                                      : i.getOffsetAt({
                                          column: 0,
                                          lineNumber: n + 2,
                                        }),
                                  c = {
                                    identifier: { major: 1, minor: 1 },
                                    range: new k.Q6(n + 1, 0, n + 1, a.length),
                                    text: s[0].replace('', ''),
                                    forceMoveMarkers: !0,
                                  };
                                return (
                                  this.editor.executeEdits('autolist', [c]),
                                  Promise.resolve().then(() => {
                                    var e;
                                    return null === (e = this.editor) ||
                                      void 0 === e
                                      ? void 0
                                      : e.setPosition({
                                          column: s[0].length + 1,
                                          lineNumber: n + 1,
                                        });
                                  }),
                                  e.slice(0, l) +
                                    s[0].replace('', '') +
                                    t.eol +
                                    e.slice(d)
                                );
                              }
                              null == i ||
                                i.getOffsetAt({ column: 0, lineNumber: n }),
                                null == i ||
                                  i.getOffsetAt({
                                    column: 0,
                                    lineNumber: n + 1,
                                  });
                              var h = {
                                identifier: { major: 1, minor: 1 },
                                range: new k.Q6(n, 0, n + 1, a.length + 1),
                                text: null,
                                forceMoveMarkers: !0,
                              };
                              Promise.resolve().then(() => {
                                var e, t;
                                null === (e = this.editor) ||
                                  void 0 === e ||
                                  e.executeEdits('autolist', [h]),
                                  null === (t = this.editor) ||
                                    void 0 === t ||
                                    t.setPosition({ column: 0, lineNumber: n });
                              });
                            }
                          }
                        }
                      }
                    }
                  })() || e;
                o(n, { content: (0, D.TC)(i) });
              }
            }),
            (0, n.A)(this, 'setNextSearchSelection', () => {
              var { selectedSearchMatchIndex: e } = this.props,
                t = this.matchesInNote.length,
                o = (t + (null != e ? e : -1) + 1) % t;
              this.props.storeSearchSelection(o),
                this.setSearchSelection(o),
                this.focusEditor();
            }),
            (0, n.A)(this, 'setPrevSearchSelection', () => {
              var { selectedSearchMatchIndex: e } = this.props,
                t = this.matchesInNote.length,
                o = (t + (null != e ? e : t) - 1) % t;
              this.props.storeSearchSelection(o),
                this.setSearchSelection(o),
                this.focusEditor();
            }),
            (0, n.A)(this, 'setSearchSelection', (e) => {
              var t, o, n;
              if (
                (null === (t = this.selectedDecoration) ||
                  void 0 === t ||
                  t.clear(),
                this.matchesInNote.length && null !== e && !isNaN(e))
              ) {
                var i = this.matchesInNote[e].range;
                i &&
                  (null === (o = this.editor) ||
                    void 0 === o ||
                    o.setSelection(i),
                  null === (n = this.editor) ||
                    void 0 === n ||
                    n.revealLineInCenter(i.startLineNumber),
                  this.matchesInNote.forEach((e) => {
                    if (e.range === i) {
                      var t,
                        o = H(i);
                      this.selectedDecoration =
                        null === (t = this.editor) || void 0 === t
                          ? void 0
                          : t.createDecorationsCollection([o]);
                    }
                  }));
              }
            });
        }
        static getDerivedStateFromProps(e, t) {
          var o = e.note.content.length > 5e3,
            n = e.note.content !== t.content,
            i = e.noteId !== t.noteId,
            r = n
              ? i && o
                ? e.note.content.slice(0, e.editorSelection[1] + 5e3)
                : (0, D.yK)(e.note.content)
              : t.content,
            s = i ? (o ? 'fast' : 'full') : t.editor,
            a = e.searchQuery !== t.searchQuery;
          return (
            (i || a) && e.storeSearchSelection(null),
            {
              content: r,
              editor: s,
              noteId: e.noteId,
              searchQuery: e.searchQuery,
            }
          );
        }
        componentDidMount() {
          var { noteId: e } = this.props;
          (this.bootTimer = setTimeout(() => {
            if (e === this.props.noteId) {
              this.setState({
                editor: 'full',
                content: (0, D.yK)(this.props.note.content),
              });
              var t,
                o = ((e) => {
                  var t = L();
                  return t ? t[e] : 0;
                })(e);
              o &&
                (null === (t = this.editor) ||
                  void 0 === t ||
                  t.setScrollPosition({ scrollTop: o }));
            }
          }, 120)),
            this.focusEditor(),
            this.props.storeFocusEditor(this.focusEditor),
            this.props.storeHasFocus(this.hasFocus),
            window.addEventListener('resize', F),
            window.addEventListener(
              'toggleChecklist',
              this.handleChecklist,
              !0
            ),
            window.addEventListener(O.zG, this.handleInsertMarkdown, !0),
            this.toggleShortcuts(!0);
        }
        componentWillUnmount() {
          var e, t, o, n, i, r;
          (n = this.props.noteId),
            (i =
              null !==
                (e =
                  null === (t = this.editor) || void 0 === t
                    ? void 0
                    : t.getScrollTop()) && void 0 !== e
                ? e
                : 0),
            (r = L()) &&
              ((r[n] = i),
              sessionStorage.setItem('note_positions', JSON.stringify(r))),
            this.bootTimer && clearTimeout(this.bootTimer),
            null === (o = window.electron) ||
              void 0 === o ||
              o.removeListener('editorCommand'),
            window.removeEventListener('input', this.handleUndoRedo, !0),
            window.removeEventListener(
              'toggleChecklist',
              this.handleChecklist,
              !0
            ),
            window.removeEventListener(O.zG, this.handleInsertMarkdown, !0),
            window.removeEventListener('resize', F, !0),
            this.toggleShortcuts(!1);
        }
        componentDidUpdate(e) {
          var t,
            o,
            {
              editorSelection: [n, i, r],
            } = e,
            {
              editorSelection: [s, a, l],
            } = this.props;
          if (
            this.editor &&
            'full' === this.state.editor &&
            (n !== s || i !== a || r !== l)
          ) {
            var d,
              c,
              h =
                null === (d = this.editor.getModel()) || void 0 === d
                  ? void 0
                  : d.getPositionAt(s),
              u =
                null === (c = this.editor.getModel()) || void 0 === c
                  ? void 0
                  : c.getPositionAt(a);
            this.editor.setSelection(
              k.LN.createWithDirection(
                null == h ? void 0 : h.lineNumber,
                null == h ? void 0 : h.column,
                null == u ? void 0 : u.lineNumber,
                null == u ? void 0 : u.column,
                'RTL' === l ? k.SB.RTL : k.SB.LTR
              )
            );
          }
          '' === this.props.searchQuery &&
            '' !== e.searchQuery &&
            (null === (t = this.editor) ||
              void 0 === t ||
              t.setSelection(new k.Q6(0, 0, 0, 0))),
            (this.props.lineLength === e.lineLength &&
              this.props.isFocusMode === e.isFocusMode) ||
              setTimeout(() => {
                this.editor && this.editor.layout();
              }, 400),
            this.editor &&
              'full' === this.state.editor &&
              e.searchQuery !== this.props.searchQuery &&
              (null === (o = this.editor) || void 0 === o || o.layout(),
              this.setDecorators()),
            this.editor &&
              'full' === this.state.editor &&
              e.selectedSearchMatchIndex !==
                this.props.selectedSearchMatchIndex &&
              this.setSearchSelection(this.props.selectedSearchMatchIndex);
        }
        render() {
          var e,
            { lineLength: t, noteId: o, searchQuery: n, theme: r } = this.props,
            { content: s, editor: a, overTodo: l } = this.state,
            d = ((e, t) =>
              'full' === e || void 0 === t
                ? 25
                : t <= 1072
                  ? 0.1 * t
                  : (t - 768) / 2)(
              t,
              null === (e = this.contentDiv.current) || void 0 === e
                ? void 0
                : e.offsetWidth
            );
          return i.createElement(
            'div',
            {
              ref: this.contentDiv,
              className: 'note-content-editor-shell'.concat(
                l ? ' cursor-pointer' : ''
              ),
              onClick: (e) => {
                var t = e.target;
                t.classList.contains('view-line') ||
                  t.classList.contains('view-lines') ||
                  e.ctrlKey ||
                  this.focusEditor();
              },
            },
            i.createElement(
              'div',
              {
                className: 'note-content-plaintext'.concat(
                  'fast' === a ? ' visible' : ''
                ),
              },
              s
            ),
            'fast' !== a &&
              i.createElement(T.Ay, {
                key: o,
                editorDidMount: this.editorReady,
                editorWillMount: this.editorInit,
                language: 'plaintext',
                theme: 'dark' === r ? 'simplenote-dark' : 'simplenote',
                onChange: this.updateNote,
                options: {
                  autoClosingBrackets: 'never',
                  autoClosingQuotes: 'never',
                  autoIndent: 'keep',
                  autoSurround: 'never',
                  automaticLayout: !0,
                  'bracketPairColorization.enabled': !1,
                  codeLens: !1,
                  folding: !1,
                  fontFamily:
                    '"Simplenote Tasks", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", sans-serif',
                  hideCursorInOverviewRuler: !0,
                  fontSize: 16,
                  guides: { indentation: !1 },
                  lineDecorationsWidth: d,
                  lineHeight: 24,
                  lineNumbers: 'off',
                  links: !0,
                  matchBrackets: 'never',
                  minimap: { enabled: !1 },
                  multiCursorLimit: 1,
                  occurrencesHighlight: 'off',
                  overviewRulerBorder: !1,
                  padding: { top: 40, bottom: 0 },
                  quickSuggestions: !1,
                  renderControlCharacters: !1,
                  renderLineHighlight: 'none',
                  renderWhitespace: 'none',
                  scrollbar: {
                    horizontal: 'hidden',
                    useShadows: !1,
                    verticalScrollbarSize: d,
                  },
                  scrollBeyondLastLine: !1,
                  selectionHighlight: !1,
                  showFoldingControls: 'never',
                  stickyScroll: { enabled: !1 },
                  suggestOnTriggerCharacters: !0,
                  unicodeHighlight: {
                    ambiguousCharacters: !1,
                    invisibleCharacters: !1,
                  },
                  unusualLineTerminators: 'auto',
                  wordWrap: 'bounded',
                  wordWrapColumn: 400,
                  wrappingIndent: 'none',
                  wrappingStrategy: 'advanced',
                },
                value: s,
              })
          );
        }
      }
      var B = {
        clearSearch: () => I.A.ui.search(''),
        editNote: I.A.data.editNote,
        insertTask: () => ({ type: 'INSERT_TASK' }),
        openNote: I.A.ui.selectNote,
        storeEditorSelection: (e, t, o, n) => ({
          type: 'STORE_EDITOR_SELECTION',
          noteId: e,
          start: t,
          end: o,
          direction: n,
        }),
        storeNumberOfMatchesInNote: (e) => ({
          type: 'STORE_NUMBER_OF_MATCHES_IN_NOTE',
          matches: e,
        }),
        storeSearchSelection: (e) => ({
          type: 'STORE_SEARCH_SELECTION',
          index: e,
        }),
      };
      const Q = (0, r.Ng)((e) => {
        var t;
        return {
          editorSelection:
            null !== (t = e.ui.editorSelection.get(e.ui.openedNote)) &&
            void 0 !== t
              ? t
              : [0, 0, 'LTR'],
          isFocusMode: e.settings.focusModeEnabled,
          keyboardShortcuts: e.settings.keyboardShortcuts,
          lineLength: e.settings.lineLength,
          noteId: e.ui.openedNote,
          note: e.data.notes.get(e.ui.openedNote),
          notes: e.data.notes,
          searchQuery: e.ui.searchQuery,
          selectedSearchMatchIndex: e.ui.selectedSearchMatchIndex,
          spellCheckEnabled: e.settings.spellCheckEnabled,
          theme: C.O4(e),
        };
      }, B)(_);
      var W = o(38711);
      class G extends i.Component {
        constructor() {
          super(...arguments),
            (0, n.A)(
              this,
              'focusEditor',
              () => this.focusContentEditor && this.focusContentEditor()
            ),
            (0, n.A)(this, 'hasFocus', () => {
              var e;
              return null === (e = this.editorHasFocus) || void 0 === e
                ? void 0
                : e.call(this);
            }),
            (0, n.A)(
              this,
              'storeEditorHasFocus',
              (e) => (this.editorHasFocus = e)
            ),
            (0, n.A)(
              this,
              'storeFocusContentEditor',
              (e) => (this.focusContentEditor = e)
            );
        }
        componentDidMount() {
          this.props.storeFocusEditor(this.focusEditor),
            this.props.storeHasFocus(this.hasFocus);
        }
        render() {
          var { openedNote: e } = this.props;
          return i.createElement(
            'div',
            { className: 'note-detail-wrapper' },
            e
              ? i.createElement(Q, {
                  key: e,
                  storeFocusEditor: this.storeFocusContentEditor,
                  storeHasFocus: this.storeEditorHasFocus,
                })
              : i.createElement(
                  'div',
                  { className: 'note-detail-placeholder' },
                  i.createElement(W.A, null)
                )
          );
        }
      }
      (0, n.A)(G, 'displayName', 'NoteDetail');
      const j = (0, r.Ng)((e) => ({
        isDialogOpen: e.ui.dialogs.length > 0,
        keyboardShortcuts: e.settings.keyboardShortcuts,
        openedNote: e.ui.openedNote,
      }))(G);
      var z = o(94541),
        U = o(67796),
        V = o.n(U),
        Y = () =>
          'undefined' != typeof document &&
          'dark' === document.body.dataset.theme,
        q = { editNote: I.A.data.editNote };
      const Z = (0, r.Ng)((e, t) => {
        var o,
          n = null !== (o = t.noteId) && void 0 !== o ? o : e.ui.openedNote;
        return { note: e.data.notes.get(n) || null, noteId: n };
      }, q)((e) => {
        var { editNote: t, note: o, noteId: n } = e,
          r = (0, i.useRef)(null),
          s = (0, i.useRef)(null),
          a = (0, i.useRef)(!1),
          l = (0, i.useRef)('');
        return (
          (0, i.useEffect)(() => {
            if (r.current) {
              if (!document.getElementById('1txt-vditor-overrides')) {
                var e = document.createElement('style');
                (e.id = '1txt-vditor-overrides'),
                  (e.textContent =
                    '\n/* Hide the popover (up/down/delete floating bar) */\n.vditor-panel { display: none !important; }\n\n/* Hide heading labels (H1, H2, H3, H4, H5, H6) */\n.vditor-wysiwyg > .vditor-reset > h1::before,\n.vditor-wysiwyg > .vditor-reset > h2::before,\n.vditor-wysiwyg > .vditor-reset > h3::before,\n.vditor-wysiwyg > .vditor-reset > h4::before,\n.vditor-wysiwyg > .vditor-reset > h5::before,\n.vditor-wysiwyg > .vditor-reset > h6::before,\n.vditor-wysiwyg div.vditor-wysiwyg__block::before,\n.vditor-wysiwyg div[data-type="link-ref-defs-block"]::before,\n.vditor-wysiwyg div[data-type="footnotes-block"]::before,\n.vditor-wysiwyg .vditor-toc::before {\n  content: none !important;\n  display: none !important;\n}\n\n/* Hide Vditor toolbar */\n.vditor-toolbar { display: none !important; }\n\n/* Remove border, full height */\n.vditor {\n  border: none !important;\n  height: 100% !important;\n  display: flex !important;\n  flex-direction: column !important;\n}\n\n/* Vditor content fills available space and scrolls */\n.vditor-content {\n  flex: 1 1 auto !important;\n  overflow: hidden !important;\n  display: flex !important;\n  min-height: 0 !important;\n}\n\n.vditor-wysiwyg {\n  height: 100% !important;\n  overflow: hidden !important;\n}\n\n/* THE scrollable element — this is where text lives */\n.vditor-wysiwyg pre.vditor-reset {\n  /* Match Simplenote Narrow width by default */\n  padding: 16px calc((100% - 768px) / 2) !important;\n  font-size: 16px !important;\n  line-height: 1.7 !important;\n  overflow-y: auto !important;\n  height: 100% !important;\n}\n\n@media only screen and (max-width: 1400px) {\n  .vditor-wysiwyg pre.vditor-reset {\n    padding: 16px 10% !important;\n  }\n}\n\n/* Match Simplenote Full width when App has .is-line-length-full */\n.is-line-length-full .vditor-wysiwyg pre.vditor-reset {\n  padding: 16px 25px !important;\n}\n\n/* Fix note-editor flex to allow shrink and fill width */\n.note-editor {\n  min-height: 0 !important;\n  flex: 1 1 auto !important;\n  overflow: hidden !important;\n  width: 100% !important;\n}\n\n/* Ensure wrapper fills entire area */\n.note-detail-wrapper {\n  width: 100% !important;\n}\n\n/* Ensure container ignores padding for pure 100% width matching */\n.note-detail-wrapper .vditor {\n  width: 100% !important;\n  max-width: 100% !important;\n}\n\n/* ─────────────────────────────────────────────────────────────────────────\n   Code rendering (light theme).\n\n   Vditor\'s stock styles in WYSIWYG mode give inline <code> almost no\n   contrast against the editor background — on dark themes the foreground\n   and background end up only ~5% apart and the text is essentially\n   invisible. We force GitHub-ish high-contrast colors that work in both\n   themes (the dark overrides live in the block below this one).\n   ───────────────────────────────────────────────────────────────────── */\n.vditor-wysiwyg .vditor-reset :not(pre) > code {\n  background: rgba(175, 184, 193, 0.22);\n  color: #cf222e;\n  padding: 0.15em 0.4em;\n  margin: 0 0.1em;\n  border-radius: 4px;\n  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;\n  font-size: 0.92em;\n}\n\n.vditor-wysiwyg .vditor-reset pre {\n  background: #f6f8fa !important;\n  color: #24292f !important;\n  padding: 12px 14px !important;\n  border-radius: 6px !important;\n  border: 1px solid #d0d7de !important;\n  overflow-x: auto !important;\n  margin: 1em 0 !important;\n}\n\n.vditor-wysiwyg .vditor-reset pre > code {\n  background: transparent !important;\n  color: inherit !important;\n  padding: 0 !important;\n  margin: 0 !important;\n  border: 0 !important;\n  border-radius: 0 !important;\n  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace !important;\n  font-size: 0.92em !important;\n  display: block;\n}\n\n/* Dark theme overrides */\nbody[data-theme=\'dark\'] .vditor-wysiwyg .vditor-reset :not(pre) > code {\n  background: rgba(110, 118, 129, 0.4);\n  color: #ff7b72;\n}\n\nbody[data-theme=\'dark\'] .vditor-wysiwyg .vditor-reset pre {\n  background: #161b22 !important;\n  color: #c9d1d9 !important;\n  border-color: #30363d !important;\n}\n'),
                  document.head.appendChild(e);
              }
              var i = Y(),
                d = new (V())(r.current, {
                  mode: 'wysiwyg',
                  value: (null == o ? void 0 : o.content) || '',
                  height: '100%',
                  toolbar: [],
                  outline: { enable: !1, position: 'left' },
                  counter: { enable: !1 },
                  cache: { enable: !1 },
                  theme: i ? 'dark' : 'classic',
                  customWysiwygToolbar: () => {},
                  preview: {
                    theme: { current: i ? 'dark' : 'light' },
                    hljs: { style: i ? 'github-dark' : 'github' },
                  },
                  input: (e) => {
                    !a.current && n && t(n, { content: e });
                  },
                  after: () => {
                    (s.current = d), (l.current = n);
                  },
                });
              return () => {
                var e;
                null === (e = s.current) || void 0 === e || e.destroy(),
                  (s.current = null);
              };
            }
          }, [n]),
          (0, i.useEffect)(() => {
            var e = (e) => {
              var t = e.detail;
              if (t && 'string' == typeof t.snippet) {
                var o = s.current;
                if (o)
                  try {
                    o.insertValue(t.snippet, !0);
                  } catch (e) {
                    console.warn('[WysiwygEditor] insertValue failed:', e);
                  }
              }
            };
            return (
              window.addEventListener(O.zG, e, !0),
              () => window.removeEventListener(O.zG, e, !0)
            );
          }, []),
          (0, i.useEffect)(() => {
            s.current &&
              null != o &&
              o.content &&
              l.current === n &&
              s.current.getValue() !== o.content &&
              ((a.current = !0),
              s.current.setValue(o.content),
              setTimeout(() => {
                a.current = !1;
              }, 50));
          }, [null == o ? void 0 : o.content]),
          (0, i.useEffect)(() => {
            if ('undefined' != typeof MutationObserver) {
              var e = new MutationObserver((e) => {
                e.some(
                  (e) =>
                    'attributes' === e.type && 'data-theme' === e.attributeName
                ) &&
                  (() => {
                    var e = s.current;
                    if (e && 'function' == typeof e.setTheme) {
                      var t = Y();
                      try {
                        e.setTheme(
                          t ? 'dark' : 'classic',
                          t ? 'dark' : 'light',
                          t ? 'github-dark' : 'github'
                        );
                      } catch (e) {
                        console.warn('[WysiwygEditor] setTheme failed:', e);
                      }
                    }
                  })();
              });
              return (
                e.observe(document.body, {
                  attributes: !0,
                  attributeFilter: ['data-theme'],
                }),
                () => e.disconnect()
              );
            }
          }, []),
          o
            ? i.createElement(
                'div',
                {
                  className: 'note-detail-wrapper',
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1 1 auto',
                    minHeight: 0,
                    overflow: 'hidden',
                    height: '100%',
                  },
                },
                i.createElement('div', {
                  ref: r,
                  style: {
                    flex: '1 1 auto',
                    minHeight: 0,
                    height: '100%',
                    overflow: 'hidden',
                  },
                })
              )
            : null
        );
      });
      class J extends i.Component {
        constructor() {
          super(...arguments),
            (0, n.A)(this, 'markdownEnabled', () => {
              var e;
              return null === (e = this.props.note) || void 0 === e
                ? void 0
                : e.systemTags.includes('markdown');
            }),
            (0, n.A)(this, 'handleShortcut', (e) => {
              if (this.props.keyboardShortcuts) {
                var t,
                  o,
                  { ctrlKey: n, metaKey: i, shiftKey: r } = e,
                  s = e.key.toLowerCase(),
                  { note: a, noteId: l, toggleMarkdown: d } = this.props,
                  c = n || i;
                return a && c && r && 'm' === s
                  ? (d(l, !this.markdownEnabled()),
                    e.stopPropagation(),
                    e.preventDefault(),
                    !1)
                  : c && r && 'p' === s && this.markdownEnabled()
                    ? (this.props.toggleEditMode(),
                      e.stopPropagation(),
                      e.preventDefault(),
                      !1)
                    : !(
                        r &&
                        c &&
                        'y' === s &&
                        this.props.isEditorActive &&
                        (!this.editFieldHasFocus() || this.props.isSearchActive
                          ? (null === (t = this.focusNoteEditor) ||
                              void 0 === t ||
                              t.call(this),
                            e.stopPropagation(),
                            e.preventDefault(),
                            1)
                          : (null === (o = this.focusTagField) ||
                              void 0 === o ||
                              o.call(this),
                            e.stopPropagation(),
                            e.preventDefault(),
                            1))
                      );
              }
            }),
            (0, n.A)(
              this,
              'editFieldHasFocus',
              () => this.editorHasFocus && this.editorHasFocus()
            ),
            (0, n.A)(
              this,
              'storeEditorHasFocus',
              (e) => (this.editorHasFocus = e)
            ),
            (0, n.A)(
              this,
              'storeFocusEditor',
              (e) => (this.focusNoteEditor = e)
            ),
            (0, n.A)(
              this,
              'storeFocusTagField',
              (e) => (this.focusTagField = e)
            ),
            (0, n.A)(
              this,
              'storeTagFieldHasFocus',
              (e) => (this.tagFieldHasFocus = e)
            ),
            (0, n.A)(
              this,
              'tagFieldHasFocus',
              () => this.tagFieldHasFocus && this.tagFieldHasFocus()
            ),
            (0, n.A)(this, 'toggleShortcuts', (e) => {
              e
                ? window.addEventListener('keydown', this.handleShortcut, !0)
                : window.removeEventListener(
                    'keydown',
                    this.handleShortcut,
                    !0
                  );
            });
        }
        componentDidMount() {
          this.toggleShortcuts(!0);
        }
        componentWillUnmount() {
          this.toggleShortcuts(!1);
        }
        render() {
          var {
            editorViewMode: e,
            hasSearchQuery: t,
            hasSearchMatchesInNote: o,
            note: n,
            noteId: r,
          } = this.props;
          if (!n)
            return i.createElement(
              'div',
              { className: 'note-detail-placeholder' },
              i.createElement(W.A, null)
            );
          var s,
            a = !!n.deleted;
          return (
            (s =
              'source' !== e && n.systemTags.includes('markdown')
                ? 'wysiwyg' === e
                  ? i.createElement(Z, { noteId: r })
                  : i.createElement(z.default, { noteId: r })
                : i.createElement(j, {
                    storeFocusEditor: this.storeFocusEditor,
                    storeHasFocus: this.storeEditorHasFocus,
                  })),
            i.createElement(
              'div',
              { className: 'note-editor' },
              s,
              n &&
                !a &&
                i.createElement(N, {
                  storeFocusTagField: this.storeFocusTagField,
                  storeHasFocus: this.storeTagFieldHasFocus,
                }),
              t && o && i.createElement(d, null)
            )
          );
        }
      }
      (0, n.A)(J, 'displayName', 'NoteEditor');
      var X = {
        toggleNoteList: I.A.ui.toggleNoteList,
        toggleMarkdown: I.A.data.markdownNote,
        toggleEditMode: I.A.ui.toggleEditMode,
      };
      const $ = (0, r.Ng)(
        (e) => ({
          allTags: e.data.tags,
          editMode: e.ui.editMode,
          editorViewMode: e.ui.editorViewMode,
          keyboardShortcuts: e.settings.keyboardShortcuts,
          isEditorActive: !e.ui.showNavigation,
          noteId: e.ui.openedNote,
          note: e.data.notes.get(e.ui.openedNote),
          revision: e.ui.selectedRevision,
          hasSearchQuery: '' !== e.ui.searchQuery,
          hasSearchMatchesInNote:
            !!e.ui.numberOfMatchesInNote && e.ui.numberOfMatchesInNote > 0,
          isSearchActive: !!e.ui.searchQuery.length,
          isSmallScreen: C.Qv(e),
        }),
        X
      )(J);
    },
  },
]);
