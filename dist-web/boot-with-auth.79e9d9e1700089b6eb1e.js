(self.webpackChunk = self.webpackChunk || []).push([
  [3683],
  {
    9814: (e, t, n) => {
      'use strict';
      n.r(t), n.d(t, { bootWithToken: () => Vr });
      var a = n(45841),
        r = n(63696),
        o = n(41705),
        s = n(80249),
        i = n(83732),
        l = n.n(i);
      const c = (0, s.Ng)((e, t) => {
        var { noteId: n } = t;
        return { lastUpdated: e.simperium.lastSync.get(n) };
      })((e) => {
        var { lastUpdated: t } = e;
        return void 0 !== t
          ? r.createElement(
              'time',
              { dateTime: new Date(t).toISOString() },
              new Date(t).toLocaleString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })
            )
          : r.createElement('span', null);
      });
      var u = n(14863),
        d = n(16742),
        m = (e) => 'simplenote://note/'.concat(e),
        p = (e) => {
          var t = new Set();
          if (!e.ui.openedNote) return [];
          var n = m(e.ui.openedNote);
          return (
            e.data.notes.forEach((e, a) => {
              e.content.includes(n) && t.add(a);
            }),
            [...t.values()]
          );
        },
        h = (e, t) => {
          var n,
            a = e.data.notes.get(t);
          if (a && e.ui.openedNote) {
            var r = new RegExp(m(e.ui.openedNote), 'gi'),
              o =
                (null == a || null === (n = a.content.match(r)) || void 0 === n
                  ? void 0
                  : n.length) || 0,
              { title: s } = (0, d.Ay)(a);
            return {
              count: o,
              noteId: t,
              modificationDate: null == a ? void 0 : a.modificationDate,
              title: s,
            };
          }
        },
        g = n(61943);
      const v = (0, s.Ng)(
          (e, t) => {
            var { noteId: n } = t;
            return { reference: h(e, n) };
          },
          (e, t) => {
            var { noteId: n } = t;
            return { openNote: () => e(g.A.ui.selectNote(n)) };
          }
        )((e) => {
          var { openNote: t, reference: n } = e;
          return n
            ? r.createElement(
                'button',
                { className: 'reference-link', onClick: t },
                r.createElement(
                  'span',
                  { className: 'reference-title note-info-name' },
                  n.title
                ),
                r.createElement(
                  'span',
                  null,
                  n.count,
                  ' Reference',
                  n.count > 1 ? 's' : '',
                  n.modificationDate && ', last modified ',
                  n.modificationDate &&
                    r.createElement(
                      'time',
                      {
                        dateTime: new Date(
                          1e3 * n.modificationDate
                        ).toISOString(),
                      },
                      new Date(1e3 * n.modificationDate).toLocaleString([], {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      })
                    )
                )
              )
            : null;
        }),
        E = (0, s.Ng)((e) => ({ references: p(e) }))((e) => {
          var { references: t } = e;
          return t.length
            ? r.createElement(
                'div',
                {
                  className:
                    'note-references note-info-panel note-info-internal-link',
                },
                r.createElement(
                  'div',
                  { className: 'note-info-item' },
                  r.createElement(
                    'div',
                    { className: 'note-info-name' },
                    'Referenced In'
                  ),
                  t.map((e) => r.createElement(v, { noteId: e, key: e }))
                )
              )
            : null;
        });
      var f = n(1962);
      class y extends r.Component {
        render() {
          var { noteId: e, note: t, onModalClose: n, theme: a } = this.props,
            o = 1e3 * t.creationDate,
            s = t.modificationDate ? 1e3 * t.modificationDate : null;
          return r.createElement(
            l(),
            {
              key: 'note-info-modal',
              className: 'dialog-renderer__content note-info dialog',
              contentLabel: 'Document',
              isOpen: !0,
              onRequestClose: n,
              overlayClassName: 'dialog-renderer__overlay',
              portalClassName: 'dialog-renderer__portal',
              shouldCloseOnOverlayClick: !1,
            },
            r.createElement(
              'div',
              { className: 'note-info-panel note-info-stats' },
              r.createElement(
                'div',
                { className: 'note-info-header' },
                r.createElement('h2', { className: 'panel-title' }, 'Document'),
                r.createElement(
                  'button',
                  {
                    type: 'button',
                    'aria-label': 'Close note info',
                    className: 'about-done button icon-button',
                    onClick: n,
                  },
                  r.createElement(u.A, null)
                )
              ),
              r.createElement(
                'p',
                { className: 'note-info-item' },
                r.createElement(
                  'span',
                  { className: 'note-info-item-text' },
                  r.createElement(
                    'span',
                    { className: 'note-info-name' },
                    'Last synced'
                  ),
                  r.createElement(
                    'span',
                    { className: 'note-info-detail' },
                    r.createElement(c, { noteId: e })
                  )
                )
              ),
              s &&
                r.createElement(
                  'p',
                  { className: 'note-info-item' },
                  r.createElement(
                    'span',
                    { className: 'note-info-item-text' },
                    r.createElement(
                      'span',
                      { className: 'note-info-name' },
                      'Modified'
                    ),
                    r.createElement(
                      'span',
                      { className: 'note-info-detail' },
                      r.createElement(
                        'time',
                        { dateTime: new Date(s).toISOString() },
                        new Date(s).toLocaleString([], {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        })
                      )
                    )
                  )
                ),
              r.createElement(
                'p',
                { className: 'note-info-item' },
                r.createElement(
                  'span',
                  { className: 'note-info-item-text' },
                  r.createElement(
                    'span',
                    { className: 'note-info-name' },
                    'Created'
                  ),
                  r.createElement(
                    'span',
                    { className: 'note-info-detail' },
                    r.createElement(
                      'time',
                      { dateTime: new Date(o).toISOString() },
                      new Date(o).toLocaleString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })
                    )
                  )
                )
              ),
              r.createElement(
                'p',
                { className: 'note-info-item' },
                r.createElement(
                  'span',
                  { className: 'note-info-item-text' },
                  r.createElement(
                    'span',
                    { className: 'note-info-name' },
                    'Words'
                  ),
                  r.createElement(
                    'span',
                    { className: 'note-info-detail' },
                    (
                      (t.content || '')
                        .replace(/[\u200B]+/, '')
                        .trim()
                        .replace(/['";:,.?¿\-!¡]+/g, '')
                        .match(/\S+/g) || []
                    ).length
                  )
                )
              ),
              r.createElement(
                'p',
                { className: 'note-info-item' },
                r.createElement(
                  'span',
                  { className: 'note-info-item-text' },
                  r.createElement(
                    'span',
                    { className: 'note-info-name' },
                    'Characters'
                  ),
                  r.createElement(
                    'span',
                    { className: 'note-info-detail' },
                    (t.content || '').replace(N, '_').length
                  )
                )
              )
            ),
            r.createElement(E, null)
          );
        }
      }
      (0, o.A)(y, 'displayName', 'NoteInfo');
      var N = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
        b = { onModalClose: g.A.ui.toggleNoteInfo };
      const T = (0, s.Ng)((e) => {
        var t = e.data.notes.get(e.ui.openedNote);
        return { noteId: e.ui.openedNote, note: t, theme: (0, f.O4)(e) };
      }, b)(y);
      var w = n(4452),
        _ = n.n(w),
        O = n(4544),
        S = n.n(O),
        A = n(17243),
        C = n(100),
        I = n.n(C);
      const R = function (e) {
        var { container: t, linkText: n, text: a } = e,
          o = (0, r.useRef)(),
          s = (0, r.useRef)(),
          i = (0, r.useRef)(),
          l = () => {
            u(!0);
          },
          [c, u] = (0, r.useState)(!1);
        return (
          (0, r.useEffect)(() => {
            if (c) {
              var e = setTimeout(() => u(!1), 4e3);
              return () => clearTimeout(e);
            }
          }, [c]),
          (0, r.useEffect)(() => {
            (s.current = () => a), (i.current = l);
          }, [a, l]),
          (0, r.useEffect)(() => {
            var e = new (I())(o.current, {
              container: (null == t ? void 0 : t.current) || void 0,
              text: () => s.current(),
            });
            return e.on('success', () => i.current()), () => e.destroy();
          }, []),
          r.createElement(
            'button',
            { ref: o, type: 'button', className: 'button button-borderless' },
            c ? 'Copied!' : n
          )
        );
      };
      var k = n(68102),
        D = n(81515);
      function L() {
        return r.createElement(
          'svg',
          {
            className: 'checked-checkbox',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          r.createElement('path', {
            d: 'M19 3H5A2 2 0 0 0 3 5V19a2 2 0 0 0 2 2H19a2 2 0 0 0 2-2V5A2 2 0 0 0 19 3ZM10.14 16.85 5.76 12.48l1.42-1.42 3 3 6.63-6.63 1.41 1.42Z',
          })
        );
      }
      function M() {
        return r.createElement(
          'svg',
          {
            className: 'unchecked-checkbox',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          r.createElement('path', {
            d: 'M19 5h0V19H5V5H19m0-2H5A2 2 0 0 0 3 5V19a2 2 0 0 0 2 2H19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z',
          })
        );
      }
      var x = ['className', 'isStandard', 'checked'];
      const P = function (e) {
        var { className: t, isStandard: n, checked: a } = e,
          o = (0, D.A)(e, x);
        return r.createElement(
          'span',
          {
            className: _()('checkbox-control', [t, { 'checkbox-standard': n }]),
          },
          r.createElement(
            'input',
            (0, k.A)({ type: 'checkbox' }, o, { checked: a })
          ),
          n
            ? a
              ? r.createElement(L, null)
              : r.createElement(M, null)
            : r.createElement(
                'span',
                { className: 'checkbox-control-base' },
                r.createElement('span', {
                  className: 'checkbox-control-checked',
                })
              )
        );
      };
      var G = n(84099);
      class H extends r.Component {
        constructor() {
          super(...arguments),
            (0, o.A)(this, 'isMounted', !1),
            (0, o.A)(this, 'containerRef', r.createRef()),
            (0, o.A)(this, 'handleFocusTrapDeactivate', () => {
              var { onFocusTrapDeactivate: e } = this.props;
              this.isMounted && setTimeout(() => e(), 200);
            }),
            (0, o.A)(this, 'getNoteLink', (e, t) => {
              var { title: n } = (0, d.Ay)(e);
              return '['.concat(n, '](simplenote://note/').concat(t, ')');
            }),
            (0, o.A)(this, 'getPublishURL', (e) => {
              var t,
                n =
                  (null === (t = 'https://1txt.xyz')
                    ? void 0
                    : t.replace(/\/$/, '')) ||
                  ('undefined' != typeof window ? window.location.origin : '');
              return (0, A.isEmpty)(e) ? null : ''.concat(n, '/p/').concat(e);
            }),
            (0, o.A)(this, 'handleTogglePreviewButton', () => {
              var {
                editorViewMode: e,
                setViewMode: t,
                showPreviewButton: n,
                togglePreviewButton: a,
              } = this.props;
              n && 'preview' === e && t('wysiwyg'), a();
            }),
            (0, o.A)(this, 'handleShowNoteInfo', () => {
              this.props.closeNoteActions(), this.props.showNoteInfo();
            }),
            (0, o.A)(this, 'pinNote', (e) =>
              this.props.pinNote(this.props.noteId, e)
            ),
            (0, o.A)(this, 'publishNote', (e) =>
              this.props.publishNote(this.props.noteId, e)
            ),
            (0, o.A)(this, 'markdownNote', (e) =>
              this.props.markdownNote(this.props.noteId, e)
            );
        }
        componentDidMount() {
          this.isMounted = !0;
        }
        componentWillUnmount() {
          this.isMounted = !1;
        }
        render() {
          var {
              hasRevisions: e,
              isMarkdown: t,
              isPinned: n,
              noteId: a,
              note: o,
              showPreviewButton: s,
            } = this.props,
            i = (0, A.includes)(o.systemTags, 'published'),
            l = this.getPublishURL(o.publishURL),
            c = this.getNoteLink(o, a);
          return r.createElement(
            S(),
            {
              focusTrapOptions: {
                clickOutsideDeactivates: !0,
                onDeactivate: this.handleFocusTrapDeactivate,
              },
            },
            r.createElement(
              'div',
              { className: 'note-actions', ref: this.containerRef },
              r.createElement(
                'div',
                { className: 'note-actions-panel' },
                r.createElement(
                  'label',
                  {
                    className: 'note-actions-item',
                    htmlFor: 'note-actions-pin-checkbox',
                  },
                  r.createElement(
                    'span',
                    { className: 'note-actions-item-text' },
                    r.createElement(
                      'span',
                      { className: 'note-actions-name' },
                      'Pin to top'
                    )
                  ),
                  r.createElement(
                    'span',
                    { className: 'note-actions-item-control' },
                    r.createElement(P, {
                      id: 'note-actions-pin-checkbox',
                      checked: n,
                      isStandard: !0,
                      onChange: () => {
                        this.pinNote(!n);
                      },
                    })
                  )
                ),
                r.createElement(
                  'label',
                  {
                    className: 'note-actions-item',
                    htmlFor: 'note-actions-markdown-checkbox',
                  },
                  r.createElement(
                    'span',
                    { className: 'note-actions-item-text' },
                    r.createElement(
                      'span',
                      { className: 'note-actions-name' },
                      'Markdown'
                    )
                  ),
                  r.createElement(
                    'span',
                    { className: 'note-actions-item-control' },
                    r.createElement(P, {
                      id: 'note-actions-markdown-checkbox',
                      checked: t,
                      isStandard: !0,
                      onChange: () => {
                        this.markdownNote(!t);
                      },
                    })
                  )
                ),
                r.createElement(
                  'label',
                  {
                    className: 'note-actions-item',
                    htmlFor: 'note-actions-preview-button-checkbox',
                  },
                  r.createElement(
                    'span',
                    { className: 'note-actions-item-text' },
                    r.createElement(
                      'span',
                      { className: 'note-actions-name' },
                      'Show preview button'
                    )
                  ),
                  r.createElement(
                    'span',
                    { className: 'note-actions-item-control' },
                    r.createElement(P, {
                      id: 'note-actions-preview-button-checkbox',
                      checked: s,
                      isStandard: !0,
                      onChange: this.handleTogglePreviewButton,
                    })
                  )
                ),
                r.createElement(
                  'div',
                  { className: 'note-actions-item note-actions-internal-link' },
                  r.createElement(R, {
                    container: this.containerRef,
                    text: c,
                    linkText: 'Copy Internal Link',
                  })
                ),
                r.createElement(
                  'div',
                  { className: 'note-actions-item' },
                  r.createElement(
                    'button',
                    {
                      className: 'button button-borderless',
                      onClick: this.handleShowNoteInfo,
                    },
                    'Note info…'
                  )
                ),
                e &&
                  r.createElement(
                    'div',
                    { className: 'note-actions-item' },
                    r.createElement(
                      'button',
                      {
                        className: 'button button-borderless',
                        onClick: this.props.toggleRevisions,
                      },
                      'History…'
                    )
                  ),
                e ||
                  r.createElement(
                    'div',
                    {
                      className: 'note-actions-item note-actions-item-disabled',
                    },
                    r.createElement(
                      'span',
                      { className: 'note-actions-disabled' },
                      'History (unavailable)'
                    )
                  )
              ),
              r.createElement(
                'div',
                { className: 'note-actions-panel note-actions-public-link' },
                r.createElement(
                  'label',
                  {
                    className: 'note-actions-item',
                    htmlFor: 'note-actions-publish-checkbox',
                  },
                  r.createElement(
                    'span',
                    { className: 'note-actions-item-text' },
                    r.createElement(
                      'span',
                      { className: 'note-actions-name' },
                      'Publish'
                    )
                  ),
                  r.createElement(
                    'span',
                    { className: 'note-actions-item-control' },
                    r.createElement(P, {
                      id: 'note-actions-publish-checkbox',
                      checked: i,
                      isStandard: !0,
                      onChange: () => {
                        this.publishNote(!i);
                      },
                    })
                  )
                ),
                r.createElement(
                  'div',
                  {
                    className: _()('note-actions-item', {
                      'note-actions-item-disabled': !i || !l,
                    }),
                  },
                  i && l
                    ? r.createElement(R, {
                        container: this.containerRef,
                        text: l,
                        linkText: 'Copy Link',
                      })
                    : i && !l
                      ? r.createElement(
                          r.Fragment,
                          null,
                          r.createElement(
                            'span',
                            { className: 'note-actions-disabled' },
                            'Copy Link'
                          ),
                          r.createElement(G.A, {
                            isWhite: !1,
                            size: 16,
                            thickness: 5,
                          })
                        )
                      : r.createElement(
                          'span',
                          { className: 'note-actions-disabled' },
                          'Copy Link'
                        )
                )
              ),
              r.createElement(
                'div',
                { className: 'note-actions-panel' },
                r.createElement(
                  'div',
                  { className: 'note-actions-item' },
                  r.createElement(
                    'button',
                    {
                      className: 'button button-borderless',
                      onClick: this.props.shareNote,
                    },
                    'Collaborate…'
                  )
                )
              ),
              r.createElement(
                'div',
                { className: 'note-actions-panel' },
                r.createElement(
                  'div',
                  { className: 'note-actions-item note-actions-trash' },
                  r.createElement(
                    'button',
                    {
                      className: 'button button-borderless',
                      onClick: this.props.trashNote,
                    },
                    'Move to Trash'
                  )
                )
              )
            )
          );
        }
      }
      (0, o.A)(H, 'displayName', 'NoteActions');
      var V = {
        closeNoteActions: g.A.ui.closeNoteActions,
        markdownNote: g.A.data.markdownNote,
        onFocusTrapDeactivate: g.A.ui.closeNoteActions,
        pinNote: g.A.data.pinNote,
        publishNote: g.A.data.publishNote,
        setViewMode: (e) => ({ type: 'SET_EDITOR_VIEW_MODE', mode: e }),
        shareNote: () => g.A.ui.showDialog('SHARE'),
        showNoteInfo: g.A.ui.toggleNoteInfo,
        togglePreviewButton: g.A.settings.togglePreviewButton,
        toggleRevisions: g.A.ui.toggleRevisions,
        trashNote: g.A.ui.trashOpenNote,
      };
      const F = (0, s.Ng)((e) => {
        var t,
          {
            data: n,
            settings: a,
            ui: { editorViewMode: r, openedNote: o },
          } = e,
          s = n.notes.get(o);
        return {
          editorViewMode: r,
          noteId: o,
          note: s,
          hasRevisions: !(
            null === (t = n.noteRevisions.get(o)) ||
            void 0 === t ||
            !t.size
          ),
          isMarkdown: null == s ? void 0 : s.systemTags.includes('markdown'),
          isPinned: null == s ? void 0 : s.systemTags.includes('pinned'),
          showPreviewButton: !!a.showPreviewButton,
        };
      }, V)(H);
      var U = n(30592);
      function j() {
        return r.createElement(
          'svg',
          {
            className: 'icon-connection',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          r.createElement('path', {
            d: 'M12 15c1.1 0 2.09 0.44 2.81 1.16L12 18.97l-2.81-2.81C9.91 15.44 10.9 15 12 15zM2.12 9.09l1.41 1.41C5.7 8.34 8.69 7 12 7s6.3 1.34 8.47 3.5l1.41-1.41C19.35 6.56 15.86 5 12 5S4.65 6.56 2.12 9.09zM5.65 12.62l1.41 1.41C8.33 12.78 10.07 12 12 12s3.67 0.78 4.93 2.04l1.41-1.41C16.72 11 14.48 10 12 10S7.28 11 5.65 12.62z',
          })
        );
      }
      function B() {
        return r.createElement(
          'svg',
          {
            className: 'icon-no-connection',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          r.createElement('path', {
            d: 'M10.88 7.06L9.13 5.3C10.05 5.1 11.01 5 12 5c3.86 0 7.35 1.56 9.88 4.09l-1.41 1.41C18.3 8.34 15.31 7 12 7 11.62 7 11.25 7.02 10.88 7.06zM18.35 12.62c-1.16-1.15-2.63-1.98-4.27-2.37l3.32 3.32L18.35 12.62zM11.05 10.05L8.52 7.52 6.95 5.95 3.51 2.51 2.1 3.93l2.95 2.95C3.98 7.49 2.98 8.22 2.12 9.09l1.41 1.41C4.4 9.63 5.42 8.92 6.52 8.35l2.25 2.25c-1.18 0.45-2.24 1.15-3.12 2.02l1.41 1.41c0.9-0.89 2.03-1.53 3.3-1.84l3.08 3.08C13 15.11 12.51 15 12 15c-1.1 0-2.09 0.44-2.81 1.16L12 18.97l2.57-2.57 4.5 4.5 1.41-1.41 -7.39-7.39L11.05 10.05z',
          })
        );
      }
      const W = (0, s.Ng)((e) => ({
        connectionStatus: e.simperium.connectionStatus,
      }))((e) => {
        var { connectionStatus: t } = e;
        return r.createElement(
          'div',
          { className: 'navigation-bar__footer-item' },
          r.createElement(
            U.A,
            {
              enterDelay: 200,
              classes: { tooltip: 'icon-button__tooltip' },
              title:
                'green' === t
                  ? '1TXT is connected and syncing with the server.'
                  : 'offline' === t
                    ? "You're offline. Edits are saved locally and will upload automatically once the network is back."
                    : "1TXT hasn't reached the server in a while. Your edits are safe locally and will sync as soon as the connection recovers.",
            },
            r.createElement(
              'p',
              null,
              'green' === t
                ? r.createElement(j, null)
                : r.createElement(B, null),
              r.createElement(
                'span',
                { className: 'server-connection__label' },
                'Server connection'
              )
            )
          )
        );
      });
      var z = n(59874),
        q = n(62688),
        Y = n.n(q),
        Q = (e) => {
          var { icon: t, isSelected: n = !1, label: a, onClick: o } = e,
            s = _()('navigation-bar-item', { 'is-selected': n });
          return r.createElement(
            'div',
            { className: s },
            r.createElement(
              'button',
              { type: 'button', className: 'button', onClick: o },
              r.createElement(
                'span',
                { className: 'navigation-bar-item__icon' },
                t
              ),
              a
            )
          );
        };
      Q.propTypes = {
        icon: Y().element.isRequired,
        isSelected: Y().bool,
        label: Y().string.isRequired,
        onClick: Y().func.isRequired,
      };
      const K = Q;
      var Z = n(85373);
      function X() {
        return r.createElement(
          'svg',
          {
            className: 'icon-reorder',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          r.createElement('path', {
            d: 'M19,8H5V6H19Zm2,3H3v2H21Zm-2,5H5v2H19Z',
          })
        );
      }
      var J = n(62285),
        $ = { renameTag: g.A.data.renameTag };
      const ee = (0, s.Ng)(
        null,
        $
      )((e) => {
        var {
            editable: t,
            isSelected: n,
            onClick: a,
            renameTag: o,
            tagName: s,
          } = e,
          [i, l] = (0, r.useState)(s),
          c = _()('tag-list-input', { 'is-selected': n });
        return t
          ? r.createElement('input', {
              className: c,
              readOnly: !t,
              onClick: a,
              value: i,
              onChange: (e) => {
                l(e.target.value.replace(/[\s,]/g, ''));
              },
              onBlur: (e) => {
                var t,
                  n =
                    null === (t = e.target) || void 0 === t
                      ? void 0
                      : t.value.trim();
                (0, J.YG)(n).length > J.oH
                  ? l(s)
                  : n && n !== s
                    ? o(s, n)
                    : l(s);
              },
              spellCheck: !1,
              onKeyDown: (e) => {
                (0, J.YG)(i).length >= J.oH &&
                  String.fromCharCode(e.which).match(/([^,\s])/g) &&
                  e.preventDefault();
              },
            })
          : r.createElement('button', { className: c, onClick: a }, i);
      });
      var te = n(97099),
        ne = n(27528),
        ae = (0, Z.D)(() => r.createElement(X, null)),
        re = (0, Z.Zj)((e) => {
          var {
            allowReordering: t,
            editingActive: n,
            isSelected: a,
            selectTag: o,
            theme: s,
            trashTag: i,
            value: [l, c],
          } = e;
          return r.createElement(
            'li',
            {
              key: l,
              className: _()('tag-list-item', { 'is-selected': a }),
              'data-tag-name': c.name,
            },
            r.createElement(ee, {
              editable: n,
              isSelected: a,
              onClick: () => !n && o(c.name),
              tagName: c.name,
            }),
            n &&
              r.createElement(
                'button',
                { className: 'icon-button button-trash' },
                r.createElement(te.A, { onClick: () => i(c.name) })
              ),
            n &&
              t &&
              r.createElement(
                'button',
                { className: 'icon-button button-reorder' },
                r.createElement(ae, null)
              )
          );
        }),
        oe = (0, Z.q6)((e) => {
          var {
            editingTags: t,
            items: n,
            openedTagHash: a,
            openTag: o,
            sortTagsAlpha: s,
            theme: i,
            trashTheTag: l,
          } = e;
          return r.createElement(
            'ul',
            { className: 'tag-list-items' },
            n.map((e, n) =>
              r.createElement(re, {
                key: e[0],
                allowReordering: !s,
                editingActive: t,
                index: n,
                isSelected: a === e[0],
                selectTag: o,
                theme: i,
                trashTag: l,
                value: e,
              })
            )
          );
        });
      class se extends r.Component {
        constructor() {
          super(...arguments),
            (0, o.A)(this, 'reorderTag', (e) => {
              var { newIndex: t, nodes: n, oldIndex: a } = e,
                r = n[a].node.dataset.tagName;
              this.props.reorderTag(r, t);
            });
        }
        render() {
          var {
              editingTags: e,
              onEditTags: t,
              openedTag: n,
              openTag: a,
              sortTagsAlpha: o,
              tags: s,
              theme: i,
              trashTag: l,
            } = this.props,
            c = _()('tag-list', { 'tag-list-editing': this.props.editingTags }),
            u = Array.from(s)
              .filter((e) => {
                var [t, { name: n }] = e;
                return !(0, z.A)(n);
              })
              .sort((e, t) => {
                var [n, a] = e,
                  [r, s] = t;
                return o
                  ? a.name.localeCompare(s.name)
                  : void 0 !== a.index && void 0 !== s.index
                    ? a.index - s.index
                    : void 0 === a.index
                      ? 1
                      : -1;
              });
          return r.createElement(
            'div',
            { className: c },
            r.createElement(
              'div',
              { className: 'tag-list-title' },
              r.createElement('h2', null, 'Tags'),
              u.length > 0 &&
                r.createElement(
                  'button',
                  {
                    className: 'tag-list-edit-toggle button button-borderless',
                    tabIndex: 0,
                    onClick: t,
                  },
                  e ? 'Done' : 'Edit'
                )
            ),
            r.createElement(oe, {
              editingTags: e,
              lockAxis: 'y',
              openedTagHash: (n && (0, J.YG)(n)) || null,
              openTag: a,
              items: u,
              sortTagsAlpha: o,
              theme: i,
              onSortEnd: this.reorderTag,
              useDragHandle: !0,
              trashTheTag: l,
            })
          );
        }
      }
      (0, o.A)(se, 'displayName', 'TagList');
      var ie = {
        onEditTags: ne.toggleTagEditing,
        openTag: ne.openTag,
        reorderTag: (e, t) => ({
          type: 'REORDER_TAG',
          tagName: e,
          newIndex: t,
        }),
        trashTag: (e) =>
          (0, ne.showDialog)('TRASH-TAG-CONFIRMATION', { tagName: e }),
      };
      const le = (0, s.Ng)((e) => {
        var {
          data: t,
          settings: { sortTagsAlpha: n },
          ui: { editingTags: a },
        } = e;
        return {
          editingTags: a,
          openedTag: f.Q5(e),
          sortTagsAlpha: n,
          tags: t.tags,
          theme: f.O4(e),
        };
      }, ie)(se);
      var ce = n(38634);
      function ue() {
        return r.createElement(
          'svg',
          {
            className: 'icon-settings',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          r.createElement('path', {
            d: 'M15 22H9v-2.59c-0.689-0.277-1.336-0.651-1.92-1.11l-2.24 1.3 -3-5.2 2.24-1.29c-0.107-0.736-0.107-1.484 0-2.22L1.84 9.6l3-5.2 2.24 1.3C7.667 5.245 8.313 4.871 9 4.59V2h6v2.59c0.689 0.277 1.336 0.651 1.92 1.11l2.24-1.3 3 5.2 -2.24 1.29c0.107 0.736 0.107 1.484 0 2.22l2.24 1.29 -3 5.2 -2.24-1.3c-0.584 0.459-1.231 0.833-1.92 1.11V22zM11 20h2v-2l0.72-0.21c0.896-0.277 1.717-0.756 2.4-1.4l0.54-0.51 1.77 1 1-1.73 -1.77-1 0.17-0.72c0.227-0.913 0.227-1.867 0-2.78l-0.17-0.72 1.77-1 -1-1.74 -1.77 1 -0.54-0.52c-0.688-0.639-1.512-1.115-2.41-1.39L13 6V4h-2v2l-0.72 0.21C9.386 6.488 8.566 6.963 7.88 7.6L7.34 8.12l-1.77-1 -1 1.74 1.77 1 -0.17 0.72c-0.227 0.913-0.227 1.867 0 2.78l0.17 0.72 -1.77 1 1 1.73 1.77-1 0.54 0.51c0.685 0.643 1.51 1.119 2.41 1.39L11 18V20zM12 15.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5S13.933 15.5 12 15.5zM12 10.5c-0.828 0-1.5 0.672-1.5 1.5s0.672 1.5 1.5 1.5 1.5-0.672 1.5-1.5S12.828 10.5 12 10.5z',
          })
        );
      }
      var de = n(64784),
        me = n(37453);
      class pe extends r.Component {
        constructor() {
          super(...arguments),
            (0, o.A)(this, 'isMounted', !1),
            (0, o.A)(this, 'handleFocusTrapDeactivate', () => {
              var { onFocusTrapDeactivate: e, showNavigation: t } = this.props;
              t && this.isMounted && e();
            }),
            (0, o.A)(this, 'onHelpClicked', () =>
              (0, me.i)('http://simplenote.com/help')
            ),
            (0, o.A)(this, 'onSelectTrash', () => {
              this.props.selectTrash();
            }),
            (0, o.A)(this, 'isSelected', (e) => {
              var { selectedRow: t } = e;
              return this.props.collection.type === t;
            });
        }
        componentDidMount() {
          this.isMounted = !0;
        }
        componentWillUnmount() {
          this.isMounted = !1;
        }
        render() {
          var {
              autoHideMenuBar: e,
              isDialogOpen: t,
              onAbout: n,
              onSettings: a,
              onShowAllNotes: o,
              onShowUntaggedNotes: s,
              tags: i,
            } = this.props,
            l = Array.from(i).filter((e) => {
              var [t, { name: n }] = e;
              return !(0, z.A)(n);
            }).length;
          return r.createElement(
            S(),
            {
              paused: t,
              focusTrapOptions: {
                clickOutsideDeactivates: !0,
                onDeactivate: this.handleFocusTrapDeactivate,
              },
            },
            r.createElement(
              'div',
              { className: 'navigation-bar' },
              r.createElement(
                'div',
                { className: 'navigation-bar__folders' },
                r.createElement(K, {
                  icon: r.createElement(ce.A, null),
                  isSelected: this.isSelected({ selectedRow: 'all' }),
                  label: 'All Notes',
                  onClick: o,
                }),
                r.createElement(K, {
                  icon: r.createElement(te.A, null),
                  isSelected: this.isSelected({ selectedRow: 'trash' }),
                  label: 'Trash',
                  onClick: this.onSelectTrash,
                }),
                r.createElement(K, {
                  icon: r.createElement(ue, null),
                  label: 'Settings',
                  onClick: a,
                })
              ),
              r.createElement(
                'div',
                { className: 'navigation-bar__tags' },
                (l &&
                  r.createElement(
                    r.Fragment,
                    null,
                    r.createElement(le, null),
                    r.createElement(
                      'div',
                      {
                        className:
                          'navigation-bar__folders navigation-bar__untagged',
                      },
                      r.createElement(K, {
                        icon: r.createElement(de.A, null),
                        isSelected: this.isSelected({
                          selectedRow: 'untagged',
                        }),
                        label: 'Untagged Notes',
                        onClick: s,
                      })
                    )
                  )) ||
                  null
              ),
              r.createElement(
                'div',
                { className: 'navigation-bar__tools' },
                r.createElement(
                  'div',
                  { className: 'navigation-bar__server-connection' },
                  r.createElement(W, null)
                )
              ),
              r.createElement(
                'div',
                { className: 'navigation-bar__footer' },
                r.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'navigation-bar__footer-item',
                    onClick: this.props.showKeyboardShortcuts,
                  },
                  'Keyboard Shortcuts'
                )
              ),
              r.createElement(
                'div',
                { className: 'navigation-bar__footer' },
                r.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'navigation-bar__footer-item',
                    onClick: this.onHelpClicked,
                  },
                  'Help & Support'
                ),
                r.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'navigation-bar__footer-item',
                    onClick: n,
                  },
                  'About'
                )
              )
            )
          );
        }
      }
      (0, o.A)(pe, 'displayName', 'NavigationBar');
      var he = {
        onAbout: () => g.A.ui.showDialog('ABOUT'),
        onFocusTrapDeactivate: g.A.ui.toggleNavigation,
        onShowAllNotes: g.A.ui.showAllNotes,
        onShowUntaggedNotes: g.A.ui.showUntaggedNotes,
        onSettings: () => g.A.ui.showDialog('SETTINGS'),
        selectTrash: g.A.ui.selectTrash,
        showKeyboardShortcuts: () => g.A.ui.showDialog('KEYBINDINGS'),
      };
      const ge = (0, s.Ng)((e) => {
        var {
          data: t,
          settings: n,
          ui: { collection: a, dialogs: r, showNavigation: o },
        } = e;
        return {
          autoHideMenuBar: n.autoHideMenuBar,
          collection: a,
          isDialogOpen: r.length > 0,
          showNavigation: o,
          tags: t.tags,
        };
      }, he)(pe);
      var ve = n(255),
        Ee = n(67893);
      function fe() {
        return r.createElement(
          'svg',
          {
            className: 'icon-new-note',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          r.createElement('path', {
            d: 'M9.707 12.879L19.59 3 21 4.41l-9.879 9.883L9 15 9.707 12.879zM18 18H6V6h7V4H6.002C4.896 4 4 4.896 4 6.002v11.996C4 19.104 4.896 20 6.002 20h11.996C19.104 20 20 19.104 20 17.998V11h-2V18z',
          })
        );
      }
      function ye() {
        return r.createElement(
          'svg',
          {
            className: 'icon-menu',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          r.createElement('path', {
            d: 'M21 11H3v2H21Zm0-5H3V8H21Zm0 10H3v2H21Z',
          })
        );
      }
      var Ne = n(48940),
        be = (e) => {
          var t,
            {
              collection: n,
              openedTag: a,
              onNewNote: o,
              searchQuery: s,
              toggleNavigation: i,
            } = e;
          switch (n.type) {
            case 'tag':
              t = a;
              break;
            case 'trash':
              t = 'Trash';
              break;
            case 'untagged':
              t = 'Untagged Notes';
              break;
            default:
              t = 'All Notes';
          }
          var l = Ee.cX ? 'Cmd' : 'Ctrl';
          return r.createElement(
            'div',
            { className: 'menu-bar' },
            r.createElement(ve.A, {
              icon: r.createElement(ye, null),
              onClick: i,
              title: 'Menu • '.concat(l, '+Shift+U'),
            }),
            r.createElement(
              'div',
              {
                id: 'notes-title',
                className: 'notes-title',
                'aria-hidden': 'true',
              },
              t
            ),
            r.createElement(ve.A, {
              icon: r.createElement(fe, null),
              onClick: () => o((0, Ne.C)(s)),
              title: 'New Note • '.concat(l, '+Shift+I'),
            })
          );
        };
      be.displayName = 'MenuBar';
      const Te = (0, s.Ng)(
        (e) => ({
          collection: e.ui.collection,
          openedTag: f.Q5(e),
          searchQuery: e.ui.searchQuery,
        }),
        (e) => ({
          onNewNote: (t) => {
            e((0, ne.createNote)(t));
          },
          toggleNavigation: () => {
            e((0, ne.toggleNavigation)());
          },
        })
      )(be);
      function we() {
        return r.createElement(
          'svg',
          {
            className: 'icon-back',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          r.createElement('path', {
            d: 'M21 11H6.83l5.72-5.72 -1.42-1.41L3 12l8.13 8.13 1.42-1.41L6.83 13H21V11z',
          })
        );
      }
      function _e() {
        return r.createElement(
          'svg',
          {
            className: 'icon-ellipsis-outline',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
            width: '24',
            height: '24',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          r.createElement('path', {
            d: 'M12 2C6.486 2 2 6.486 2 12c0 5.514 4.486 10 10 10 5.514 0 10-4.486 10-10C22 6.486 17.514 2 12 2zM12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8S16.411 20 12 20zM13.5 12c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5 0.672-1.5 1.5-1.5S13.5 11.172 13.5 12zM9 12c0 0.828-0.672 1.5-1.5 1.5S6 12.828 6 12s0.672-1.5 1.5-1.5S9 11.172 9 12zM18 12c0 0.828-0.672 1.5-1.5 1.5S15 12.828 15 12s0.672-1.5 1.5-1.5S18 11.172 18 12z',
          })
        );
      }
      function Oe() {
        return r.createElement(
          'svg',
          {
            className: 'icon-sidebar',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          r.createElement('path', {
            d: 'M20 4H4A2 2 0 0 0 2 6V18a2 2 0 0 0 2 2H20a2 2 0 0 0 2-2V6A2 2 0 0 0 20 4ZM4 6H7V18H4ZM20 18H9V6H20Z',
          })
        );
      }
      var Se = n(60832),
        Ae = n(45851),
        Ce = () =>
          r.createElement(
            'svg',
            {
              className: 'icon-insert-markdown',
              xmlns: 'http://www.w3.org/2000/svg',
              viewBox: '0 0 24 24',
              'aria-hidden': 'true',
            },
            r.createElement('rect', {
              x: '2.25',
              y: '5.25',
              width: '19.5',
              height: '13.5',
              rx: '2.25',
              ry: '2.25',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '1.6',
            }),
            r.createElement('path', {
              d: 'M5.5 15.5 V 8.5 L 8.25 12 L 11 8.5 V 15.5',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '1.6',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
            }),
            r.createElement('path', {
              d: 'M16.25 8.5 V 13.5 M 13.75 12 L 16.25 14.75 L 18.75 12',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '1.6',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
            })
          );
      const Ie = () => {
        var [e, t] = (0, r.useState)(!1),
          n = (0, r.useRef)(null),
          a = (0, r.useCallback)(() => t(!1), []),
          o = (0, r.useCallback)(() => t((e) => !e), []),
          s = (0, r.useCallback)((e) => {
            (0, Ae.Ff)(e), t(!1);
          }, []);
        return (
          (0, r.useEffect)(() => {
            if (e) {
              var n = (e) => {
                'Escape' === e.key && t(!1);
              };
              return (
                window.addEventListener('keydown', n),
                () => window.removeEventListener('keydown', n)
              );
            }
          }, [e]),
          r.createElement(
            'div',
            { className: 'insert-menu', ref: n },
            r.createElement(
              'div',
              { onClick: o },
              r.createElement(ve.A, {
                icon: r.createElement(Ce, null),
                title: 'Insert Markdown',
              })
            ),
            r.createElement(
              Se.A,
              {
                show: e,
                onHide: a,
                rootClose: !0,
                placement: 'bottom-end',
                target: n.current,
                container: document.body,
              },
              (e) => {
                var { props: t } = e;
                return r.createElement(
                  'div',
                  (0, k.A)({}, t, {
                    className: 'insert-menu__popover',
                    role: 'menu',
                    'aria-label': 'Insert Markdown',
                  }),
                  Ae.nc.map((e) =>
                    r.createElement(
                      'button',
                      {
                        key: e.id,
                        type: 'button',
                        role: 'menuitem',
                        className: 'insert-menu__item',
                        title: e.label,
                        onClick: () => s(e),
                      },
                      r.createElement(
                        'span',
                        { className: 'insert-menu__item-preview' },
                        ((e) => {
                          switch (e.id) {
                            case 'h1':
                              return r.createElement(
                                'span',
                                { className: 'insert-menu__preview-h1' },
                                'H1'
                              );
                            case 'h2':
                              return r.createElement(
                                'span',
                                { className: 'insert-menu__preview-h2' },
                                'H2'
                              );
                            case 'h3':
                              return r.createElement(
                                'span',
                                { className: 'insert-menu__preview-h3' },
                                'H3'
                              );
                            case 'bold':
                              return r.createElement('strong', null, 'Bold');
                            case 'italic':
                              return r.createElement('em', null, 'Italic');
                            case 'quote':
                              return r.createElement(
                                'span',
                                { className: 'insert-menu__preview-quote' },
                                'Quoted text'
                              );
                            case 'ul':
                              return r.createElement(
                                'span',
                                { className: 'insert-menu__preview-list' },
                                r.createElement(
                                  'span',
                                  { 'aria-hidden': 'true' },
                                  '•'
                                ),
                                ' Item'
                              );
                            case 'ol':
                              return r.createElement(
                                'span',
                                { className: 'insert-menu__preview-list' },
                                r.createElement(
                                  'span',
                                  { 'aria-hidden': 'true' },
                                  '1.'
                                ),
                                ' Item'
                              );
                            case 'checklist':
                              return r.createElement(
                                'span',
                                { className: 'insert-menu__preview-list' },
                                r.createElement(
                                  'span',
                                  { 'aria-hidden': 'true' },
                                  '☐'
                                ),
                                ' Task'
                              );
                            case 'inline-code':
                              return r.createElement(
                                'code',
                                { className: 'insert-menu__preview-code' },
                                'code'
                              );
                            case 'code-block':
                              return r.createElement(
                                'span',
                                { className: 'insert-menu__preview-codeblock' },
                                r.createElement('code', null, 'code block')
                              );
                            case 'link':
                              return r.createElement(
                                'span',
                                { className: 'insert-menu__preview-link' },
                                'Link'
                              );
                            case 'hr':
                              return r.createElement('span', {
                                className: 'insert-menu__preview-hr',
                                'aria-hidden': 'true',
                              });
                            default:
                              return e.caption;
                          }
                        })(e)
                      ),
                      r.createElement(
                        'span',
                        { className: 'insert-menu__item-caption' },
                        e.caption
                      )
                    )
                  )
                );
              }
            )
          )
        );
      };
      class Re extends r.Component {
        constructor() {
          super(...arguments),
            (0, o.A)(this, 'renderNormal', () => {
              var {
                newNote: e,
                markdownEnabled: t,
                note: n,
                showPreviewButton: a,
                toggleNoteActions: o,
              } = this.props;
              return n
                ? r.createElement(
                    'div',
                    {
                      'aria-label': 'note actions',
                      role: 'toolbar',
                      className: 'note-toolbar',
                    },
                    r.createElement(
                      'div',
                      { className: 'note-toolbar__column-left' },
                      r.createElement(
                        'div',
                        {
                          className:
                            'note-toolbar__button new-note-toolbar__button-sidebar',
                        },
                        r.createElement(ve.A, {
                          icon: r.createElement(fe, null),
                          onClick: () => e(),
                          title: 'New Note • '.concat(Ee.Vh, '+Shift+I'),
                        })
                      ),
                      r.createElement(
                        'div',
                        {
                          className:
                            'note-toolbar__button note-toolbar__button-sidebar',
                        },
                        r.createElement(ve.A, {
                          icon: r.createElement(Oe, null),
                          onClick: this.props.toggleFocusMode,
                          title: 'Toggle Focus Mode',
                        })
                      ),
                      r.createElement(
                        'div',
                        { className: 'note-toolbar__button note-toolbar-back' },
                        r.createElement(ve.A, {
                          icon: r.createElement(we, null),
                          onClick: this.props.toggleNoteList,
                          title: 'Back • '.concat(Ee.Vh, '+Shift+L'),
                        })
                      )
                    ),
                    r.createElement(
                      'div',
                      { className: 'note-toolbar__column-right' },
                      t &&
                        r.createElement(
                          'div',
                          { className: 'note-toolbar__mode-switcher' },
                          r.createElement(
                            'button',
                            {
                              type: 'button',
                              className: 'mode-btn '.concat(
                                'source' === this.props.editorViewMode
                                  ? 'active'
                                  : ''
                              ),
                              onClick: () => this.props.setViewMode('source'),
                              title: 'Source',
                            },
                            '</>'
                          ),
                          r.createElement(
                            'button',
                            {
                              type: 'button',
                              className: 'mode-btn '.concat(
                                'wysiwyg' === this.props.editorViewMode
                                  ? 'active'
                                  : ''
                              ),
                              onClick: () => this.props.setViewMode('wysiwyg'),
                              title: 'WYSIWYG',
                            },
                            'Aa'
                          ),
                          a &&
                            r.createElement(
                              'button',
                              {
                                type: 'button',
                                className: 'mode-btn '.concat(
                                  'preview' === this.props.editorViewMode
                                    ? 'active'
                                    : ''
                                ),
                                onClick: () =>
                                  this.props.setViewMode('preview'),
                                title: 'Preview (read-only)',
                              },
                              '👁'
                            )
                        ),
                      t &&
                        r.createElement(
                          'div',
                          { className: 'note-toolbar__button' },
                          r.createElement(Ie, null)
                        ),
                      r.createElement(
                        'div',
                        { className: 'note-toolbar__button' },
                        r.createElement(ve.A, {
                          icon: r.createElement(_e, null),
                          onClick: o,
                          title: 'Actions',
                        })
                      )
                    )
                  )
                : r.createElement('div', {
                    className: 'note-toolbar-placeholder',
                  });
            }),
            (0, o.A)(this, 'renderTrashed', () =>
              r.createElement(
                'div',
                { className: 'note-toolbar-trashed' },
                r.createElement(
                  'div',
                  { className: 'note-toolbar__column-left' },
                  r.createElement(ve.A, {
                    icon: r.createElement(we, null),
                    onClick: this.props.toggleNoteList,
                    title: 'Back • '.concat(Ee.Vh, '+Shift+L'),
                  })
                ),
                r.createElement(
                  'div',
                  { className: 'note-toolbar__column-right' },
                  r.createElement(
                    'div',
                    { className: 'note-toolbar__button' },
                    r.createElement(
                      'button',
                      {
                        type: 'button',
                        className: 'button button-compact button-danger',
                        onClick: this.props.deleteNoteForever,
                      },
                      'Delete Forever'
                    )
                  ),
                  r.createElement(
                    'div',
                    { className: 'note-toolbar__button' },
                    r.createElement(
                      'button',
                      {
                        type: 'button',
                        className: 'button button-primary button-compact',
                        onClick: this.props.restoreNote,
                      },
                      'Restore Note'
                    )
                  )
                )
              )
            );
        }
        render() {
          var { 'aria-hidden': e, note: t } = this.props;
          return r.createElement(
            'div',
            { 'aria-hidden': e, className: 'note-toolbar-wrapper' },
            null != t && t.deleted ? this.renderTrashed() : this.renderNormal()
          );
        }
      }
      (0, o.A)(Re, 'displayName', 'NoteToolbar');
      var ke = {
        deleteNoteForever: g.A.ui.deleteOpenNoteForever,
        newNote: g.A.ui.createNote,
        restoreNote: g.A.ui.restoreOpenNote,
        toggleEditMode: g.A.ui.toggleEditMode,
        toggleFocusMode: g.A.settings.toggleFocusMode,
        toggleNoteActions: g.A.ui.toggleNoteActions,
        toggleNoteList: g.A.ui.toggleNoteList,
        setViewMode: (e) => ({ type: 'SET_EDITOR_VIEW_MODE', mode: e }),
      };
      const De = (0, s.Ng)((e) => {
        var t,
          {
            data: n,
            settings: a,
            ui: { editMode: r, editorViewMode: o, openedNote: s },
          } = e,
          i = s && null !== (t = n.notes.get(s)) && void 0 !== t ? t : null;
        return {
          editMode: r,
          editorViewMode: o,
          markdownEnabled:
            (null == i ? void 0 : i.systemTags.includes('markdown')) || !1,
          note: i,
          showPreviewButton: !!a.showPreviewButton,
        };
      }, ke)(Re);
      var Le = n(18898);
      function Me() {
        return r.createElement(
          'svg',
          {
            className: 'icon-help-small',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 16 16',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '16',
            height: '16',
          }),
          r.createElement('path', {
            d: 'M8 0C3.582 0 0 3.582 0 8s3.582 8 8 8 8-3.582 8-8S12.418 0 8 0zM8 13c-0.552 0-1-0.448-1-1 0-0.552 0.448-1 1-1s1 0.448 1 1C9 12.552 8.552 13 8 13zM9 8.816V9v1H7V9 8c0-0.552 0.448-1 1-1s1-0.448 1-1c0-0.552-0.448-1-1-1S7 5.448 7 6H5c0-1.657 1.343-3 3-3s3 1.343 3 3C11 7.304 10.163 8.403 9 8.816z',
          })
        );
      }
      const xe = (e) => {
        var {
          'aria-valuetext': t,
          disabled: n,
          min: a,
          max: o,
          value: s,
          onChange: i,
        } = e;
        return r.createElement('input', {
          'aria-valuetext': t,
          'aria-label': 'Select revision',
          className: 'slider',
          disabled: n,
          type: 'range',
          min: a,
          max: o,
          value: s,
          onChange: i,
        });
      };
      class Pe extends r.Component {
        constructor() {
          super(...arguments),
            (0, o.A)(this, 'onAcceptRevision', () => {
              var { noteId: e, revision: t, restoreRevision: n } = this.props;
              t && n(e, t);
            }),
            (0, o.A)(this, 'onSelectRevision', (e) => {
              var {
                  target: { value: t },
                } = e,
                { revisions: n } = this.props,
                a = parseInt(t, 10),
                r = [...n.keys()][a];
              this.props.openRevision(this.props.noteId, r);
            }),
            (0, o.A)(this, 'onCancelRevision', () => {
              this.props.cancelRevision();
            });
        }
        render() {
          var {
            isViewingRevisions: e,
            note: t,
            openedRevision: n,
            revisions: a,
            restoreDeletedTags: o,
            toggleRestoringDeletedTags: s,
          } = this.props;
          if (!e) return null;
          var i = a && n ? [...a.keys()].indexOf(n) : -1,
            l = !n || (n && i === (null == a ? void 0 : a.size) - 1),
            c = Number(
              (100 * ((-1 === i ? (null == a ? void 0 : a.size) - 1 : i) - 1)) /
                ((null == a ? void 0 : a.size) - 2)
            ),
            u = 'calc('.concat(c, '% + (').concat(8 - 0.15 * c, 'px))'),
            d = (0, Le.GP)(
              1e3 * (n ? a.get(n).modificationDate : t.modificationDate),
              'MMM d, yyyy h:mm a'
            ),
            m = _()('revision-selector', { 'is-visible': e });
          return r.createElement(
            S(),
            {
              focusTrapOptions: {
                clickOutsideDeactivates: !0,
                fallbackFocus: 'body',
                onDeactivate: this.onCancelRevision,
              },
            },
            r.createElement(
              'div',
              {
                className: m,
                role: 'dialog',
                'aria-labelledby': 'revision-slider-title',
              },
              r.createElement(
                'div',
                { className: 'revision-selector-inner' },
                r.createElement(
                  'div',
                  {
                    id: 'revision-slider-title',
                    className: 'revision-slider-title',
                  },
                  'History'
                ),
                r.createElement(
                  'div',
                  {
                    'aria-hidden': !0,
                    className: 'revision-date',
                    style: { left: u },
                  },
                  d
                ),
                r.createElement(
                  'div',
                  { className: 'revision-slider' },
                  r.createElement(xe, {
                    'aria-valuetext': 'Revision from '.concat(d),
                    disabled: !a || 0 === a.size,
                    min: 1,
                    max: (null == a ? void 0 : a.size) - 1,
                    value: i > -1 ? i : (null == a ? void 0 : a.size) - 1,
                    onChange: this.onSelectRevision,
                  })
                ),
                r.createElement(
                  'section',
                  { className: 'revision-actions' },
                  r.createElement(
                    'label',
                    {
                      className: 'revision-deleted-tags-label',
                      htmlFor: 'revision-deleted-tags-checkbox',
                    },
                    r.createElement(P, {
                      id: 'revision-deleted-tags-checkbox',
                      checked: o,
                      isStandard: !0,
                      onChange: s,
                    }),
                    r.createElement(
                      'span',
                      { className: 'revision-deleted-tags-text' },
                      'Restore deleted tags'
                    ),
                    r.createElement(
                      'span',
                      null,
                      r.createElement(ve.A, {
                        icon: r.createElement(Me, null),
                        title:
                          'Any deleted tags associated with the restored version of this note will be re-added to your list of tags.',
                      })
                    )
                  ),
                  r.createElement(
                    'div',
                    { className: 'revision-buttons' },
                    r.createElement(
                      'button',
                      {
                        className: 'button button-secondary button-compact',
                        onClick: this.onCancelRevision,
                      },
                      'Cancel'
                    ),
                    r.createElement(
                      'button',
                      {
                        'aria-label': 'Restore revision from '.concat(d),
                        disabled: !!l,
                        className: 'button button-primary button-compact',
                        onClick: this.onAcceptRevision,
                      },
                      'Restore'
                    )
                  )
                )
              )
            )
          );
        }
      }
      var Ge = {
        openRevision: (e, t) => ({
          type: 'OPEN_REVISION',
          noteId: e,
          version: t,
        }),
        cancelRevision: () => ({ type: 'CLOSE_REVISION' }),
        restoreRevision: (e, t) => ({
          type: 'RESTORE_NOTE_REVISION',
          noteId: e,
          note: t,
        }),
        toggleRestoringDeletedTags: g.A.ui.toggleRestoringDeletedTags,
      };
      const He = (0, s.Ng)((e) => {
        var t,
          n,
          a,
          r,
          o,
          s = e.ui.openedNote,
          i =
            (null === (t = e.ui.openedRevision) || void 0 === t
              ? void 0
              : t[0]) === e.ui.openedNote &&
            null !==
              (n =
                null === (a = e.ui.openedRevision) || void 0 === a
                  ? void 0
                  : a[1]) &&
            void 0 !== n
              ? n
              : null,
          l = e.ui.restoreDeletedTags;
        return {
          isViewingRevisions: e.ui.showRevisions,
          noteId: s,
          note: null !== (r = e.data.notes.get(s)) && void 0 !== r ? r : null,
          openedRevision: i,
          revision: s && i ? (0, f.qB)(e, s, i, l) : null,
          revisions:
            null !== (o = e.data.noteRevisions.get(s)) && void 0 !== o
              ? o
              : null,
          restoreDeletedTags: l,
        };
      }, Ge)(Pe);
      function Ve() {
        return r.createElement(
          'svg',
          {
            className: 'icon-search-small',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 16 16',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '16',
            height: '16',
          }),
          r.createElement('path', {
            d: 'M6.54 12c-3.037 0.022-5.518-2.423-5.54-5.46s2.423-5.518 5.46-5.54S11.978 3.423 12 6.46c0 0.027 0 0.053 0 0.08C11.978 9.546 9.546 11.978 6.54 12zM6.54 3C4.607 2.978 3.022 4.527 3 6.46 2.978 8.393 4.528 9.978 6.46 10 8.393 10.022 9.978 8.473 10 6.54c0.022-1.933-1.527-3.518-3.46-3.54C6.54 3 6.54 3 6.54 3zM10.939 12.349l1.414-1.414 2.616 2.616 -1.414 1.414L10.939 12.349z',
          })
        );
      }
      var Fe = new Set();
      const Ue = () => (e) => (t) => {
        var n = e(t);
        switch (t.type) {
          case 'SEARCH':
            Fe.forEach((e) => e());
            break;
          case 'FOCUS_SEARCH_FIELD':
            Fe.forEach((e) => e('select'));
        }
        return n;
      };
      class je extends r.Component {
        constructor() {
          var e;
          super(...arguments),
            (e = this),
            (0, o.A)(this, 'inputField', (0, r.createRef)()),
            (0, o.A)(this, 'blur', () => {
              this.inputField.current && this.inputField.current.blur();
            }),
            (0, o.A)(this, 'focus', function () {
              var t =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : 'focus-only';
              e.inputField.current &&
                ('select' === t && e.inputField.current.select(),
                e.inputField.current.focus());
            }),
            (0, o.A)(this, 'interceptEsc', (e) => {
              27 === e.keyCode &&
                ('' === this.props.searchQuery && this.blur(),
                this.clearQuery());
            }),
            (0, o.A)(this, 'update', (e) => {
              var {
                currentTarget: { value: t },
              } = e;
              this.props.onSearch(t);
            }),
            (0, o.A)(this, 'clearQuery', () => this.props.onSearch(''));
        }
        componentDidMount() {
          var e;
          (e = this.focus), Fe.add(e);
        }
        render() {
          var { openedTag: e, searchQuery: t } = this.props,
            n = t.length > 0;
          return r.createElement(
            'div',
            { className: 'search-field' },
            r.createElement(
              'button',
              {
                'aria-label': 'Focus search field',
                onClick: this.props.focusSearchField,
                className: 'icon-button',
              },
              r.createElement(Ve, null)
            ),
            r.createElement('input', {
              ref: this.inputField,
              type: 'search',
              placeholder: 'Search all notes and tags',
              onChange: this.update,
              onKeyUp: this.interceptEsc,
              value: t,
              spellCheck: !1,
            }),
            n &&
              r.createElement(
                'button',
                {
                  'aria-label': 'Clear search',
                  className: 'icon-button',
                  onClick: this.clearQuery,
                },
                r.createElement(u.A, null)
              )
          );
        }
      }
      (0, o.A)(je, 'displayName', 'SearchField');
      const Be = (0, s.Ng)(
        (e) => ({ openedTag: f.Q5(e), searchQuery: e.ui.searchQuery }),
        (e) => ({
          focusSearchField: () => e((0, ne.focusSearchField)()),
          onSearch: (t) => {
            e((0, ne.search)(t));
          },
        })
      )(je);
      var We = n(38711),
        ze = n(94541),
        qe = n(70103);
      class Ye extends r.Component {
        render() {
          var { note: e, noteId: t, tags: n, 'aria-hidden': a } = this.props;
          return r.createElement(
            'div',
            { 'aria-hidden': a, className: 'note-revisions' },
            r.createElement(ze.default, { noteId: t, note: e }),
            r.createElement(
              'div',
              { className: 'note-revisions-tag-list' },
              n.map((e) => {
                var { name: t, deleted: n } = e;
                return r.createElement(qe.A, {
                  key: t,
                  tagName: t,
                  interactive: !1,
                  deleted: n,
                });
              })
            )
          );
        }
      }
      (0, o.A)(Ye, 'displayName', 'NoteRevisions');
      const Qe = (0, s.Ng)((e, t) => {
        var n,
          a,
          r = null !== (n = t.noteId) && void 0 !== n ? n : e.ui.openedNote,
          o = null !== (a = t.note) && void 0 !== a ? a : e.data.notes.get(r),
          s = e.ui.restoreDeletedTags;
        return {
          tags: (0, f.g7)(e, o)
            .map((t) => {
              var n = (0, J.YG)(t);
              return { name: t, deleted: !e.data.tags.has(n) };
            })
            .filter((e) => s || !e.deleted),
          noteId: r,
          note: o,
        };
      })(Ye);
      var Ke = n(58254);
      const Ze = (e) => {
        var { children: t, delay: n = 1e3 } = e,
          [a, o] = (0, r.useState)(!1);
        return (
          (0, r.useEffect)(() => {
            var e = window.setTimeout(() => {
              o(!0);
            }, n);
            return () => window.clearTimeout(e);
          }, []),
          r.createElement(
            Ke.A,
            {
              classNames: 'transition-delay-enter',
              in: a,
              mountOnEnter: !0,
              timeout: 200,
              unmountOnExit: !0,
            },
            t
          )
        );
      };
      var Xe = '1txt_sidebar_width',
        Je = 380,
        $e = () => {
          if ('undefined' == typeof localStorage) return Je;
          var e = localStorage.getItem(Xe),
            t = e ? parseInt(e, 10) : NaN;
          return Number.isFinite(t) ? Math.min(Math.max(t, 220), 720) : Je;
        },
        et = r.lazy(() =>
          Promise.all([n.e(5122), n.e(5368)]).then(n.bind(n, 61716))
        ),
        tt = r.lazy(() =>
          Promise.all([n.e(2215), n.e(9403)]).then(n.bind(n, 16760))
        );
      class nt extends r.Component {
        constructor() {
          super(...arguments),
            (0, o.A)(this, 'state', { sidebarWidth: $e(), isResizing: !1 }),
            (0, o.A)(this, 'handleResizeStart', (e) => {
              e.preventDefault(),
                this.setState({ isResizing: !0 }),
                (document.body.style.cursor = 'col-resize'),
                (document.body.style.userSelect = 'none'),
                window.addEventListener('mousemove', this.handleResizeMove),
                window.addEventListener('mouseup', this.handleResizeEnd);
            }),
            (0, o.A)(this, 'handleResizeMove', (e) => {
              var t = Math.min(Math.max(e.clientX, 220), 720);
              this.setState({ sidebarWidth: t });
            }),
            (0, o.A)(this, 'handleResizeEnd', () => {
              window.removeEventListener('mousemove', this.handleResizeMove),
                window.removeEventListener('mouseup', this.handleResizeEnd),
                (document.body.style.cursor = ''),
                (document.body.style.userSelect = ''),
                this.setState({ isResizing: !1 });
              try {
                localStorage.setItem(
                  Xe,
                  String(Math.round(this.state.sidebarWidth))
                );
              } catch (e) {}
            }),
            (0, o.A)(this, 'handleResizeDoubleClick', () => {
              this.setState({ sidebarWidth: Je });
              try {
                localStorage.setItem(Xe, String(Je));
              } catch (e) {}
            }),
            (0, o.A)(this, 'openKeybindingsHelp', (e) => {
              if (this.props.keyboardShortcuts) {
                var {
                    hideKeyboardShortcuts: t,
                    keyboardShortcutsAreOpen: n,
                    showKeyboardShortcuts: a,
                  } = this.props,
                  { ctrlKey: r, metaKey: o } = e,
                  s = e.key.toLowerCase();
                (r || o) &&
                  '/' === s &&
                  (n ? t() : a(), e.stopPropagation(), e.preventDefault());
              }
            }),
            (0, o.A)(this, 'render', () => {
              var {
                  showNoteList: e,
                  hasRevisions: t,
                  isFocusMode: n = !1,
                  isNavigationOpen: a,
                  isNoteInfoOpen: o,
                  isNoteOpen: s,
                  isSmallScreen: i,
                  openedNote: l,
                  openedRevision: c,
                  showRevisions: u,
                } = this.props,
                d = _()('app-layout', {
                  'is-focus-mode': n,
                  'is-navigation-open': a,
                  'is-note-open': s,
                  'is-showing-note-info': o,
                  'is-resizing-source-column': this.state.isResizing,
                }),
                m = !(e && i),
                p =
                  i || n
                    ? void 0
                    : { width: ''.concat(this.state.sidebarWidth, 'px') },
                h = !i && !n,
                g = r.createElement(
                  Ze,
                  { delay: 1e3 },
                  r.createElement(
                    'div',
                    { className: 'app-layout__placeholder' },
                    r.createElement(We.A, null)
                  )
                ),
                v = !!u || void 0;
              return r.createElement(
                'div',
                { className: d, 'aria-hidden': !!a || void 0 },
                r.createElement(
                  r.Suspense,
                  { fallback: g },
                  r.createElement(
                    'aside',
                    {
                      'aria-hidden': v,
                      'aria-label': 'Notes list',
                      className: 'app-layout__source-column',
                      style: p,
                    },
                    r.createElement(Te, null),
                    r.createElement(Be, null),
                    r.createElement(et, null)
                  ),
                  h &&
                    r.createElement('div', {
                      className: 'app-layout__resize-handle',
                      role: 'separator',
                      'aria-orientation': 'vertical',
                      'aria-label': 'Resize notes list',
                      onMouseDown: this.handleResizeStart,
                      onDoubleClick: this.handleResizeDoubleClick,
                    }),
                  m &&
                    r.createElement(
                      'main',
                      {
                        'aria-label': 'Note editor',
                        className: 'app-layout__note-column',
                      },
                      r.createElement(De, { 'aria-hidden': v }),
                      u
                        ? r.createElement(Qe, {
                            'aria-hidden': v,
                            noteId: l,
                            note: c,
                          })
                        : r.createElement(tt, null),
                      t && r.createElement(He, null)
                    )
                )
              );
            });
        }
        componentDidMount() {
          window.addEventListener('keydown', this.openKeybindingsHelp, !1);
        }
        componentWillUnmount() {
          window.removeEventListener('keydown', this.openKeybindingsHelp, !1),
            window.removeEventListener('mousemove', this.handleResizeMove),
            window.removeEventListener('mouseup', this.handleResizeEnd);
        }
      }
      var at = {
        hideKeyboardShortcuts: () => g.A.ui.closeDialog('KEYBINDINGS'),
        showKeyboardShortcuts: () => g.A.ui.showDialog('KEYBINDINGS'),
      };
      const rt = (0, s.Ng)((e) => {
        var t, n, a, r;
        return {
          hasRevisions:
            e.ui.showRevisions && e.data.noteRevisions.has(e.ui.openedNote),
          keyboardShortcutsAreOpen: f.R_(e, 'KEYBINDINGS'),
          keyboardShortcuts: e.settings.keyboardShortcuts,
          isFocusMode: e.settings.focusModeEnabled,
          isNavigationOpen: e.ui.showNavigation,
          isNoteInfoOpen: e.ui.showNoteInfo,
          isNoteOpen: !e.ui.showNoteList,
          isSmallScreen: f.Qv(e),
          openedRevision:
            (null === (t = e.ui.openedRevision) || void 0 === t
              ? void 0
              : t[0]) === e.ui.openedNote &&
            null !==
              (n =
                null === (a = e.data.noteRevisions.get(e.ui.openedNote)) ||
                void 0 === a
                  ? void 0
                  : a.get(
                      null === (r = e.ui.openedRevision) || void 0 === r
                        ? void 0
                        : r[1]
                    )) &&
            void 0 !== n
              ? n
              : null,
          openedNote: e.ui.openedNote,
          showNoteList: e.ui.showNoteList,
          showRevisions: e.ui.showRevisions,
        };
      }, at)(nt);
      var ot = n(60500),
        st = n(43767),
        it = n(84593),
        lt = n(79709);
      class ct extends r.Component {
        render() {
          var { closeDialog: e } = this.props;
          return r.createElement(
            'div',
            { className: 'about' },
            r.createElement(
              lt.A,
              { hideTitleBar: !0, onDone: e, title: 'Beta Release' },
              r.createElement(
                'div',
                { className: 'about-top' },
                r.createElement(st.A, null),
                r.createElement('h1', null, '1TXT')
              ),
              r.createElement(
                'p',
                { style: { textAlign: 'center' } },
                'This is a beta release of 1TXT.'
              ),
              r.createElement(
                'p',
                { style: { textAlign: 'center' } },
                'Sync, account and migration paths may still change between releases. Please keep regular backups of important notes.'
              ),
              r.createElement(
                'p',
                { style: { textAlign: 'center' } },
                'Bugs & feedback welcome on',
                ' ',
                r.createElement(
                  'a',
                  {
                    href: 'https://github.com/airdropdogs/1txt/issues',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  },
                  'GitHub Issues'
                ),
                '.'
              ),
              r.createElement(
                'button',
                {
                  type: 'button',
                  'aria-label': 'Close dialog',
                  className: 'about-done button',
                  onClick: e,
                },
                r.createElement(it.A, null)
              )
            )
          );
        }
      }
      var ut = { closeDialog: ne.closeDialog };
      const dt = (0, s.Ng)(null, ut)(ct);
      function mt() {
        return r.createElement(
          'svg',
          {
            className: 'icon-attention',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 16 16',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '16',
            height: '16',
          }),
          r.createElement('path', {
            d: 'M14.72 11.75 9.3 2.28a1.49 1.49 0 0 0-2.6 0L1.28 11.75A1.51 1.51 0 0 0 2.59 14H13.41A1.51 1.51 0 0 0 14.72 11.75ZM8 13a1 1 0 1 1 1-1A1 1 0 0 1 8 13ZM9 9A1 1 0 0 1 7 9V5A1 1 0 0 1 9 5Z',
          })
        );
      }
      var pt = (e) => {
          var t = [];
          return (
            e.data.notes.forEach((n, a) => {
              var r,
                o =
                  null === (r = e.simperium.ghosts[1].get('note')) ||
                  void 0 === r
                    ? void 0
                    : r.get(a);
              (o && (0, f.Yt)(n, o.data)) || t.push(a);
            }),
            t
          );
        },
        ht = n(22249),
        gt = n.n(ht);
      const vt = (e) => e.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
      var Et = n(61132),
        ft = n.n(Et);
      function yt(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function Nt(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? yt(Object(n), !0).forEach(function (t) {
                (0, o.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : yt(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t)
                  );
                });
        }
        return e;
      }
      var bt = (e) =>
          Nt(
            Nt({}, e),
            {},
            {
              fileName: e.content
                .split('\n')
                .map((e) => e.trim())
                .map(ft())
                .filter(A.identity)
                .concat('untitled')
                .shift()
                .slice(0, 40),
            }
          ),
        Tt = (e) => {
          if (!e.tags) return e;
          var t = e.tags
            .reduce(
              (e, t) => {
                var [n, a] = e;
                return a.length + t.length > 75
                  ? [[...n, a], t]
                  : [n, ''.concat(a, ', ').concat(t)];
              },
              [[], '']
            )
            .reduce((e, t) => [...e, t])
            .map((e) => e.replace(/^, /, ''));
          return Nt(
            Nt({}, e),
            {},
            {
              content: ''
                .concat(e.content, '\n\nTags:\n  ')
                .concat(t.join('\n  ')),
            }
          );
        },
        wt = (e, t) => {
          var n,
            [a, r] = e,
            o = null !== (n = r.get(t.fileName)) && void 0 !== n ? n : 0;
          r.set(t.fileName, o + 1);
          var s =
            o > 0 ? ''.concat(t.fileName, ' (').concat(o, ')') : t.fileName;
          return [[...a, Nt(Nt({}, t), {}, { fileName: s })], r];
        };
      const _t = (e) =>
          n
            .e(211)
            .then(n.t.bind(n, 22658, 23))
            .then((t) => {
              var { default: n } = t,
                a = new n();
              return (
                a.file('source/notes.json', vt(JSON.stringify(e, null, 2))),
                e.activeNotes
                  .map(Tt)
                  .map(bt)
                  .reduce(wt, [[], new Map()])
                  .shift()
                  .forEach((e) => {
                    var { content: t, fileName: n, lastModified: r } = e;
                    a.file(''.concat(n, '.txt'), t, { date: new Date(r) });
                  }),
                e.trashedNotes
                  .map(Tt)
                  .map(bt)
                  .reduce(wt, [[], new Map()])
                  .shift()
                  .forEach((e) => {
                    var { content: t, fileName: n, lastModified: r } = e;
                    a.file('trash/'.concat(n, '.txt'), t, {
                      date: new Date(r),
                    });
                  }),
                a
              );
            })
            .catch(console.log),
        Ot = (e) =>
          ((e) => {
            var t = [],
              n = [];
            return (
              [...e.entries()].forEach((e) => {
                var [a, r] = e,
                  [o, s] = (0, A.partition)(
                    (0, A.sortBy)(r.tags, (e) => e.toLocaleLowerCase()),
                    z.A
                  ),
                  i = Object.assign(
                    {
                      id: a,
                      content: vt(r.content),
                      creationDate: new Date(
                        1e3 * r.creationDate
                      ).toISOString(),
                      lastModified: new Date(
                        1e3 * r.modificationDate
                      ).toISOString(),
                    },
                    r.systemTags.includes('pinned') && { pinned: !0 },
                    r.systemTags.includes('markdown') && { markdown: !0 },
                    s.length && { tags: s },
                    r.systemTags.includes('published') &&
                      (null == r ? void 0 : r.publishURL) && {
                        publicURL: 'http://simp.ly/p/'.concat(r.publishURL),
                      },
                    r.systemTags.includes('shared') &&
                      o.length && { collaboratorEmails: o }
                  );
                r.deleted ? n.push(i) : t.push(i);
              }),
              Promise.resolve({ activeNotes: t, trashedNotes: n })
            );
          })(e)
            .then(_t)
            .then((e) =>
              null == e
                ? void 0
                : e.generateAsync({
                    compression: 'DEFLATE',
                    platform: (0, A.get)(window, 'process.platform', 'DOS'),
                    type: 'blob',
                  })
            )
            .then((e) => gt()(e, 'notes.zip'))
            .catch(console.log);
      class St extends r.Component {
        constructor() {
          super(...arguments),
            (0, o.A)(this, 'exportUnsyncedNotes', () => {
              var { closeDialog: e, notes: t } = this.props;
              Ot(t).then(e);
            });
        }
        render() {
          var {
            description: e,
            unsafeAction: t,
            safeAction: n,
            closeDialog: a,
            action: o,
            notes: s,
          } = this.props;
          return r.createElement(
            'div',
            { className: 'logout__confirmation' },
            r.createElement(
              lt.A,
              { onDone: a, title: 'Unsynchronized Notes' },
              r.createElement(
                'p',
                { className: 'explanation' },
                s.size > 0 ? e : 'All notes have synchronized!'
              ),
              s.size > 0 &&
                r.createElement(
                  r.Fragment,
                  null,
                  r.createElement(
                    'p',
                    { className: 'explanation-secondary' },
                    'Possibly unsynchronized notes'
                  ),
                  r.createElement(
                    'section',
                    { className: 'change-list' },
                    r.createElement(
                      'ul',
                      null,
                      [...s.entries()].map((e) => {
                        var [t, n] = e,
                          { title: a, preview: o } = (0, d.Cb)(n);
                        return r.createElement(
                          'li',
                          { key: t },
                          r.createElement(mt, null),
                          r.createElement(
                            'span',
                            { className: 'note-title' },
                            a
                          )
                        );
                      })
                    )
                  )
                ),
              s.size > 0 &&
                r.createElement(
                  'button',
                  {
                    className: 'export-unsynchronized',
                    onClick: this.exportUnsyncedNotes,
                  },
                  'Export unsynchronized notes'
                ),
              r.createElement(
                'section',
                { className: 'action-button' },
                r.createElement(
                  'button',
                  { className: 'log-out', onClick: o },
                  s.size > 0 ? t : n
                )
              )
            )
          );
        }
      }
      var At = { closeDialog: ne.closeDialog };
      const Ct = (0, s.Ng)((e) => {
        var t = ((e) => ({ notes: pt(e), preferences: [], tags: [] }))(e);
        return { notes: new Map(t.notes.map((t) => [t, e.data.notes.get(t)])) };
      }, At)(St);
      var It = { reallyCloseWindow: g.A.electron.reallyCloseWindow };
      const Rt = (0, s.Ng)(
        null,
        It
      )((e) => {
        var { reallyCloseWindow: t } = e;
        return r.createElement(Ct, {
          description:
            'Closing the app with unsynchronized notes could cause data loss.',
          unsafeAction: 'Close anyway',
          safeAction: 'Safely close app',
          action: t,
        });
      });
      var kt = n(96878);
      function Dt() {
        return r.createElement(
          'svg',
          {
            className: 'icon-cloud',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          r.createElement('path', {
            d: 'M17.5 19H7A5 5 0 0 1 6.92 9 5.58 5.58 0 0 1 12.1 5.5 5.64 5.64 0 0 1 17.59 10a4.5 4.5 0 0 1-0.09 9ZM12.1 7.5a3.59 3.59 0 0 0-3.49 2.74L8.43 11H7a3 3 0 0 0 0 6H17.5a2.5 2.5 0 0 0 0-5H15.72l0-1A3.62 3.62 0 0 0 12.1 7.5Z',
          })
        );
      }
      function Lt() {
        return r.createElement(
          'svg',
          {
            className: 'icon-file-small',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 16 16',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '16',
            height: '16',
          }),
          r.createElement('path', {
            d: 'M9 0H4.001C2.896 0 2 0.896 2 2.001v11.997C2 15.104 2.896 16 4.001 16h7.997C13.104 16 14 15.104 14 13.999V5L9 0zM8 6V1l5 5H8z',
          })
        );
      }
      var Mt = { name: 'simplenote', fileTypes: ['json', 'zip'] },
        xt = { name: 'evernote', fileTypes: ['enex'] },
        Pt = { name: 'text-files', fileTypes: ['txt', 'md'] },
        Gt = [Mt, xt, Pt],
        Ht = (e) => {
          switch (e.substring(e.lastIndexOf('.') + 1, e.length) || e) {
            case 'json':
            case 'zip':
              return Mt;
            case 'enex':
              return xt;
            case 'txt':
            case 'md':
              return Pt;
          }
          throw new Error('No importer found for file '.concat(e));
        },
        Vt = n(64693);
      function Ft(e) {
        var {
            acceptedTypes: t,
            locked: n,
            multiple: a,
            onAccept: o,
            onReset: s,
          } = e,
          [i, l] = (0, r.useState)(),
          [c, u] = (0, r.useState)(new Array()),
          d = (0, r.useCallback)((e, t) => {
            0 === e.length
              ? ((e) => {
                  !a && e.length > 1
                    ? u([...c, 'Choose a single file'])
                    : u([...c, 'File type is incorrect']),
                    l(void 0),
                    s();
                })(t)
              : ((e) => {
                  for (var t = [], n = 0; n < e.length; n++) {
                    var a = e[n];
                    Ht(a.name)
                      ? t.push(a)
                      : u([
                          ...c,
                          'The file type for "'.concat(
                            a.name,
                            '" is not recognized'
                          ),
                        ]);
                  }
                  l(t), o(t);
                })(e);
          }, []),
          {
            getRootProps: m,
            getInputProps: p,
            isDragActive: h,
          } = (0, kt.VB)({ accept: t, disabled: n, multiple: a, onDrop: d }),
          g = () =>
            r.createElement(
              r.Fragment,
              null,
              c.length > 0
                ? r.createElement(Vt.A, null)
                : r.createElement(Dt, null),
              h
                ? 'Drop files here'
                : r.createElement(
                    'div',
                    { className: 'drop-instructions' },
                    'Drag and drop to select files or ',
                    r.createElement('span', null, 'browse'),
                    ' to choose'
                  )
            ),
          v = () => {
            var e = i.map((e) =>
                r.createElement(
                  'li',
                  { key: e.name, title: e.name },
                  r.createElement(Lt, null),
                  r.createElement('span', null, e.name)
                )
              ),
              t = c.map((e) =>
                r.createElement(
                  'li',
                  { key: e },
                  r.createElement(Vt.A, null),
                  e
                )
              );
            return r.createElement(
              r.Fragment,
              null,
              r.createElement(
                'div',
                { className: 'accepted-files-header' },
                i.length > 1 ? 'Import Files' : 'Import File'
              ),
              r.createElement('ul', { className: 'accepted-files' }, e),
              c.length > 0 &&
                r.createElement('ul', { className: 'error-message' }, t)
            );
          };
        return r.createElement(
          'div',
          (0, k.A)({}, m(), {
            className: _()({ 'is-accepted': i }, 'importer-dropzone'),
          }),
          r.createElement('input', p()),
          i ? r.createElement(v, null) : r.createElement(g, null)
        );
      }
      Ft.propTypes = {
        acceptedTypes: Y().string,
        locked: Y().bool.isRequired,
        multiple: Y().bool,
        onAccept: Y().func.isRequired,
        onReset: Y().func.isRequired,
      };
      const Ut = Ft,
        jt = (e) => {
          var { children: t, shouldMount: n, wrapperClassName: a = '' } = e;
          return r.createElement(
            Ke.A,
            {
              in: n,
              classNames: 'transition-fade-in-out',
              mountOnEnter: !0,
              timeout: 200,
              unmountOnExit: !0,
            },
            r.createElement('div', { className: a }, t)
          );
        },
        Bt = (e) => {
          var { children: t, headingLevel: n = 3 } = e;
          return (0, r.createElement)(
            'h'.concat(n),
            { className: 'panel-title' },
            t
          );
        };
      var Wt = ['className', 'onChange'];
      const zt = (e) => {
        var { className: t, onChange: n } = e,
          a = (0, D.A)(e, Wt);
        return r.createElement(
          'span',
          { className: _()('toggle-control', [t]) },
          r.createElement(
            'input',
            (0, k.A)(
              {
                type: 'checkbox',
                onChange: (e) => {
                  var {
                    currentTarget: { checked: t },
                  } = e;
                  return n(t);
                },
              },
              a
            )
          ),
          r.createElement(
            'span',
            { className: 'toggle-control-layers' },
            r.createElement('span', {
              className: 'toggle-control-unchecked-color',
            }),
            r.createElement('span', {
              className: 'toggle-control-checked-color',
            }),
            r.createElement('span', { className: 'toggle-control-knob' })
          )
        );
      };
      var qt = n(50662);
      const Yt = (e) =>
        r.createElement(
          qt.A,
          (0, k.A)(
            { classes: { root: 'progress-bar', bar: 'progress-bar__bar' } },
            e
          )
        );
      class Qt extends r.Component {
        shouldComponentUpdate(e) {
          return !(!this.props.endValue && this.props.isDone === e.isDone);
        }
        render() {
          var { currentValue: e, endValue: t, isDone: n } = this.props,
            a = () =>
              n
                ? r.createElement(Yt, { variant: 'determinate', value: 100 })
                : r.createElement(Yt, null);
          return t
            ? r.createElement(Yt, {
                variant: 'determinate',
                value: (e / t) * 100,
              })
            : r.createElement(a, null);
        }
      }
      (0, o.A)(Qt, 'propTypes', {
        currentValue: Y().number.isRequired,
        endValue: Y().number,
        isDone: Y().bool.isRequired,
      });
      const Kt = Qt;
      var Zt = (e) => {
        var t,
          { currentValue: n, isDone: a } = e,
          o = 1 === n ? 'note' : 'notes';
        return (
          (t = a
            ? 'Done! '.concat(n, ' ').concat(o, ' imported.')
            : n
              ? ''.concat(n, ' ').concat(o, ' imported...')
              : 'Importing...'),
          r.createElement('p', { role: 'status', 'aria-live': 'polite' }, t)
        );
      };
      Zt.propTypes = {
        currentValue: Y().number.isRequired,
        isDone: Y().bool.isRequired,
      };
      const Xt = Zt,
        Jt = (e) => {
          var { currentValue: t = 0, endValue: n = 0, isDone: a } = e;
          return r.createElement(
            'section',
            { className: 'import-progress' },
            r.createElement(Kt, {
              currentValue: t,
              endValue: a ? t : n,
              isDone: a,
            }),
            r.createElement(Xt, { currentValue: t, isDone: a })
          );
        };
      var $t = n(96827);
      class en extends $t.EventEmitter {
        constructor(e, t, r) {
          var s;
          super(),
            (s = this),
            (0, o.A)(this, 'importNotes', (e) => {
              var t = 0;
              if (e) {
                for (var r = 0; r < e.length; r++) {
                  var o = e[r],
                    i = Ht(o.name),
                    l = this.importFiles.get(i.name);
                  l.push(o), this.importFiles.set(i.name, l);
                }
                var c = 0,
                  u = 0,
                  d = (e) => (n, a) => {
                    'complete' === n
                      ? (c++,
                        (t += a),
                        u === c && this.emit('status', 'complete', t),
                        e())
                      : this.emit('status', n, a);
                  };
                this.importFiles.forEach(
                  (function () {
                    var e = (0, a.A)(function* (e, t) {
                      if (e.length > 0)
                        for (
                          var { default: a } = yield ((e) => {
                              switch (e) {
                                case 'simplenote':
                                  return n.e(3727).then(n.bind(n, 88379));
                                case 'evernote':
                                  return n.e(5877).then(n.bind(n, 73374));
                                case 'text-files':
                                  return n.e(9754).then(n.bind(n, 47616));
                              }
                              throw new Error(
                                'Unrecognized importer named '.concat(e)
                              );
                            })(t),
                            r = new a(s.addNote, s.options, s.recordEvent),
                            o = function* (t) {
                              yield new Promise((n) => {
                                u++;
                                var a = d(() => {
                                  r.off('status', a), n(!0);
                                });
                                r.on('status', a), r.importNotes([e[t]]);
                              });
                            },
                            i = 0;
                          i < e.length;
                          i++
                        )
                          yield* o(i);
                    });
                    return function (t, n) {
                      return e.apply(this, arguments);
                    };
                  })()
                );
              } else this.emit('status', 'error', 'No files to import.');
            }),
            (this.addNote = e),
            (this.options = t),
            (this.recordEvent = r),
            (this.importFiles = new Map()),
            Gt.forEach((e) => {
              this.importFiles.set(e.name, []);
            });
        }
      }
      const tn = en;
      class nn extends r.Component {
        constructor() {
          super(...arguments),
            (0, o.A)(this, 'state', {
              errorMessage: void 0,
              finalNoteCount: void 0,
              importedNoteCount: 0,
              isDone: !1,
              setMarkdown: !1,
              shouldShowProgress: !1,
            }),
            (0, o.A)(this, 'initImporter', () => {
              var e = new tn(
                  this.props.importNote,
                  { isMarkdown: this.state.setMarkdown },
                  this.props.recordEvent
                ),
                t = (0, A.throttle)((e) => {
                  this.setState({ importedNoteCount: e });
                }, 20);
              return (
                e.on('status', (e, n) => {
                  switch (e) {
                    case 'progress':
                      t(n);
                      break;
                    case 'complete':
                      this.setState({ finalNoteCount: n, isDone: !0 });
                      break;
                    case 'error':
                      this.setState({
                        errorMessage: n,
                        shouldShowProgress: !1,
                      }),
                        window.setTimeout(() => {
                          this.setState({ isDone: !0 });
                        }, 200);
                  }
                }),
                e
              );
            }),
            (0, o.A)(this, 'startImport', () => {
              this.setState({ shouldShowProgress: !0 }),
                this.props.onStart(),
                this.initImporter().importNotes(this.props.files);
            });
        }
        render() {
          var { endValue: e, locked: t, onClose: n } = this.props,
            {
              errorMessage: a,
              finalNoteCount: o,
              importedNoteCount: s,
              isDone: i,
              setMarkdown: l,
              shouldShowProgress: c,
            } = this.state;
          return r.createElement(
            'div',
            { className: 'source-importer-executor' },
            r.createElement(
              'section',
              { className: 'source-importer-executor__options' },
              r.createElement(Bt, { headingLevel: 3 }, 'Options'),
              r.createElement(
                'label',
                null,
                r.createElement(
                  'div',
                  { className: 'enable-markdown' },
                  'Enable Markdown on all notes'
                ),
                r.createElement(zt, {
                  id: 'source-importer-executor__checkbox',
                  className: 'source-importer-executor__checkbox',
                  onChange: () => this.setState({ setMarkdown: !l }),
                  checked: l,
                  disabled: t,
                })
              )
            ),
            r.createElement(
              jt,
              { shouldMount: Boolean(a) },
              r.createElement(
                'div',
                { role: 'alert', className: 'source-importer-executor__error' },
                a
              )
            ),
            r.createElement(
              jt,
              { shouldMount: c },
              r.createElement(Jt, {
                currentValue: i ? o : s,
                endValue: e,
                isDone: i,
              })
            ),
            r.createElement(
              'div',
              { className: 'source-importer-executor__button' },
              i
                ? r.createElement(
                    'button',
                    {
                      className: 'button button-primary',
                      type: 'button',
                      onClick: n,
                    },
                    'Close'
                  )
                : r.createElement(
                    'button',
                    {
                      className: 'button button-primary',
                      disabled: t,
                      type: 'button',
                      onClick: this.startImport,
                    },
                    'Import'
                  )
            )
          );
        }
      }
      var an = {
        importNote: g.A.data.importNote,
        recordEvent: g.A.analytics.recordEvent,
      };
      const rn = (0, s.Ng)(null, an)(nn);
      class on extends r.Component {
        constructor() {
          super(...arguments),
            (0, o.A)(this, 'state', { acceptedFiles: void 0 });
        }
        render() {
          var {
              buckets: e,
              onClose: t,
              onStart: n,
              locked: a = !1,
            } = this.props,
            { acceptedTypes: o, instructions: s, title: i } = this.props.source,
            { acceptedFiles: l } = this.state,
            c = Boolean(l);
          return r.createElement(
            'div',
            { className: 'source-importer' },
            !c && r.createElement('p', null, i, r.createElement('br', null), s),
            r.createElement(Ut, {
              acceptedTypes: o,
              locked: a,
              multiple: !0,
              onAccept: (e) => this.setState({ acceptedFiles: e }),
              onReset: () => this.setState({ acceptedFiles: void 0 }),
            }),
            r.createElement(
              'div',
              { className: 'dialog-buttons' },
              r.createElement(
                'button',
                {
                  className: 'button disabled button-primary',
                  type: 'button',
                  disabled: !0,
                },
                'Import'
              )
            ),
            r.createElement(
              jt,
              {
                wrapperClassName: 'source-importer__executor-wrapper',
                shouldMount: c,
              },
              r.createElement(rn, {
                buckets: e,
                endValue: c ? l.length : void 0,
                files: l,
                locked: a,
                onClose: t,
                onStart: n,
              })
            )
          );
        }
      }
      (0, o.A)(on, 'propTypes', {
        buckets: Y().object,
        locked: Y().bool,
        onClose: Y().func.isRequired,
        onStart: Y().func.isRequired,
        source: Y().shape({
          acceptedTypes: Y().string,
          instructions: Y().string,
          multiple: Y().bool,
        }),
      });
      const sn = on;
      class ln extends r.Component {
        constructor() {
          super(...arguments), (0, o.A)(this, 'state', { importStarted: !1 });
        }
        render() {
          var { closeDialog: e } = this.props,
            { importStarted: t } = this.state,
            n = {
              acceptedTypes: Ee.b8
                ? '.txt,.md,.json,.zip,.enex'
                : '.txt,.md,.zip,.json',
              title: "Select the notes you'd like to import.",
              instructions: Ee.b8
                ? 'Accepted file formats: Simplenote (JSON, ZIP), Text (TXT, MD) and Evernote (ENEX).'
                : 'Accepted file formats: Simplenote (JSON, ZIP) and Text (TXT, MD).',
              multiple: !0,
            };
          return r.createElement(
            lt.A,
            {
              className: 'import',
              closeBtnLabel: t ? '' : 'Cancel',
              onDone: t ? void 0 : e,
              title: 'Import Notes',
            },
            r.createElement(
              'div',
              { className: 'import__inner' },
              r.createElement(sn, {
                locked: t,
                onClose: e,
                onStart: () => this.setState({ importStarted: !0 }),
                source: n,
              })
            )
          );
        }
      }
      var cn = { closeDialog: ne.closeDialog };
      const un = (0, s.Ng)(null, cn)(ln);
      var dn = (e) => {
        var { keys: t, children: n } = e;
        return r.createElement(
          'div',
          { className: 'keybindings__key-item' },
          r.createElement(
            'div',
            { className: 'keybindings__key-list' },
            t.map((e, t) =>
              r.createElement(
                r.Fragment,
                { key: t },
                t > 0 && ' + ',
                'string' == typeof e
                  ? r.createElement('kbd', { key: e }, e)
                  : r.createElement(
                      r.Fragment,
                      null,
                      r.createElement('kbd', null, e[0]),
                      ' / ',
                      r.createElement('kbd', null, e[1])
                    )
              )
            )
          ),
          ' - ',
          r.createElement(
            'div',
            { className: 'keybindings__key-description' },
            n
          )
        );
      };
      class mn extends r.Component {
        render() {
          var { closeDialog: e } = this.props;
          return r.createElement(
            'div',
            { className: 'keybindings' },
            r.createElement(
              lt.A,
              { onDone: e, title: 'Keyboard Shortcuts' },
              r.createElement(
                'div',
                { className: 'keybindings__sections' },
                r.createElement(
                  'section',
                  null,
                  r.createElement('h1', null, 'View'),
                  r.createElement(
                    'ul',
                    null,
                    r.createElement(
                      'li',
                      null,
                      r.createElement(
                        dn,
                        { keys: [Ee.Vh, '/'] },
                        'Show keyboard shortcuts'
                      )
                    ),
                    r.createElement(
                      'li',
                      null,
                      r.createElement(
                        dn,
                        { keys: [Ee.Vh, 'Shift', 'F'] },
                        'Toggle focus mode'
                      )
                    ),
                    r.createElement(
                      'li',
                      null,
                      r.createElement(
                        dn,
                        { keys: [Ee.Vh, 'Shift', 'S'] },
                        'Focus search field'
                      )
                    ),
                    r.createElement(
                      'li',
                      null,
                      r.createElement(
                        dn,
                        { keys: [Ee.Vh, 'G'] },
                        'Jump to next match in note'
                      )
                    ),
                    r.createElement(
                      'li',
                      null,
                      r.createElement(
                        dn,
                        { keys: [Ee.Vh, 'Shift', 'G'] },
                        'Jump to previous match in note'
                      )
                    ),
                    Ee.b8 &&
                      r.createElement(
                        'li',
                        null,
                        r.createElement(
                          dn,
                          { keys: [Ee.Vh, '+'] },
                          'Increase font size'
                        )
                      ),
                    Ee.b8 &&
                      r.createElement(
                        'li',
                        null,
                        r.createElement(
                          dn,
                          { keys: [Ee.Vh, '-'] },
                          'Decrease font size'
                        )
                      ),
                    Ee.b8 &&
                      r.createElement(
                        'li',
                        null,
                        r.createElement(
                          dn,
                          { keys: [Ee.Vh, '0'] },
                          'Reset font size'
                        )
                      )
                  )
                ),
                r.createElement(
                  'section',
                  null,
                  r.createElement('h1', null, 'Navigation'),
                  r.createElement(
                    'ul',
                    null,
                    Ee.b8 &&
                      r.createElement(
                        'li',
                        null,
                        r.createElement(
                          dn,
                          { keys: [Ee.Vh, ','] },
                          'Open app preferences'
                        )
                      ),
                    Ee.b8 &&
                      r.createElement(
                        'li',
                        null,
                        r.createElement(
                          dn,
                          { keys: [Ee.Vh, 'Shift', 'E'] },
                          'Export all notes'
                        )
                      ),
                    r.createElement(
                      'li',
                      null,
                      r.createElement(
                        dn,
                        { keys: [Ee.Vh, 'Shift', 'U'] },
                        'Toggle tag list'
                      )
                    ),
                    r.createElement(
                      'li',
                      null,
                      r.createElement(
                        dn,
                        { keys: [Ee.Vh, 'Shift', 'K'] },
                        'Open note above current one'
                      )
                    ),
                    r.createElement(
                      'li',
                      null,
                      r.createElement(
                        dn,
                        { keys: [Ee.Vh, 'Shift', 'J'] },
                        'Open note below current one'
                      )
                    ),
                    r.createElement(
                      'li',
                      null,
                      r.createElement(
                        dn,
                        { keys: [Ee.Vh, 'Shift', 'Y'] },
                        'Toggle editing content/tags'
                      )
                    ),
                    r.createElement(
                      'li',
                      null,
                      r.createElement(
                        dn,
                        { keys: [Ee.Vh, 'Shift', 'L'] },
                        'Toggle note list (on narrow screens)'
                      )
                    )
                  )
                ),
                r.createElement(
                  'section',
                  null,
                  r.createElement('h1', null, 'Note Editing'),
                  r.createElement(
                    'ul',
                    null,
                    r.createElement(
                      'li',
                      null,
                      r.createElement(
                        dn,
                        { keys: [Ee.Vh, 'Shift', 'I'] },
                        'Create new note'
                      )
                    ),
                    Ee.b8 &&
                      r.createElement(
                        'li',
                        null,
                        r.createElement(
                          dn,
                          { keys: [Ee.Vh, 'P'] },
                          'Print note'
                        )
                      ),
                    r.createElement(
                      'li',
                      null,
                      r.createElement(
                        dn,
                        { keys: [Ee.Vh, 'Shift', 'P'] },
                        'Toggle Markdown preview'
                      )
                    ),
                    r.createElement(
                      'li',
                      null,
                      r.createElement(
                        dn,
                        { keys: [Ee.Vh, 'Shift', 'C'] },
                        'Insert checklist item'
                      )
                    )
                  )
                )
              )
            )
          );
        }
      }
      var pn = { closeDialog: ne.closeDialog };
      const hn = (0, s.Ng)(null, pn)(mn);
      var gn = { reallyLogOut: g.A.ui.reallyLogOut };
      const vn = (0, s.Ng)(
        null,
        gn
      )((e) => {
        var { reallyLogOut: t } = e;
        return r.createElement(Ct, {
          description: 'Logging out will delete any unsynchronized notes.',
          unsafeAction: 'Log out',
          safeAction: 'Safely log out',
          action: t,
        });
      });
      var En = n(87375);
      class fn extends r.Component {
        render() {
          var { children: e, tabNames: t } = this.props;
          return r.createElement(
            En.tU,
            { selectedTabClassName: 'is-active' },
            r.createElement(
              En.wb,
              { className: 'tab-panels__tab-list' },
              t.map((e, t) =>
                r.createElement(
                  En.oz,
                  { className: 'button button-borderless', key: t },
                  e
                )
              )
            ),
            r.createElement(
              'div',
              { className: 'tab-panels__panel' },
              r.Children.map(e, (e, t) =>
                r.createElement(
                  En.Kp,
                  { key: t },
                  r.createElement('div', { className: 'tab-panels__column' }, e)
                )
              )
            )
          );
        }
      }
      (0, o.A)(fn, 'propTypes', {
        children: Y().node.isRequired,
        className: Y().string,
        tabNames: Y().arrayOf(Y().string).isRequired,
      });
      const yn = fn;
      var Nn = (e) => {
          var t = e / 1048576;
          return t >= 1
            ? ''.concat(t.toFixed(1), ' MiB')
            : e >= 1024
              ? ''.concat((e / 1024).toFixed(0), ' KiB')
              : ''.concat(e, ' B');
        },
        bn = (e) => {
          var { onClose: t } = e;
          return r.createElement(
            'div',
            {
              className: 'quota-indicator__dialog-backdrop',
              role: 'presentation',
              onClick: t,
            },
            r.createElement(
              'div',
              {
                className: 'quota-indicator__dialog',
                role: 'dialog',
                'aria-modal': 'true',
                'aria-labelledby': 'quota-dialog-title',
                onClick: (e) => e.stopPropagation(),
              },
              r.createElement(
                'h3',
                { id: 'quota-dialog-title' },
                'Cloud quota full'
              ),
              r.createElement(
                'p',
                null,
                'You’ve hit the 1 MiB per-user limit on cloud storage. Your recent edits are safe in your local cache and will upload as soon as you free up space.'
              ),
              r.createElement(
                'ul',
                null,
                r.createElement(
                  'li',
                  null,
                  'Delete old or large notes you no longer need.'
                ),
                r.createElement(
                  'li',
                  null,
                  'Empty the Trash to release the bytes.'
                ),
                r.createElement(
                  'li',
                  null,
                  'Live note text counts against the cap; version history is free.'
                )
              ),
              r.createElement(
                'div',
                { className: 'quota-indicator__dialog-buttons' },
                r.createElement(
                  'button',
                  { type: 'button', onClick: t },
                  'Got it'
                )
              )
            )
          );
        };
      const Tn = (0, s.Ng)((e) => ({
        used: e.quota.used,
        total: e.quota.total,
        exceeded: e.quota.exceeded,
      }))((e) => {
        var { used: t, total: n, exceeded: a } = e,
          o = n > 0 ? Math.min(t / n, 1.5) : 0,
          s = Math.min(100 * o, 100),
          i = a || o >= 1 ? 'over' : o >= 0.8 ? 'warn' : 'ok',
          [l, c] = (0, r.useState)(!1),
          u = (0, r.useRef)(!1);
        (0, r.useEffect)(() => {
          a && !u.current && c(!0), !a && u.current && c(!1), (u.current = a);
        }, [a]);
        var d =
          'over' === i
            ? 'Your 1 MiB cloud quota is full. Recent edits stay local until you free up space.'
            : 'warn' === i
              ? "You've used "
                  .concat(Nn(t), ' of your ')
                  .concat(
                    Nn(n),
                    " cloud quota. Live note text only — version history doesn't count."
                  )
              : 'Cloud quota: '
                  .concat(Nn(t), ' of ')
                  .concat(
                    Nn(n),
                    " used. Live note text only — version history doesn't count."
                  );
        return r.createElement(
          r.Fragment,
          null,
          r.createElement(
            'div',
            { className: 'quota-indicator quota-indicator--'.concat(i) },
            r.createElement(
              U.A,
              {
                enterDelay: 200,
                classes: { tooltip: 'icon-button__tooltip' },
                title: d,
              },
              r.createElement(
                'div',
                { className: 'quota-indicator__row' },
                r.createElement(
                  'span',
                  { className: 'quota-indicator__label' },
                  Nn(t),
                  ' / ',
                  Nn(n)
                ),
                r.createElement(
                  'div',
                  { className: 'quota-indicator__bar' },
                  r.createElement('div', {
                    className: 'quota-indicator__bar-fill',
                    style: { width: ''.concat(s, '%') },
                  })
                )
              )
            )
          ),
          l && r.createElement(bn, { onClose: () => c(!1) })
        );
      });
      var wn = { logout: g.A.ui.logout };
      const _n = (0, s.Ng)(
        (e) => ({ accountName: e.settings.accountName }),
        wn
      )((e) => {
        var { accountName: t, logout: n } = e;
        return r.createElement(
          'div',
          { className: 'settings-account' },
          r.createElement(Bt, { headingLevel: 3 }, 'Account'),
          r.createElement(
            'div',
            { className: 'settings-items' },
            r.createElement(
              'div',
              { className: 'settings-item' },
              r.createElement('span', { className: 'settings-account-name' }, t)
            )
          ),
          r.createElement(
            'ul',
            { className: 'dialog-actions' },
            r.createElement('li', null, r.createElement(Tn, null)),
            r.createElement(
              'li',
              null,
              r.createElement(
                'button',
                {
                  type: 'button',
                  className: 'button button-primary',
                  onClick: n,
                },
                'Log Out'
              )
            )
          )
        );
      });
      var On = (e) => {
        var { groupSlug: t, slug: n, isEnabled: a, onChange: o } = e;
        return r.createElement(P, {
          type: 'radio',
          name: t,
          value: n,
          id: 'settings-field-'.concat(t, '-').concat(n),
          checked: a,
          onChange: () => o(n),
        });
      };
      On.propTypes = {
        groupSlug: Y().string,
        slug: Y().string,
        isEnabled: Y().bool.isRequired,
        onChange: Y().func.isRequired,
      };
      const Sn = On;
      var An = () => null,
        Cn = (e) => {
          var {
              title: t,
              slug: n,
              activeSlug: a,
              description: o,
              onChange: s,
              learnMoreURL: i,
              renderer: l,
              children: c,
            } = e,
            u = r.createElement(
              'a',
              {
                href: i,
                onClick: (e) => {
                  e.preventDefault(), (0, me.i)(i);
                },
              },
              'Learn more'
            ),
            d = r.Children.toArray(c).filter((e) => e);
          return r.createElement(
            'div',
            { className: 'settings-group' },
            r.createElement(Bt, { headingLevel: 3 }, t),
            r.createElement(
              'div',
              { className: 'settings-items' },
              d.map((e) => {
                var {
                  props: { slug: o, title: i },
                } = e;
                return r.createElement(
                  'label',
                  {
                    className: 'settings-item',
                    htmlFor: 'settings-field-'.concat(n, '-').concat(o),
                    key: o,
                  },
                  r.createElement(
                    'div',
                    { className: 'settings-item-label' },
                    i
                  ),
                  r.createElement(
                    'div',
                    { className: 'settings-item-control' },
                    l({
                      activeSlug: a,
                      groupTitle: t,
                      groupSlug: n,
                      slug: o,
                      title: i,
                      isEnabled: o === a,
                      onChange: s,
                    })
                  )
                );
              })
            ),
            o && r.createElement('p', null, o, ' ', i && u)
          );
        };
      Cn.propTypes = {
        activeSlug: Y().string,
        children: Y().node,
        description: Y().string,
        learnMoreURL: Y().string,
        onChange: Y().func,
        renderer: Y().func,
        slug: Y().string,
        title: Y().string,
      };
      const In = Cn,
        Rn = (e) => {
          var { groupSlug: t, slug: n, isEnabled: a, onChange: o } = e;
          return r.createElement(zt, {
            name: t,
            value: n,
            id: 'settings-field-'.concat(t, '-').concat(n),
            checked: a,
            onChange: o,
          });
        };
      var kn = [
          { label: 'Name: A-Z', type: 'alphabetical', isReversed: !1 },
          { label: 'Name: Z-A', type: 'alphabetical', isReversed: !0 },
          { label: 'Created: Newest', type: 'creationDate', isReversed: !1 },
          { label: 'Created: Oldest', type: 'creationDate', isReversed: !0 },
          {
            label: 'Modified: Newest',
            type: 'modificationDate',
            isReversed: !1,
          },
          {
            label: 'Modified: Oldest',
            type: 'modificationDate',
            isReversed: !0,
          },
        ],
        Dn = {
          setActiveTheme: g.A.settings.activateTheme,
          setLineLength: g.A.settings.setLineLength,
          setNoteDisplay: g.A.settings.setNoteDisplay,
          setSortType: g.A.settings.setSortType,
          toggleAutoHideMenuBar: g.A.settings.toggleAutoHideMenuBar,
          toggleSortTagsAlpha: g.A.settings.toggleSortTagsAlpha,
        };
      const Ln = (0, s.Ng)((e) => {
        var { settings: t } = e;
        return {
          activeTheme: t.theme,
          autoHideMenuBar: t.autoHideMenuBar,
          lineLength: t.lineLength,
          noteDisplay: t.noteDisplay,
          sortReversed: t.sortReversed,
          sortTagsAlpha: t.sortTagsAlpha,
          sortType: t.sortType,
        };
      }, Dn)((e) =>
        r.createElement(
          r.Fragment,
          null,
          r.createElement(
            In,
            {
              title: 'Note display',
              slug: 'noteDisplay',
              activeSlug: e.noteDisplay,
              onChange: e.setNoteDisplay,
              renderer: Sn,
            },
            r.createElement(An, { title: 'Comfy', slug: 'comfy' }),
            r.createElement(An, { title: 'Condensed', slug: 'condensed' }),
            r.createElement(An, { title: 'Expanded', slug: 'expanded' })
          ),
          r.createElement(
            In,
            {
              title: 'Line length',
              slug: 'lineLength',
              activeSlug: e.lineLength,
              onChange: e.setLineLength,
              renderer: Sn,
            },
            r.createElement(An, { title: 'Narrow', slug: 'narrow' }),
            r.createElement(An, { title: 'Full', slug: 'full' })
          ),
          r.createElement(
            In,
            {
              title: 'Sort by',
              slug: 'sortType',
              activeSlug: e.sortReversed
                ? e.sortType + '-reversed'
                : e.sortType,
              onChange: (t) => {
                var n = t.includes('-reversed'),
                  a = t.split('-');
                e.setSortType(a[0], n);
              },
              renderer: Sn,
            },
            kn.map((e) => {
              var t = e.isReversed ? e.type + '-reversed' : e.type;
              return r.createElement(An, { key: t, title: e.label, slug: t });
            })
          ),
          r.createElement(
            In,
            {
              title: 'Tags',
              slug: 'sortTagsAlpha',
              activeSlug: e.sortTagsAlpha ? 'alpha' : '',
              onChange: e.toggleSortTagsAlpha,
              renderer: Rn,
            },
            r.createElement(An, { title: 'Sort Alphabetically', slug: 'alpha' })
          ),
          r.createElement(
            In,
            {
              title: 'Theme',
              slug: 'theme',
              activeSlug: e.activeTheme,
              onChange: e.setActiveTheme,
              renderer: Sn,
            },
            !Ee.j9 && r.createElement(An, { title: 'System', slug: 'system' }),
            r.createElement(An, { title: 'Light', slug: 'light' }),
            r.createElement(An, { title: 'Dark', slug: 'dark' })
          ),
          Ee.b8 &&
            !Ee.cX &&
            r.createElement(
              In,
              {
                title: 'Menu Bar',
                slug: 'autoHideMenuBar',
                activeSlug: e.autoHideMenuBar ? 'autoHide' : '',
                description:
                  'When set to auto-hide, press the Alt key to toggle.',
                onChange: e.toggleAutoHideMenuBar,
                renderer: Rn,
              },
              r.createElement(An, {
                title: 'Hide Automatically',
                slug: 'autoHide',
              })
            )
        )
      );
      function Mn() {
        return r.createElement(
          'svg',
          {
            className: 'icon-chevron-right-small',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 16 16',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '16',
            height: '16',
          }),
          r.createElement('path', {
            d: 'M6.87 14.49l-1.49-1.33L9.95 8 5.38 2.84l1.49-1.33L12.62 8 6.87 14.49z',
          })
        );
      }
      var xn = (e) => {
        var { items: t, onClickItem: n } = e;
        return r.createElement(
          'ul',
          { className: 'button-group' },
          t.map((e) =>
            r.createElement(
              'li',
              { key: e.slug, className: 'button-group__item' },
              r.createElement(
                'button',
                { type: 'button', onClick: () => n(e) },
                e.name,
                r.createElement(Mn, null)
              )
            )
          )
        );
      };
      xn.propTypes = {
        items: Y().array.isRequired,
        onClickItem: Y().func.isRequired,
      };
      const Pn = xn;
      var Gn = {
        exportNotes: () => g.A.data.exportNotes(),
        requestNotifications: (e) => ({
          type: 'REQUEST_NOTIFICATIONS',
          sendNotifications: e,
        }),
        showImportDialog: () => (0, ne.showDialog)('IMPORT'),
        toggleShortcuts: () => g.A.settings.toggleKeyboardShortcuts(),
      };
      const Hn = (0, s.Ng)((e) => {
        var {
          settings: { keyboardShortcuts: t, sendNotifications: n },
        } = e;
        return { keyboardShortcuts: t, sendNotifications: n };
      }, Gn)((e) => {
        var {
          exportNotes: t,
          keyboardShortcuts: n,
          requestNotifications: a,
          sendNotifications: o,
          showImportDialog: s,
          toggleShortcuts: i,
        } = e;
        return r.createElement(
          r.Fragment,
          null,
          r.createElement(
            'div',
            { className: 'settings-tools' },
            r.createElement(Bt, { headingLevel: 3 }, 'Tools'),
            r.createElement(Pn, {
              items: [
                { name: 'Import Notes', slug: 'import' },
                { name: 'Export Notes', slug: 'export' },
              ],
              onClickItem: (e) => {
                'import' === e.slug ? s() : 'export' === e.slug && t();
              },
            })
          ),
          r.createElement(
            In,
            {
              slug: 'keyboardShortcuts',
              activeSlug: n ? 'keyboardShortcuts' : '',
              onChange: i,
              renderer: Rn,
            },
            r.createElement(An, {
              title: 'Keyboard Shortcuts',
              slug: 'keyboardShortcuts',
            })
          ),
          r.createElement(
            In,
            {
              slug: 'allowNotifications',
              activeSlug: o ? 'allowNotifications' : '',
              onChange: () => a(!o),
              renderer: Rn,
            },
            r.createElement(An, {
              title: 'Notify on remote changes',
              slug: 'allowNotifications',
            })
          )
        );
      });
      var Vn = ['account', 'display', 'tools'];
      const Fn = (0, s.Ng)(null, { closeDialog: ne.closeDialog })((e) => {
        var { closeDialog: t } = e;
        return r.createElement(
          lt.A,
          { className: 'settings', title: 'Settings', onDone: t },
          r.createElement(
            yn,
            { tabNames: Vn },
            r.createElement(_n, null),
            r.createElement(Ln, null),
            r.createElement(Hn, null)
          )
        );
      });
      var Un = n(2848),
        jn = n.n(Un);
      class Bn extends r.Component {
        constructor() {
          super(...arguments),
            (0, o.A)(this, 'onAddCollaborator', (e) => {
              var { noteId: t } = this.props,
                n = this.collaboratorElement.value.trim();
              e.preventDefault(), (this.collaboratorElement.value = '');
              var a = this.props.settings.accountName === n;
              '' === n || a || this.props.addCollaborator(t, n);
            }),
            (0, o.A)(this, 'onRemoveCollaborator', (e) => {
              var { noteId: t } = this.props;
              this.props.removeCollaborator(t, e);
            }),
            (0, o.A)(this, 'collaborators', () => {
              var { note: e } = this.props,
                t = ((null == e ? void 0 : e.tags) || []).filter(z.A);
              return t.reverse(), t;
            }),
            (0, o.A)(this, 'gravatarURL', (e) => {
              var t = new (jn())()
                .update(e.trim().toLowerCase())
                .digest('hex')
                .toLowerCase();
              return 'https://secure.gravatar.com/avatar/'.concat(
                t,
                '.jpg?s=68'
              );
            });
        }
        render() {
          var { closeDialog: e } = this.props;
          return r.createElement(
            lt.A,
            { className: 'settings', title: 'Collaborate', onDone: e },
            r.createElement(
              'div',
              { className: 'tab-panels__panel' },
              r.createElement(
                'div',
                { className: 'tab-panels__column' },
                r.createElement(
                  'div',
                  { className: 'settings-group' },
                  r.createElement(
                    'p',
                    null,
                    "Add an email address of another Simplenote user to share a note. You'll both be able to edit and view the note."
                  ),
                  r.createElement(
                    'div',
                    { className: 'settings-items' },
                    r.createElement(
                      'form',
                      {
                        className: 'settings-item',
                        onSubmit: this.onAddCollaborator,
                      },
                      r.createElement('input', {
                        className: 'settings-item-text-input transparent-input',
                        pattern: '^[^@]+@.+',
                        placeholder: 'email@example.com',
                        ref: (e) => (this.collaboratorElement = e),
                        spellCheck: !1,
                        title: 'Please enter a valid email',
                      }),
                      r.createElement(
                        'div',
                        { className: 'settings-item-control' },
                        r.createElement(
                          'button',
                          {
                            type: 'submit',
                            className: 'button button-borderless',
                          },
                          'Add Email'
                        )
                      )
                    )
                  )
                ),
                r.createElement(
                  'div',
                  { className: 'settings-group' },
                  r.createElement(
                    'div',
                    { className: 'share-collaborators-heading' },
                    r.createElement(Bt, { headingLevel: 3 }, 'Collaborators')
                  ),
                  r.createElement(
                    'ul',
                    { className: 'share-collaborators' },
                    this.collaborators().map((e) =>
                      r.createElement(
                        'li',
                        { key: e, className: 'share-collaborator' },
                        r.createElement(
                          'span',
                          { className: 'share-collaborator-photo' },
                          r.createElement('img', {
                            src: this.gravatarURL(e),
                            width: '34',
                            height: '34',
                          })
                        ),
                        r.createElement(
                          'span',
                          { className: 'share-collaborator-name' },
                          e
                        ),
                        r.createElement(
                          'button',
                          {
                            className:
                              'share-collaborator-remove button button-borderless button-danger',
                            onClick: this.onRemoveCollaborator.bind(this, e),
                          },
                          'Remove'
                        )
                      )
                    )
                  )
                )
              )
            )
          );
        }
      }
      var Wn = {
        addCollaborator: g.A.data.addCollaborator,
        closeDialog: g.A.ui.closeDialog,
        editNote: g.A.data.editNote,
        publishNote: g.A.data.publishNote,
        removeCollaborator: g.A.data.removeCollaborator,
      };
      const zn = (0, s.Ng)((e) => {
        var {
          data: t,
          settings: n,
          ui: { openedNote: a },
        } = e;
        return { settings: n, noteId: a, note: t.notes.get(a) };
      }, Wn)(Bn);
      var qn = {
        trashTag: (e) => ({ type: 'TRASH_TAG', tagName: e }),
        closeDialog: g.A.ui.closeDialog,
      };
      const Yn = (0, s.Ng)(
        null,
        qn
      )((e) => {
        var { closeDialog: t, tagName: n, trashTag: a } = e;
        return r.createElement(
          lt.A,
          {
            className: 'trash-tag-confirmation',
            onDone: t,
            title: 'Delete Tag',
          },
          r.createElement(
            'div',
            { className: 'dialog-inner-content' },
            'Are you sure you want to delete "',
            r.createElement('span', { className: 'tag-name' }, n),
            '"?'
          ),
          r.createElement(
            'div',
            { className: 'dialog-buttons' },
            r.createElement(
              'button',
              {
                autoFocus: !0,
                className: 'button-primary delete-tag',
                onClick: () => a(n),
              },
              'Delete Tag'
            )
          )
        );
      });
      class Qn extends r.Component {
        render() {
          var { theme: e, closeDialog: t, dialogs: n } = this.props;
          return r.createElement(
            r.Fragment,
            null,
            n.map((e) =>
              r.createElement(
                l(),
                {
                  key: e.type,
                  className: 'dialog-renderer__content',
                  contentLabel: e.type,
                  isOpen: !0,
                  onRequestClose: t,
                  overlayClassName: 'dialog-renderer__overlay',
                  portalClassName: 'dialog-renderer__portal',
                  shouldCloseOnOverlayClick: !1,
                },
                'ABOUT' === e.type
                  ? r.createElement(ot.A, { key: 'about', closeDialog: t })
                  : 'BETA-WARNING' === e.type
                    ? r.createElement(dt, { key: 'beta-warning' })
                    : 'CLOSE-WINDOW-CONFIRMATION' === e.type
                      ? r.createElement(Rt, {
                          key: 'close-window-confirmation',
                        })
                      : 'IMPORT' === e.type
                        ? r.createElement(un, { key: 'import' })
                        : 'KEYBINDINGS' === e.type
                          ? r.createElement(hn, { key: 'keybindings' })
                          : 'LOGOUT-CONFIRMATION' === e.type
                            ? r.createElement(vn, {
                                key: 'logout-confirmation',
                              })
                            : 'SETTINGS' === e.type
                              ? r.createElement(Fn, { key: 'settings' })
                              : 'SHARE' === e.type
                                ? r.createElement(zn, { key: 'share' })
                                : 'TRASH-TAG-CONFIRMATION' === e.type
                                  ? r.createElement(Yn, {
                                      key: 'trash-tag-confirmation',
                                      tagName: e.tagName,
                                    })
                                  : null
              )
            )
          );
        }
      }
      (0, o.A)(Qn, 'displayName', 'DialogRenderer');
      var Kn = { closeDialog: ne.closeDialog };
      const Zn = (0, s.Ng)(
        (e) => ({ dialogs: e.ui.dialogs, theme: (0, f.O4)(e) }),
        Kn
      )(Qn);
      function Xn() {
        return r.createElement(
          'svg',
          {
            className: 'icon-mail',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          r.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          r.createElement('path', {
            d: 'M20 4H4C2.9 4 2 4.9 2 6v12C2 19.1 2.9 20 4 20h16C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4zM18.3 6L12 10.8 5.7 6H18.3zM4 6L4 6V6H4zM4 18L4 7.2 12 13.3l8-6L20 18 4 18z',
          })
        );
      }
      var Jn = n(54291),
        $n = { dismiss: () => g.A.ui.dismissEmailVerifyDialog() };
      const ea = (0, s.Ng)(
        (e) => ({
          accountVerification: e.data.accountVerification,
          email: e.settings.accountName,
          theme: f.O4(e),
        }),
        $n
      )((e) => {
        var { accountVerification: t, dismiss: n, email: a, theme: o } = e,
          s = btoa(a || ''),
          i = 'https://app.simplenote.com/account/verify-email/'.concat(s);
        'pending' === t
          ? (0, Jn.yM)('verification_verify_screen_viewed')
          : (0, Jn.yM)('verification_review_screen_viewed');
        var c = r.createElement(
            'div',
            { className: 'email-verification__dismiss' },
            r.createElement(
              'button',
              {
                className: 'icon-button',
                'aria-label': 'Close dialog',
                onClick: n,
              },
              r.createElement(it.A, null)
            )
          ),
          u = r.createElement(
            r.Fragment,
            null,
            c,
            r.createElement('span', null, r.createElement(Vt.A, null)),
            r.createElement('h2', null, 'Review Your Account'),
            r.createElement(
              'p',
              null,
              'You are registered with Simplenote using the email:'
            ),
            r.createElement(
              'p',
              { className: 'email-verification__email' },
              r.createElement('strong', null, a)
            ),
            r.createElement(
              'p',
              null,
              'Improvements to account security may result in account loss if you no longer have access to this email address.'
            ),
            r.createElement(
              'div',
              { className: 'email-verification__button-row button-borderless' },
              r.createElement(
                'a',
                {
                  target: '_blank',
                  rel: 'noreferrer',
                  href: 'https://app.simplenote.com/settings',
                  onClick: () =>
                    (0, Jn.yM)('verification_change_email_button_tapped'),
                },
                r.createElement(
                  'button',
                  { className: 'button button-borderless' },
                  'Change Email'
                )
              ),
              r.createElement(
                'a',
                {
                  target: '_blank',
                  rel: 'noreferrer',
                  href: i,
                  onClick: () =>
                    (0, Jn.yM)('verification_confirm_button_tapped'),
                },
                r.createElement(
                  'button',
                  { className: 'button button-primary' },
                  'Confirm'
                )
              )
            )
          ),
          d = r.createElement(
            r.Fragment,
            null,
            c,
            r.createElement('span', null, r.createElement(Xn, null)),
            r.createElement('h2', null, 'Verify Your Email'),
            r.createElement(
              'p',
              null,
              'We’ve sent a verification email to ',
              r.createElement('strong', null, a),
              '.'
            ),
            r.createElement(
              'p',
              null,
              'Please check your inbox and follow the instructions.'
            ),
            r.createElement(
              'div',
              { className: 'email-verification__button-row' },
              r.createElement(
                'a',
                {
                  target: '_blank',
                  rel: 'noreferrer',
                  href: i,
                  onClick: () =>
                    (0, Jn.yM)('verification_resend_email_button_tapped'),
                },
                r.createElement(
                  'button',
                  { className: 'button button-borderless' },
                  'Resend Email'
                )
              )
            )
          );
        return r.createElement(
          l(),
          {
            key: 'email-verification',
            className: 'email-verification__modal',
            isOpen: !0,
            onRequestClose: n,
            contentLabel: 'Confirm your email',
            overlayClassName: 'email-verification__overlay',
            portalClassName: _()('email-verification__portal'),
          },
          'pending' === t ? d : u
        );
      });
      var ta = {
        dismiss: () => g.A.ui.showAlternateLoginPrompt(!1),
        logout: g.A.ui.logout,
      };
      const na = (0, s.Ng)(
        (e) => ({
          alternateLoginEmail: e.ui.alternateLoginEmail,
          email: e.settings.accountName,
          theme: f.O4(e),
        }),
        ta
      )((e) => {
        var {
            alternateLoginEmail: t,
            dismiss: n,
            email: a,
            logout: o,
            theme: s,
          } = e,
          i = r.createElement(
            'div',
            { className: 'alternate-login__dismiss' },
            r.createElement(
              'button',
              {
                className: 'icon-button',
                'aria-label': 'Close dialog',
                onClick: n,
              },
              r.createElement(it.A, null)
            )
          ),
          c = r.createElement(
            r.Fragment,
            null,
            i,
            r.createElement('span', null, r.createElement(Vt.A, null)),
            r.createElement('h2', null, 'Logout?'),
            r.createElement('p', null, 'You are already logged in as:'),
            r.createElement(
              'p',
              { className: 'alternate-login__email' },
              r.createElement('strong', null, a)
            ),
            r.createElement('p', null, 'You tried logging in with:'),
            r.createElement(
              'p',
              { className: 'alternate-login__email' },
              r.createElement('strong', null, t)
            ),
            r.createElement('p', null, 'Would you like to log out?'),
            r.createElement(
              'div',
              { className: 'alternate-login__button-row button-borderless' },
              r.createElement(
                'a',
                { target: '_blank', rel: 'noreferrer', onClick: n },
                r.createElement(
                  'button',
                  { className: 'button button-borderless' },
                  'Cancel'
                )
              ),
              r.createElement(
                'a',
                { target: '_blank', rel: 'noreferrer', onClick: o },
                r.createElement(
                  'button',
                  { className: 'button button-primary' },
                  'Logout'
                )
              )
            )
          );
        return r.createElement(
          l(),
          {
            key: 'alternate-login',
            className: 'alternate-login__modal',
            isOpen: !0,
            onRequestClose: n,
            contentLabel: 'Log out?',
            overlayClassName: 'alternate-login__overlay',
            portalClassName: _()('alternate-login__portal'),
          },
          c
        );
      });
      var aa = n(69343);
      class ra extends r.Component {
        constructor() {
          super(...arguments),
            (0, o.A)(this, 'handleShortcut', (e) => {
              var { hotkeysEnabled: t } = this.props,
                n = !window.electron;
              if ((n && this.handleBrowserSearchShortcut(e), t)) {
                var { ctrlKey: a, metaKey: r, shiftKey: o } = e,
                  s = e.key.toLowerCase();
                return (a || r) && a !== r && o && 'u' === s
                  ? (this.props.toggleTagList(),
                    e.stopPropagation(),
                    e.preventDefault(),
                    !1)
                  : (('Escape' !== s && 'Esc' !== s) ||
                      !this.props.isSearchActive ||
                      this.props.clearSearch(),
                    n && this.handleBrowserShortcut(e),
                    !0);
              }
            }),
            (0, o.A)(this, 'handleBrowserShortcut', (e) => {
              var { ctrlKey: t, metaKey: n, shiftKey: a } = e,
                r = e.key.toLowerCase(),
                o = (t || n) && t !== n;
              return o && a && 'i' === r
                ? (this.props.createNote(),
                  e.stopPropagation(),
                  e.preventDefault(),
                  !1)
                : o && a && 'f' === r
                  ? (this.props.toggleFocusMode(),
                    e.stopPropagation(),
                    e.preventDefault(),
                    !1)
                  : void 0;
            }),
            (0, o.A)(this, 'handleBrowserSearchShortcut', (e) => {
              var { ctrlKey: t, metaKey: n, shiftKey: a } = e,
                r = e.key.toLowerCase(),
                o = (t || n) && t !== n;
              if ((o && a && 's' === r) || (o && !a && 'f' === r))
                return (
                  this.props.focusSearchField(),
                  e.stopPropagation(),
                  e.preventDefault(),
                  !1
                );
              !o ||
                ('g' !== r && 'f' !== r) ||
                (e.stopPropagation(), e.preventDefault());
            }),
            (0, o.A)(this, 'toggleShortcuts', (e) => {
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
          var e;
          null === (e = window.electron) ||
            void 0 === e ||
            e.send('setAutoHideMenuBar', this.props.autoHideMenuBar),
            (document.body.dataset.theme = this.props.theme),
            this.toggleShortcuts(!0),
            (0, Jn.yM)('application_opened');
        }
        componentDidUpdate() {
          document.body.dataset.theme = this.props.theme;
        }
        componentWillUnmount() {
          this.toggleShortcuts(!1), delete document.body.dataset.theme;
        }
        render() {
          var {
              lineLength: e,
              showAlternateLoginPrompt: t,
              showEmailVerification: n,
              showNavigation: a,
              showNoteActions: o,
              showNoteInfo: s,
              showRevisions: i,
              theme: l,
            } = this.props,
            c = _()('app', {
              'is-line-length-full': 'full' === e,
              'touch-enabled': 'ontouchstart' in document.body,
            }),
            u = _()('simplenote-app', {
              'navigation-open': a,
              'is-electron': Ee.b8,
            });
          return r.createElement(
            'div',
            { className: c },
            n && r.createElement(ea, null),
            t && r.createElement(na, null),
            r.createElement(
              'div',
              { className: u },
              a && r.createElement(ge, null),
              r.createElement(rt, null),
              s && r.createElement(T, null),
              o && r.createElement(F, null)
            ),
            r.createElement(Zn, { appProps: this.props })
          );
        }
      }
      (0, o.A)(ra, 'displayName', 'App');
      const oa = (0, s.Ng)(
        (e) => ({
          autoHideMenuBar: e.settings.autoHideMenuBar,
          hotkeysEnabled: e.settings.keyboardShortcuts,
          isSearchActive: !!e.ui.searchQuery.length,
          isSmallScreen: f.Qv(e),
          lineLength: e.settings.lineLength,
          showAlternateLoginPrompt: e.ui.showAlternateLoginPrompt,
          showEmailVerification: f.AK(e),
          showNavigation: e.ui.showNavigation,
          showNoteActions: e.ui.showNoteActions,
          showNoteInfo: e.ui.showNoteInfo,
          showRevisions: e.ui.showRevisions,
          theme: f.O4(e),
        }),
        (e) => ({
          activateTheme: (t) => e(aa.activateTheme(t)),
          clearSearch: () => e((0, ne.search)('')),
          closeNote: () => e((0, ne.closeNote)()),
          createNote: () => e((0, ne.createNote)()),
          focusSearchField: () => e(g.A.ui.focusSearchField()),
          setLineLength: (t) => e(aa.setLineLength(t)),
          setNoteDisplay: (t) => e(aa.setNoteDisplay(t)),
          setSortType: (t) => e(aa.setSortType(t)),
          toggleAutoHideMenuBar: () => e(aa.toggleAutoHideMenuBar()),
          toggleFocusMode: () => e(aa.toggleFocusMode()),
          toggleSortOrder: () => e(aa.toggleSortOrder()),
          toggleSortTagsAlpha: () => e(aa.toggleSortTagsAlpha()),
          toggleSpellCheck: () => e(aa.toggleSpellCheck()),
          toggleTagList: () => e((0, ne.toggleNavigation)()),
        })
      )(ra);
      var sa = n(6372),
        ia = n(32446),
        la = n(7255),
        ca = n.n(la);
      function ua(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function da(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? ua(Object(n), !0).forEach(function (t) {
                (0, o.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : ua(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t)
                  );
                });
        }
        return e;
      }
      var ma = () =>
          new Promise((e, t) => {
            var n = indexedDB.open('simplenote_v2', 2020065);
            (n.onsuccess = () => e(n.result)),
              (n.onerror = () => t()),
              (n.onupgradeneeded = () => {
                var e = n.result;
                e.objectStoreNames.contains('state') ||
                  e.createObjectStore('state'),
                  e.objectStoreNames.contains('revisions') ||
                    e.createObjectStore('revisions');
              }),
              (n.onblocked = () => t());
          }),
        pa = '1txt_revisions_v3.1_reset',
        ha = (e) =>
          ma()
            .then(
              (function () {
                var e = (0, a.A)(function* (e) {
                  return (
                    yield ((e) =>
                      new Promise((t) => {
                        try {
                          if ('undefined' == typeof localStorage)
                            return void t();
                          if (localStorage.getItem(pa)) return void t();
                          if (!e.objectStoreNames.contains('revisions'))
                            return localStorage.setItem(pa, '1'), void t();
                          var n = e.transaction('revisions', 'readwrite');
                          n.objectStore('revisions').clear(),
                            (n.oncomplete = () => {
                              try {
                                localStorage.setItem(pa, '1');
                              } catch (e) {}
                              t();
                            }),
                            (n.onerror = () => t()),
                            (n.onabort = () => t());
                        } catch (e) {
                          t();
                        }
                      }))(e),
                    e
                  );
                });
                return function (t) {
                  return e.apply(this, arguments);
                };
              })()
            )
            .then(
              (t) =>
                new Promise((n) => {
                  var a = !0,
                    r = t.transaction(['state', 'revisions'], 'readonly');
                  t.onversionchange = () => {
                    (a = !1), n([{}, va]);
                  };
                  var o = r.objectStore('state').get('state');
                  (o.onsuccess = () => {
                    if (a) {
                      var t = o.result;
                      if (t)
                        try {
                          if (null !== e && t.accountName !== e)
                            return void n([{}, va]);
                          var s = new Map(
                              t.noteTags.map((e) => {
                                var [t, n] = e;
                                return [t, new Set(n)];
                              })
                            ),
                            i = new Map(t.notes),
                            l = new Map(t.tags),
                            c = ((e, t, n) => {
                              if (!e || 'object' != typeof e) return null;
                              var a = { type: 'all' },
                                r = e.collection;
                              if (r && 'object' == typeof r)
                                switch (r.type) {
                                  case 'all':
                                  case 'trash':
                                  case 'untagged':
                                    a = { type: r.type };
                                    break;
                                  case 'tag':
                                    var o = r.tagName;
                                    'string' == typeof o &&
                                      n.has((0, J.YG)(o)) &&
                                      (a = { type: 'tag', tagName: o });
                                }
                              var s = null,
                                i = e.openedNote;
                              return (
                                'string' == typeof i && t.has(i) && (s = i),
                                { collection: a, openedNote: s }
                              );
                            })(t.workspace, i, l),
                            u = da(
                              {
                                data: { notes: i, noteTags: s, tags: l },
                                settings: { accountName: t.accountName },
                                simperium: {
                                  ghosts: [new Map(t.cvs), new Map(t.ghosts)],
                                  lastRemoteUpdate: new Map(t.lastRemoteUpdate),
                                  lastSync: new Map(t.lastSync),
                                },
                              },
                              c ? { ui: c } : {}
                            );
                          'preferences' in t
                            ? (u.data.preferences = new Map(t.preferences))
                            : (u.simperium.ghosts[0].delete('preferences'),
                              u.simperium.ghosts[1].delete('preferences'));
                          var d = r.objectStore('revisions').openCursor(),
                            m = new Map();
                          (d.onsuccess = () => {
                            if (a) {
                              var e = d.result;
                              e
                                ? (m.set(e.key, new Map(e.value)), e.continue())
                                : n([
                                    da(
                                      da({}, u),
                                      {},
                                      {
                                        data: da(
                                          da({}, u.data),
                                          {},
                                          { noteRevisions: m }
                                        ),
                                      }
                                    ),
                                    va,
                                  ]);
                            } else n([u, va]);
                          }),
                            (d.onerror = () => n([u, va]));
                        } catch (e) {
                          n([{}, va]);
                        }
                      else n([{}, va]);
                    } else n([{}, va]);
                  }),
                    (o.onerror = () => n([{}, va]));
                })
            )
            .catch(() => [{}, null]),
        ga = (function () {
          var e = (0, a.A)(function* (e, t) {
            var n = (yield ma()).transaction('revisions', 'readwrite'),
              a = n.objectStore('revisions').get(e);
            (a.onsuccess = () => {
              var r,
                o = a.result,
                s =
                  null !== (r = null == o ? void 0 : o.slice()) && void 0 !== r
                    ? r
                    : [],
                i = new Set(
                  s.map((e) => {
                    var [t] = e;
                    return t;
                  })
                );
              t.forEach((e) => {
                var [t, n] = e;
                i.has(t) || (s.push([t, n]), i.add(t));
              }),
                s.sort((e, t) => e[0] - t[0]),
                n.objectStore('revisions').put(s, e);
            }),
              (a.onerror = () => {
                n.objectStore('revisions').put(t, e);
              });
          });
          return function (t, n) {
            return e.apply(this, arguments);
          };
        })(),
        va = (e) => {
          var { dispatch: t, getState: n } = e;
          return (e) => {
            var t = null;
            return (a) => {
              var r = e(a);
              return (
                t && clearTimeout(t),
                (t = setTimeout(
                  () =>
                    ((e) => {
                      var t = Array.from(e.data.notes),
                        n = Array.from(e.data.noteTags).map((e) => {
                          var [t, n] = e;
                          return [t, Array.from(n)];
                        }),
                        a = Array.from(e.data.preferences),
                        r = Array.from(e.data.tags),
                        o = Array.from(e.simperium.ghosts[0]),
                        s = Array.from(e.simperium.ghosts[1]),
                        i = Array.from(e.simperium.lastRemoteUpdate),
                        l = Array.from(e.simperium.lastSync),
                        c = {
                          accountName: e.settings.accountName,
                          notes: t,
                          noteTags: n,
                          preferences: a,
                          tags: r,
                          cvs: o,
                          ghosts: s,
                          lastRemoteUpdate: i,
                          lastSync: l,
                          workspace: {
                            collection: e.ui.collection,
                            openedNote: e.ui.openedNote,
                          },
                        };
                      return ma().then((e) => {
                        e.transaction('state', 'readwrite')
                          .objectStore('state')
                          .put(c, 'state');
                      });
                    })(n()),
                  1e3
                )),
                'LOAD_REVISIONS' === a.type &&
                  a.revisions.length > 0 &&
                  ga(a.noteId, a.revisions),
                r
              );
            };
          };
        },
        Ea = n(95391);
      function fa(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function ya(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? fa(Object(n), !0).forEach(function (t) {
                (0, o.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : fa(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t)
                  );
                });
        }
        return e;
      }
      var Na = (function () {
        var e = (0, a.A)(function* (e) {
          var t,
            {
              noteId: n,
              title: a,
              content: r,
              updatedAt: o,
              publishURL: s,
              shouldPublish: i,
            } = e,
            l =
              'undefined' != typeof window &&
              /^https?:/.test(window.location.origin)
                ? window.location.origin
                : (null === (t = 'https://1txt.xyz')
                    ? void 0
                    : t.replace(/\/$/, '')) || '';
          if (l) {
            var c = ''
                .concat(l, '/api/public-notes')
                .concat(i ? '' : '/'.concat(s)),
              u = (() => {
                if ('undefined' == typeof window) return '';
                var e = localStorage.getItem('stored_user');
                if (e)
                  try {
                    var t = JSON.parse(e);
                    if (null != t && t.accessToken) return t.accessToken;
                  } catch (e) {}
                return localStorage.getItem('access_token') || '';
              })(),
              d = {};
            if ((u && (d.Authorization = 'Bearer '.concat(u)), i)) {
              var m = yield fetch(c, {
                method: 'POST',
                headers: ya(
                  ya({}, d),
                  {},
                  { 'Content-Type': 'application/json' }
                ),
                body: JSON.stringify({
                  id: s,
                  noteId: n,
                  title: a,
                  content: r,
                  updatedAt: o,
                }),
              });
              if (!m.ok) throw new Error(yield m.text());
            } else {
              var p = yield fetch(c, { method: 'DELETE', headers: d });
              if (!p.ok) throw new Error(yield p.text());
            }
          }
        });
        return function (t) {
          return e.apply(this, arguments);
        };
      })();
      const ba = (e) => (t) => (n) => {
        var a = e.getState();
        switch (n.type) {
          case 'CREATE_NOTE':
            var r,
              o,
              s,
              i,
              l,
              c,
              u = (0, Ea.A)(),
              d = a.ui.filteredNotes[0],
              m = d && a.data.notes.get(d),
              p = !m || m.systemTags.includes('markdown'),
              h =
                null !==
                  (r =
                    null === (o = n.note) ||
                    void 0 === o ||
                    null === (o = o.systemTags) ||
                    void 0 === o
                      ? void 0
                      : o.indexOf('markdown')) && void 0 !== r
                  ? r
                  : -1,
              g =
                null !==
                  (s =
                    null === (i = n.note) ||
                    void 0 === i ||
                    null === (i = i.systemTags) ||
                    void 0 === i
                      ? void 0
                      : i.slice()) && void 0 !== s
                  ? s
                  : [];
            p && -1 === h ? g.push('markdown') : !p && h >= 0 && g.splice(h, 1);
            var v = (0, f.Q5)(a),
              E =
                null !==
                  (l =
                    null === (c = n.note) || void 0 === c ? void 0 : c.tags) &&
                void 0 !== l
                  ? l
                  : [],
              y = v ? (0, J.Rd)(E, v) : E;
            return t({
              type: 'CREATE_NOTE_WITH_ID',
              noteId: u,
              note: ya(ya({}, n.note), {}, { systemTags: g, tags: y }),
              meta: { nextNoteToOpen: u },
            });
          case 'DELETE_OPEN_NOTE_FOREVER':
            if (!a.ui.openedNote) return;
            return t({ type: 'DELETE_NOTE_FOREVER', noteId: a.ui.openedNote });
          case 'EMPTY_TRASH':
            var N = t(n);
            return (
              a.data.notes.forEach((t, n) => {
                t.deleted &&
                  e.dispatch({ type: 'DELETE_NOTE_FOREVER', noteId: n });
              }),
              N
            );
          case 'EXPORT_NOTES':
            return Ot(a.data.notes), t(n);
          case 'IMPORT_NOTE':
            return t({
              type: 'IMPORT_NOTE_WITH_ID',
              noteId: (0, Ea.A)(),
              note: n.note,
            });
          case 'RESTORE_OPEN_NOTE':
            if (!a.ui.openedNote) return;
            return t({ type: 'RESTORE_NOTE', noteId: a.ui.openedNote });
          case 'PUBLISH_NOTE':
            if (!a.data.notes.has(n.noteId)) return t(n);
            var b = a.data.notes.get(n.noteId),
              T = n.shouldPublish
                ? n.publishURL || b.publishURL || (0, Ea.A)()
                : '',
              w = n.shouldPublish ? T : n.publishURL || b.publishURL || '',
              _ = t(ya(ya({}, n), {}, { publishURL: T }));
            return (
              w &&
                Na({
                  noteId: n.noteId,
                  title: b.content.split('\n')[0] || 'Untitled',
                  content: b.content,
                  updatedAt: new Date(1e3 * b.modificationDate).toISOString(),
                  publishURL: w,
                  shouldPublish: n.shouldPublish,
                }).catch((t) => {
                  var a, r;
                  console.error('[Publish] Sync failed:', t),
                    'undefined' != typeof window &&
                      (null === (a = (r = window).alert) ||
                        void 0 === a ||
                        a.call(
                          r,
                          n.shouldPublish
                            ? 'Publish failed. Please try again.'
                            : 'Unpublish failed. Please try again.'
                        )),
                    n.shouldPublish &&
                      e.dispatch(
                        ya(ya({}, n), {}, { shouldPublish: !1, publishURL: w })
                      );
                }),
              _
            );
          case 'TRASH_OPEN_NOTE':
            if (!a.ui.openedNote) return;
            return t({ type: 'TRASH_NOTE', noteId: a.ui.openedNote });
          case 'TRASH_TAG':
            return a.data.tags.has((0, J.YG)(n.tagName))
              ? t(ya(ya({}, n), {}, { remainingTags: (0, f.nn)(a) - 1 }))
              : null;
          default:
            return t(n);
        }
      };
      var Ta = n(87989),
        wa = n.n(Ta)()('electron-middleware');
      const _a = (e) => {
        var { dispatch: t, getState: n } = e;
        return (
          window.electron.receive('tokenLogin', (e) => {
            var { searchParams: a } = new URL(e),
              r = a.get('email');
            r !== n().settings.accountName &&
              t(g.A.ui.showAlternateLoginPrompt(r));
          }),
          window.electron.receive('appCommand', (e) => {
            switch (e.action) {
              case 'closeWindow':
                return void t(g.A.ui.closeWindow());
              case 'emptyTrash':
                return void t(g.A.ui.emptyTrash());
              case 'exportNotes':
                return void t(g.A.data.exportNotes());
              case 'logout':
                return void t({ type: 'LOGOUT' });
              case 'printNote':
                return void window.print();
              case 'activateTheme':
                return void t(g.A.settings.activateTheme(e.theme));
              case 'focusSearchField':
                return void t(g.A.ui.focusSearchField());
              case 'showDialog':
                return void t(g.A.ui.showDialog(e.dialog));
              case 'trashNote':
                return void t(g.A.ui.trashOpenNote());
              case 'newNote':
                return void t(g.A.ui.createNote());
              case 'setLineLength':
                return void t(g.A.settings.setLineLength(e.lineLength));
              case 'setNoteDisplay':
                return void t(g.A.settings.setNoteDisplay(e.noteDisplay));
              case 'setSortType':
                return void t(g.A.settings.setSortType(e.sortType));
              case 'toggleFocusMode':
                return void t(g.A.settings.toggleFocusMode());
              case 'toggleSortOrder':
                return void t(g.A.settings.toggleSortOrder());
              case 'toggleSortTagsAlpha':
                return void t(g.A.settings.toggleSortTagsAlpha());
              case 'toggleSpellCheck':
                return void t(g.A.settings.toggleSpellCheck());
              default:
                wa('unknown AppCommand: '.concat(e));
            }
          }),
          window.electron.send('appStateUpdate', {
            settings: n().settings,
            editMode: n().ui.editMode,
          }),
          (e) => (t) => {
            var a = n(),
              r = e(t),
              o = n();
            return 'REALLY_CLOSE_WINDOW' === t.type
              ? (window.electron.send('reallyCloseWindow'), r)
              : ((a.settings === o.settings &&
                  a.ui.editMode === o.ui.editMode) ||
                  window.electron.send('appStateUpdate', {
                    settings: o.settings,
                    editMode: o.ui.editMode,
                  }),
                r);
          }
        );
      };
      var Oa = n(71559);
      function Sa(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function Aa(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Sa(Object(n), !0).forEach(function (t) {
                (0, o.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : Sa(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t)
                  );
                });
        }
        return e;
      }
      const Ca = (e) => (t) => (n) => {
        var a, r, o;
        switch (n.type) {
          case 'SELECT_NOTE_ABOVE':
            var {
              ui: { filteredNotes: s, openedNote: i },
            } = e.getState();
            if (0 === s.length) return;
            if (!i) return t({ type: 'SELECT_NOTE', noteId: s[0] });
            var l = s.findIndex((e) => e === i);
            if (0 === l) return;
            return t({
              type: 'SELECT_NOTE',
              noteId: -1 === l ? s[0] : s[l - 1],
            });
          case 'SELECT_NOTE_BELOW':
            var {
              ui: { filteredNotes: c, openedNote: u },
            } = e.getState();
            if (0 === c.length) return;
            if (!u) return t({ type: 'SELECT_NOTE', noteId: c[0] });
            var d = c.findIndex((e) => e === u);
            if (d === c.length - 1) return;
            return t({
              type: 'SELECT_NOTE',
              noteId: -1 === d ? c[0] : c[d + 1],
            });
          case 'SHOW_ALL_NOTES':
          case 'SHOW_UNTAGGED_NOTES':
          case 'SELECT_TRASH':
            return t(
              Aa(
                Aa({}, n),
                {},
                {
                  meta: Aa(
                    Aa({}, n.meta),
                    {},
                    {
                      nextNoteToOpen:
                        null !==
                          (a =
                            null === (r = n.meta) ||
                            void 0 === r ||
                            null === (r = r.searchResults) ||
                            void 0 === r
                              ? void 0
                              : r.noteIds[0]) && void 0 !== a
                          ? a
                          : null,
                    }
                  ),
                }
              )
            );
          case 'REQUEST_NOTIFICATIONS':
            if (
              n.sendNotifications &&
              'default' ===
                (null === (o = window.Notification) || void 0 === o
                  ? void 0
                  : o.permission)
            ) {
              var m,
                p = () =>
                  e.dispatch({
                    type: 'REQUEST_NOTIFICATIONS',
                    sendNotifications: !0,
                  }),
                h =
                  null === (m = window.Notification) || void 0 === m
                    ? void 0
                    : m.requestPermission(p);
              'function' == typeof h.then && h.then(p);
            }
            return t(n);
          default:
            return t(n);
        }
      };
      var Ia = () =>
          window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light',
        Ra = () => window.innerWidth,
        ka = (0, ia.HY)({
          windowWidth: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : Ra(),
              t = arguments.length > 1 ? arguments[1] : void 0;
            return 'WINDOW_RESIZE' === t.type ? t.innerWidth : e;
          },
          systemTheme: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : Ia(),
              t = arguments.length > 1 ? arguments[1] : void 0;
            return 'SYSTEM_THEME_UPDATE' === t.type ? t.prefers : e;
          },
        }),
        Da = (e) => {
          var { dispatch: t } = e;
          return (
            window.addEventListener('resize', () =>
              t({ type: 'WINDOW_RESIZE', innerWidth: Ra() })
            ),
            window
              .matchMedia('(prefers-color-scheme: dark)')
              .addListener(() =>
                t({ type: 'SYSTEM_THEME_UPDATE', prefers: Ia() })
              ),
            (e) => e
          );
        };
      function La(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function Ma(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? La(Object(n), !0).forEach(function (t) {
                (0, o.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : La(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t)
                  );
                });
        }
        return e;
      }
      var xa = (e) => Ma(Ma({}, e), {}, { modificationDate: Date.now() / 1e3 });
      const Pa = (0, ia.HY)({
        accountVerification: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : 'unknown',
            t = arguments.length > 1 ? arguments[1] : void 0;
          return 'UPDATE_ACCOUNT_VERIFICATION' === t.type && 'dismissed' !== e
            ? t.state
            : e;
        },
        notes: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : new Map(),
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'ADD_COLLABORATOR':
            case 'ADD_NOTE_TAG':
              var n = e.get(t.noteId);
              if (!n) return e;
              var a =
                  'ADD_COLLABORATOR' === t.type
                    ? t.collaboratorAccount
                    : t.tagName,
                r = (0, J.Rd)(n.tags, a);
              return r !== n.tags
                ? new Map(e).set(t.noteId, xa(Ma(Ma({}, n), {}, { tags: r })))
                : e;
            case 'CREATE_NOTE_WITH_ID':
              return new Map(e).set(
                t.noteId,
                Ma(
                  {
                    content: '',
                    creationDate: Date.now() / 1e3,
                    modificationDate: Date.now() / 1e3,
                    deleted: !1,
                    publishURL: '',
                    shareURL: '',
                    systemTags: [],
                    tags: [],
                  },
                  t.note
                )
              );
            case 'DELETE_NOTE_FOREVER':
            case 'NOTE_BUCKET_REMOVE':
            case 'REMOTE_NOTE_DELETE_FOREVER':
              if (!e.has(t.noteId)) return e;
              var o = new Map(e);
              return o.delete(t.noteId), o;
            case 'EDIT_NOTE':
              var s,
                i =
                  null !== (s = e.get(t.noteId)) && void 0 !== s
                    ? s
                    : {
                        content: '',
                        creationDate: Date.now() / 1e3,
                        modificationDate: Date.now() / 1e3,
                        deleted: !1,
                        publishURL: '',
                        shareURL: '',
                        systemTags: [],
                        tags: [],
                      };
              return new Map(e).set(t.noteId, xa(Ma(Ma({}, i), t.changes)));
            case 'NOTE_BUCKET_UPDATE':
            case 'REMOTE_NOTE_UPDATE':
            case 'RESTORE_NOTE_REVISION':
            case 'IMPORT_NOTE_WITH_ID':
              return new Map(e).set(t.noteId, t.note);
            case 'MARKDOWN_NOTE':
              if (!e.has(t.noteId)) return e;
              var l = e.get(t.noteId);
              if (l.systemTags.includes('markdown') === t.shouldEnableMarkdown)
                return e;
              var c = t.shouldEnableMarkdown
                ? [...l.systemTags, 'markdown']
                : l.systemTags.filter((e) => 'markdown' !== e);
              return new Map(e).set(
                t.noteId,
                xa(Ma(Ma({}, l), {}, { systemTags: c }))
              );
            case 'PIN_NOTE':
              if (!e.has(t.noteId)) return e;
              var u = e.get(t.noteId);
              if (u.systemTags.includes('pinned') === t.shouldPin) return e;
              var d = t.shouldPin
                ? [...u.systemTags, 'pinned']
                : u.systemTags.filter((e) => 'pinned' !== e);
              return new Map(e).set(
                t.noteId,
                xa(Ma(Ma({}, u), {}, { systemTags: d }))
              );
            case 'PUBLISH_NOTE':
              if (!e.has(t.noteId)) return e;
              var m = e.get(t.noteId);
              if (m.systemTags.includes('published') === t.shouldPublish)
                return e;
              var p = t.shouldPublish
                  ? [...m.systemTags, 'published']
                  : m.systemTags.filter((e) => 'published' !== e),
                h = t.shouldPublish
                  ? t.publishURL || m.publishURL || t.noteId
                  : '';
              return new Map(e).set(
                t.noteId,
                xa(Ma(Ma({}, m), {}, { systemTags: p, publishURL: h }))
              );
            case 'REMOVE_COLLABORATOR':
            case 'REMOVE_NOTE_TAG':
              var g = e.get(t.noteId);
              if (!g) return e;
              var v =
                  'REMOVE_COLLABORATOR' === t.type
                    ? t.collaboratorAccount
                    : t.tagName,
                E = (0, J.nb)(g.tags, v);
              return E !== g.tags
                ? new Map(e).set(t.noteId, xa(Ma(Ma({}, g), {}, { tags: E })))
                : e;
            case 'RENAME_TAG':
              var f = (0, J.YG)(t.oldTagName),
                y = (0, J.YG)(t.newTagName),
                N = new Map(e);
              return (
                f === y ||
                  N.forEach((e, n) => {
                    var a = [],
                      r = new Set(),
                      o = !1;
                    e.tags.forEach((e) => {
                      var n = (0, J.YG)(e);
                      (o = o || n === f || n === y),
                        r.has(n) ||
                          (f !== n && (r.add(n), a.push(e)),
                          r.has(y) || (r.add(y), a.push(t.newTagName)));
                    }),
                      o && N.set(n, xa(Ma(Ma({}, e), {}, { tags: a })));
                  }),
                N
              );
            case 'RESTORE_NOTE':
              return e.has(t.noteId)
                ? new Map(e).set(
                    t.noteId,
                    xa(Ma(Ma({}, e.get(t.noteId)), {}, { deleted: !1 }))
                  )
                : e;
            case 'TRASH_NOTE':
              return e.has(t.noteId)
                ? new Map(e).set(
                    t.noteId,
                    xa(Ma(Ma({}, e.get(t.noteId)), {}, { deleted: !0 }))
                  )
                : e;
            case 'TRASH_TAG':
              var b = new Map(e),
                T = !1;
              return (
                b.forEach((e, n) => {
                  var a = (0, J.nb)(e.tags, t.tagName);
                  a !== e.tags &&
                    ((T = !0), b.set(n, xa(Ma(Ma({}, e), {}, { tags: a }))));
                }),
                T ? b : e
              );
            default:
              return e;
          }
        },
        noteRevisions: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : new Map(),
            t = arguments.length > 1 ? arguments[1] : void 0;
          if ('LOAD_REVISIONS' === t.type) {
            var n,
              a =
                null !== (n = e.get(t.noteId)) && void 0 !== n ? n : new Map(),
              r = new Map(a);
            return (
              t.revisions.forEach((e) => {
                var [t, n] = e;
                return r.set(t, n);
              }),
              new Map(e).set(t.noteId, r)
            );
          }
          return e;
        },
        noteTags: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : new Map(),
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'ADD_COLLABORATOR':
            case 'ADD_NOTE_TAG':
              var n,
                a = (0, J.YG)(
                  'ADD_COLLABORATOR' === t.type
                    ? t.collaboratorAccount
                    : t.tagName
                );
              return new Map(e).set(
                a,
                (null !== (n = e.get(a)) && void 0 !== n ? n : new Set()).add(
                  t.noteId
                )
              );
            case 'EDIT_NOTE':
            case 'IMPORT_NOTE_WITH_ID':
            case 'REMOTE_NOTE_UPDATE':
              var r = 'EDIT_NOTE' === t.type ? t.changes.tags : t.note.tags,
                { noteId: o } = t;
              if (
                !(
                  'IMPORT_NOTE_WITH_ID' === t.type ||
                  'REMOTE_NOTE_UPDATE' === t.type ||
                  (null != r && r.length)
                )
              )
                return e;
              var s = new Set((null != r ? r : []).map(J.YG)),
                i = new Map(e);
              return (
                i.forEach((e, t) => {
                  if (e.has(o) && !s.has(t)) {
                    var n = new Set(e);
                    return n.delete(o), void i.set(t, n);
                  }
                  !e.has(o) && s.has(t) && i.set(t, new Set(e).add(o));
                }),
                s.forEach((e) => {
                  i.has(e) || i.set(e, new Set([o]));
                }),
                i
              );
            case 'TAG_REFRESH':
              return t.noteTags;
            case 'REMOTE_TAG_DELETE':
            case 'TAG_BUCKET_REMOVE':
              var l = new Map(e);
              return l.delete(t.tagHash) ? l : e;
            case 'REMOVE_COLLABORATOR':
            case 'REMOVE_NOTE_TAG':
              var c = (0, J.YG)(
                  'REMOVE_COLLABORATOR' === t.type
                    ? t.collaboratorAccount
                    : t.tagName
                ),
                u = e.get(c);
              if (!u) return e;
              var d = new Set(u);
              return d.delete(t.noteId) ? new Map(e).set(c, d) : e;
            case 'TRASH_TAG':
              var m = new Map(e);
              return m.delete((0, J.YG)(t.tagName)) ? m : e;
            default:
              return e;
          }
        },
        preferences: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : new Map(),
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'PREFERENCES_BUCKET_REMOVE':
              var n = new Map(e);
              return n.delete(t.id) ? n : e;
            case 'PREFERENCES_BUCKET_UPDATE':
              return new Map(e).set(t.id, t.data);
            default:
              return e;
          }
        },
        tags: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : new Map(),
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'ADD_COLLABORATOR':
            case 'ADD_NOTE_TAG':
              var n =
                'ADD_COLLABORATOR' === t.type
                  ? t.collaboratorAccount
                  : t.tagName;
              return e.has((0, J.YG)(n))
                ? e
                : new Map(e).set((0, J.YG)(n), { name: n });
            case 'EDIT_NOTE':
            case 'IMPORT_NOTE_WITH_ID':
            case 'REMOTE_NOTE_UPDATE':
              var a = 'EDIT_NOTE' === t.type ? t.changes.tags : t.note.tags;
              if (null == a || !a.length) return e;
              var r = new Map(e),
                o = !1;
              return (
                a.forEach((t) => {
                  var n = (0, J.YG)(t);
                  e.has(n) || (r.set(n, { name: t }), (o = !0));
                }),
                o ? r : e
              );
            case 'REMOTE_TAG_DELETE':
            case 'TAG_BUCKET_REMOVE':
              var s = new Map(e);
              return s.delete(t.tagHash) ? s : e;
            case 'REMOTE_TAG_UPDATE':
            case 'TAG_BUCKET_UPDATE':
              return new Map(e).set(t.tagHash, t.tag);
            case 'RENAME_TAG':
              var i,
                l = (0, J.YG)(t.oldTagName),
                c = (0, J.YG)(t.newTagName),
                u = new Map(e),
                d = null !== (i = e.get(l)) && void 0 !== i ? i : {};
              return (
                u.set(c, Ma(Ma({}, d), {}, { name: t.newTagName })),
                l !== c && u.delete(l),
                u
              );
            case 'REORDER_TAG':
              var m = (0, J.YG)(t.tagName),
                p = e.get(m);
              if (!p) return e;
              var h = new Map(e);
              return (
                h.delete(m),
                [...h.entries()]
                  .sort((e, t) =>
                    void 0 !== e[1].index && void 0 !== t[1].index
                      ? e[1].index - t[1].index
                      : void 0 === e[1].index
                        ? 1
                        : -1
                  )
                  .forEach((e, n) => {
                    var [a, r] = e;
                    h.set(
                      a,
                      Ma(Ma({}, r), {}, { index: n < t.newIndex ? n : n + 1 })
                    );
                  }),
                h.set(m, Ma(Ma({}, p), {}, { index: t.newIndex })),
                h
              );
            case 'TAG_REFRESH':
              var g = new Map(e);
              return (
                t.noteTags.forEach((e, t) => {
                  g.has(t) || g.set(t, { name: (0, J.Fk)(t) });
                }),
                g
              );
            case 'RESTORE_NOTE_REVISION':
              var v = new Map(e);
              return (
                t.note.tags.forEach((e) => {
                  var t = (0, J.YG)(e);
                  v.has(t) || v.set(t, { name: e });
                }),
                v
              );
            case 'TRASH_TAG':
              var E = new Map(e);
              return E.delete((0, J.YG)(t.tagName)) ? E : e;
            default:
              return e;
          }
        },
      });
      function Ga(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function Ha(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Ga(Object(n), !0).forEach(function (t) {
                (0, o.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : Ga(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t)
                  );
                });
        }
        return e;
      }
      var Va = { used: 0, total: 1048576, exceeded: !1 };
      const Fa = (0, ia.HY)({
        accountName: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : null,
            t = arguments.length > 1 ? arguments[1] : void 0;
          return 'setAccountName' === t.type ? t.accountName : e;
        },
        autoHideMenuBar: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'setAutoHideMenuBar':
              return t.autoHideMenuBar;
            case 'TOGGLE_AUTO_HIDE_MENU_BAR':
              return !e;
            default:
              return e;
          }
        },
        focusModeEnabled: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'setFocusMode':
              return t.focusModeEnabled;
            case 'TOGGLE_FOCUS_MODE':
              return !e;
            default:
              return e;
          }
        },
        keyboardShortcuts: function () {
          var e =
            !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
          return 'KEYBOARD_SHORTCUTS_TOGGLE' ===
            (arguments.length > 1 ? arguments[1] : void 0).type
            ? !e
            : e;
        },
        lineLength: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : 'narrow',
            t = arguments.length > 1 ? arguments[1] : void 0;
          return 'setLineLength' === t.type ? t.lineLength : e;
        },
        markdownEnabled: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
            t = arguments.length > 1 ? arguments[1] : void 0;
          return 'SET_SYSTEM_TAG' === t.type && 'markdown' === t.tagName
            ? t.shouldHaveTag
            : e;
        },
        noteDisplay: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : 'comfy',
            t = arguments.length > 1 ? arguments[1] : void 0;
          return 'setNoteDisplay' === t.type ? t.noteDisplay : e;
        },
        sendNotifications: function () {
          var e,
            t,
            n,
            a =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : 'granted' ===
                  (null === (e = window.Notification) || void 0 === e
                    ? void 0
                    : e.permission),
            r = arguments.length > 1 ? arguments[1] : void 0;
          return 'REQUEST_NOTIFICATIONS' === r.type
            ? !!r.sendNotifications &&
                'granted' ===
                  (null === (t = window.Notification) || void 0 === t
                    ? void 0
                    : t.permission)
            : a &&
                'granted' ===
                  (null === (n = window.Notification) || void 0 === n
                    ? void 0
                    : n.permission);
        },
        sortReversed: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'setSortReversed':
              return t.sortReversed;
            case 'setSortType':
              return void 0 !== t.sortReversed ? t.sortReversed : e;
            case 'TOGGLE_SORT_ORDER':
              return !e;
            default:
              return e;
          }
        },
        sortTagsAlpha: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'setSortTagsAlpha':
              return t.sortTagsAlpha;
            case 'TOGGLE_SORT_TAGS_ALPHA':
              return !e;
            default:
              return e;
          }
        },
        sortType: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : 'modificationDate',
            t = arguments.length > 1 ? arguments[1] : void 0;
          return 'setSortType' === t.type ? t.sortType : e;
        },
        showPreviewButton: function () {
          var e =
            arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          return 'TOGGLE_PREVIEW_BUTTON' ===
            (arguments.length > 1 ? arguments[1] : void 0).type
            ? !e
            : e;
        },
        spellCheckEnabled: function () {
          var e =
              !(arguments.length > 0 && void 0 !== arguments[0]) ||
              arguments[0],
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'setSpellCheck':
              return t.spellCheckEnabled;
            case 'TOGGLE_SPELLCHECK':
              return !e;
            default:
              return e;
          }
        },
        theme: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : 'system',
            t = arguments.length > 1 ? arguments[1] : void 0;
          return 'setTheme' === t.type ? t.theme : e;
        },
      });
      var Ua = new Map(),
        ja = new Set();
      const Ba = (0, ia.HY)({
        connectionStatus: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : navigator.onLine
                  ? 'red'
                  : 'offline',
            t = arguments.length > 1 ? arguments[1] : void 0;
          return 'CHANGE_CONNECTION_STATUS' === t.type ? t.status : e;
        },
        ghosts: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : [new Map(), new Map()],
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'GHOST_REMOVE_ENTITY':
              var n,
                [a, r] = e,
                o =
                  null !== (n = r.get(t.bucketName)) && void 0 !== n
                    ? n
                    : new Map(),
                s = new Map(o);
              return s.delete(t.entityId), [a, new Map(r).set(t.bucketName, s)];
            case 'GHOST_SET_CHANGE_VERSION':
              var [i, l] = e;
              return [new Map(i).set(t.bucketName, t.version), l];
            case 'GHOST_SET_ENTITY':
              var c,
                [u, d] = e,
                m =
                  null !== (c = d.get(t.bucketName)) && void 0 !== c
                    ? c
                    : new Map(),
                p = new Map(m).set(t.entityId, t.ghost);
              return [u, new Map(d).set(t.bucketName, p)];
            default:
              return e;
          }
        },
        lastSync: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : Ua,
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'ACKNOWLEDGE_PENDING_CHANGE':
              return new Map(e).set(t.entityId, Date.now());
            case 'REMOTE_NOTE_UPDATE':
              return new Map(e).set(t.noteId, Date.now());
            default:
              return e;
          }
        },
        lastRemoteUpdate: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : Ua,
            t = arguments.length > 1 ? arguments[1] : void 0;
          return 'REMOTE_NOTE_UPDATE' === t.type && t.remoteInfo
            ? new Map(e).set(t.noteId, Date.now())
            : e;
        },
        pendingChanges: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : ja,
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'SUBMIT_PENDING_CHANGE':
              if (e.has(t.entityId)) return e;
              var n = new Set(e);
              return n.add(t.entityId), n;
            case 'ACKNOWLEDGE_PENDING_CHANGE':
              if (!e.has(t.entityId)) return e;
              var a = new Set(e);
              return a.delete(t.entityId), a;
            default:
              return e;
          }
        },
      });
      var Wa = n(51938),
        za = ['type', 'name'];
      function qa(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function Ya(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? qa(Object(n), !0).forEach(function (t) {
                (0, o.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : qa(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t)
                  );
                });
        }
        return e;
      }
      var Qa = [];
      const Ka = (0, ia.HY)({
        collection: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : { type: 'all' },
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'CREATE_NOTE_WITH_ID':
              return 'trash' === e.type
                ? { type: 'all' }
                : 'tag' === e.type
                  ? { type: 'tag', tagName: e.tagName }
                  : e;
            case 'OPEN_TAG':
              return { type: 'tag', tagName: t.tagName };
            case 'RENAME_TAG':
              return 'tag' === e.type && e.tagName === t.oldTagName
                ? { type: 'tag', tagName: t.newTagName }
                : e;
            case 'SELECT_TRASH':
              return { type: 'trash' };
            case 'SHOW_ALL_NOTES':
              return { type: 'all' };
            case 'SHOW_UNTAGGED_NOTES':
              return { type: 'untagged' };
            case 'TRASH_TAG':
              var n =
                  'tag' === e.type &&
                  (0, J.YG)(e.tagName) === (0, J.YG)(t.tagName),
                a =
                  'untagged' === e.type &&
                  0 === (null == t ? void 0 : t.remainingTags);
              return n || a ? { type: 'all' } : e;
            default:
              return e;
          }
        },
        alternateLoginEmail: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : null,
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'SHOW_ALTERNATE_LOGIN_PROMPT':
              return t.email ? atob(t.email) : null;
            case 'HIDE_ALTERNATE_LOGIN_PROMPT':
              return null;
            default:
              return e;
          }
        },
        dialogs: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : [],
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'CLOSE_DIALOG':
              return e.slice(0, -1);
            case 'TRASH_TAG':
              return e.filter((e) => 'TRASH-TAG-CONFIRMATION' !== e.type);
            case 'REMOTE_TAG_DELETE':
              return e.filter(
                (e) =>
                  !(
                    'TRASH-TAG-CONFIRMATION' === e.type &&
                    (0, J.YG)(e.tagName) === t.tagHash
                  )
              );
            case 'SHOW_DIALOG':
              var { type: n, name: a } = t,
                r = (0, D.A)(t, za);
              return e.find((e) => e.type === a)
                ? e
                : [...e, Ya({ type: a }, r)];
            default:
              return e;
          }
        },
        editMode: function () {
          var e =
              !(arguments.length > 0 && void 0 !== arguments[0]) ||
              arguments[0],
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'SET_EDITOR_VIEW_MODE':
              return 'source' === t.mode;
            case 'TOGGLE_EDIT_MODE':
              return !e;
            case 'CREATE_NOTE_WITH_ID':
              return !0;
            default:
              return e;
          }
        },
        editorSelection: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : new Map(),
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'REMOTE_NOTE_UPDATE':
              var n;
              if (
                'd' !==
                  (null === (n = t.remoteInfo) ||
                  void 0 === n ||
                  null === (n = n.patch) ||
                  void 0 === n ||
                  null === (n = n.content) ||
                  void 0 === n
                    ? void 0
                    : n.o) ||
                !e.has(t.noteId)
              )
                return e;
              var [a, r, o] = e.get(t.noteId),
                s = t.remoteInfo.patch.content.v.split('\t'),
                i = t.remoteInfo.original.content,
                l = (0, Wa.TC)((0, Wa.yK)(i).slice(0, a)).length,
                c = (0, Wa.TC)((0, Wa.yK)(i).slice(0, r)).length,
                [u, d] = s.reduce(
                  (e, t) => {
                    var [n, a, r] = e;
                    if (r > n && r > a) return e;
                    var o = t[0],
                      s = t.slice(1);
                    switch (o) {
                      case '=':
                        return [n, a, r + parseInt(s, 10)];
                      case '-':
                        var i = parseInt(s, 10);
                        return [n > r ? n - i : n, a > r ? a - i : a, r];
                      case '+':
                        var l = decodeURIComponent(s).length;
                        return [n > r ? n + l : n, a > r ? a + l : a, r];
                      default:
                        return e;
                    }
                  },
                  [l, c, 0]
                ),
                m = (0, Wa.yK)(t.note.content.slice(0, u)).length,
                p = (0, Wa.yK)(t.note.content.slice(0, d)).length;
              return new Map(e).set(t.noteId, [m, p, o]);
            case 'STORE_EDITOR_SELECTION':
              return new Map(e).set(t.noteId, [t.start, t.end, t.direction]);
            default:
              return e;
          }
        },
        editingTags: function () {
          var e =
            arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          switch ((arguments.length > 1 ? arguments[1] : void 0).type) {
            case 'TAG_EDITING_TOGGLE':
              return !e;
            case 'OPEN_NOTE':
            case 'SELECT_NOTE':
            case 'OPEN_TAG':
            case 'SELECT_TRASH':
            case 'SHOW_ALL_NOTES':
            case 'SHOW_UNTAGGED_NOTES':
            case 'NAVIGATION_TOGGLE':
              return !1;
            default:
              return e;
          }
        },
        filteredNotes: function () {
          var e,
            t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : Qa,
            n = arguments.length > 1 ? arguments[1] : void 0;
          return void 0 ===
            (null === (e = n.meta) || void 0 === e ? void 0 : e.searchResults)
            ? t
            : n.meta.searchResults.noteIds;
        },
        hasLoadedNotes: function () {
          var e =
            arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          return (
            'FILTER_NOTES' ===
              (arguments.length > 1 ? arguments[1] : void 0).type || e
          );
        },
        numberOfMatchesInNote: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : null,
            t = arguments.length > 1 ? arguments[1] : void 0;
          return 'STORE_NUMBER_OF_MATCHES_IN_NOTE' === t.type ? t.matches : e;
        },
        openedNote: function () {
          var e,
            t,
            n =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : null,
            a = arguments.length > 1 ? arguments[1] : void 0;
          switch (a.type) {
            case 'CLOSE_NOTE':
              return null;
            case 'OPEN_NOTE':
              return null !== (e = null == a ? void 0 : a.noteId) &&
                void 0 !== e
                ? e
                : n;
            case 'SELECT_NOTE':
              return a.noteId;
            default:
              return void 0 !==
                (null === (t = a.meta) || void 0 === t
                  ? void 0
                  : t.nextNoteToOpen)
                ? a.meta.nextNoteToOpen
                : n;
          }
        },
        openedRevision: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : null,
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'CLOSE_REVISION':
            case 'RESTORE_NOTE_REVISION':
              return null;
            case 'OPEN_REVISION':
              return [t.noteId, t.version];
            default:
              return e;
          }
        },
        restoreDeletedTags: function () {
          var e =
            !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
          switch ((arguments.length > 1 ? arguments[1] : void 0).type) {
            case 'TOGGLE_RESTORING_DELETED_TAGS':
              return !e;
            case 'REVISIONS_TOGGLE':
              return !0;
            default:
              return e;
          }
        },
        searchQuery: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : '',
            t = arguments.length > 1 ? arguments[1] : void 0;
          return 'SEARCH' === t.type ? t.searchQuery : e;
        },
        selectedSearchMatchIndex: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : null,
            t = arguments.length > 1 ? arguments[1] : void 0;
          return 'STORE_SEARCH_SELECTION' === t.type ? t.index : e;
        },
        showAlternateLoginPrompt: function () {
          var e =
            arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          switch ((arguments.length > 1 ? arguments[1] : void 0).type) {
            case 'SHOW_ALTERNATE_LOGIN_PROMPT':
              return !e;
            case 'HIDE_ALTERNATE_LOGIN_PROMPT':
              return !1;
            default:
              return e;
          }
        },
        showNavigation: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case 'NAVIGATION_TOGGLE':
              return !e;
            case 'OPEN_TAG':
            case 'SELECT_TRASH':
            case 'SHOW_ALL_NOTES':
            case 'SHOW_UNTAGGED_NOTES':
              return !1;
            case 'SHOW_DIALOG':
              return 'SETTINGS' !== t.name && e;
            default:
              return e;
          }
        },
        showNoteActions: function () {
          var e =
            arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          switch ((arguments.length > 1 ? arguments[1] : void 0).type) {
            case 'NOTE_ACTIONS_TOGGLE':
              return !e;
            case 'NAVIGATION_TOGGLE':
            case 'NOTE_ACTIONS_CLOSE':
            case 'NOTE_INFO_TOGGLE':
            case 'REVISIONS_TOGGLE':
            case 'SELECT_NOTE':
            case 'SHOW_DIALOG':
            case 'TRASH_NOTE':
              return !1;
            default:
              return e;
          }
        },
        showNoteInfo: function () {
          var e =
            arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          switch ((arguments.length > 1 ? arguments[1] : void 0).type) {
            case 'NOTE_INFO_TOGGLE':
              return !e;
            case 'NAVIGATION_TOGGLE':
            case 'NOTE_ACTIONS_TOGGLE':
            case 'SELECT_NOTE':
              return !1;
            default:
              return e;
          }
        },
        showNoteList: function () {
          var e =
            !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
          switch ((arguments.length > 1 ? arguments[1] : void 0).type) {
            case 'NOTE_LIST_TOGGLE':
              return !e;
            case 'FOCUS_SEARCH_FIELD':
              return !0;
            case 'OPEN_NOTE':
              return !1;
            default:
              return e;
          }
        },
        showRevisions: function () {
          var e =
            arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
          switch ((arguments.length > 1 ? arguments[1] : void 0).type) {
            case 'REVISIONS_TOGGLE':
              return !e;
            case 'CLOSE_REVISION':
            case 'OPEN_NOTE':
            case 'SELECT_NOTE':
            case 'CREATE_NOTE_WITH_ID':
            case 'RESTORE_NOTE_REVISION':
              return !1;
            default:
              return e;
          }
        },
        simperiumConnected: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
            t = arguments.length > 1 ? arguments[1] : void 0;
          return 'SIMPERIUM_CONNECTION_STATUS_TOGGLE' === t.type
            ? t.simperiumConnected
            : e;
        },
        tagSuggestions: function () {
          var e,
            t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : Qa,
            n = arguments.length > 1 ? arguments[1] : void 0;
          return void 0 ===
            (null === (e = n.meta) || void 0 === e ? void 0 : e.searchResults)
            ? t
            : n.meta.searchResults.tagHashes;
        },
        editorViewMode: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : 'source',
            t = arguments.length > 1 ? arguments[1] : void 0;
          return 'SET_EDITOR_VIEW_MODE' === t.type ? t.mode : e;
        },
        unsyncedNoteIds: function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : Qa,
            t = arguments.length > 1 ? arguments[1] : void 0;
          return 'SET_UNSYNCED_NOTE_IDS' === t.type ? t.noteIds : e;
        },
      });
      function Za(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function Xa(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Za(Object(n), !0).forEach(function (t) {
                (0, o.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : Za(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t)
                  );
                });
        }
        return e;
      }
      var Ja = [
          'accountName',
          'autoHideMenuBar',
          'focusModeEnabled',
          'keyboardShortcuts',
          'lineLength',
          'markdownEnabled',
          'noteDisplay',
          'sendNotifications',
          'sortReversed',
          'sortTagsAlpha',
          'sortType',
          'showPreviewButton',
          'spellCheckEnabled',
          'theme',
        ],
        $a = (0, ia.HY)({
          browser: ka,
          data: Pa,
          quota: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : Va,
              t = arguments.length > 1 ? arguments[1] : void 0;
            switch (t.type) {
              case 'SET_QUOTA':
                return Ha(Ha({}, e), {}, { used: t.used, total: t.total });
              case 'SET_QUOTA_EXCEEDED':
                return e.exceeded ? e : Ha(Ha({}, e), {}, { exceeded: !0 });
              case 'ACKNOWLEDGE_PENDING_CHANGE':
                return e.exceeded ? Ha(Ha({}, e), {}, { exceeded: !1 }) : e;
              default:
                return e;
            }
          },
          settings: Fa,
          simperium: Ba,
          ui: Ka,
        }),
        er = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || ia.Zz,
        tr = n(78325),
        nr = n(44036),
        ar = '1txt_ghost_',
        rr = '1txt_sync_cv';
      class or {
        constructor(e, t) {
          (this.supabase = e),
            (this.userId = t),
            (this.cache = new Map()),
            this.loadFromLocalStorage();
        }
        loadFromLocalStorage() {
          try {
            for (var e = 0; e < localStorage.length; e++) {
              var t = localStorage.key(e);
              if (t && t.startsWith(ar)) {
                var n = localStorage.getItem(t);
                n && this.cache.set(t, n);
              }
            }
          } catch (e) {
            console.warn('[GhostStore] Failed to load from localStorage:', e);
          }
        }
        storageKey(e) {
          return ''.concat(ar).concat(this.userId, '_').concat(e);
        }
        get(e) {
          var t = this;
          return (0, a.A)(function* () {
            var n = t.storageKey(e),
              a = t.cache.get(n);
            if (a)
              try {
                return JSON.parse(a);
              } catch (e) {
                t.cache.delete(n), localStorage.removeItem(n);
              }
            return { key: e, version: 0, data: {} };
          })();
        }
        put(e, t, n) {
          var r = this;
          return (0, a.A)(function* () {
            var a = { key: e, version: t, data: n },
              o = JSON.stringify(a),
              s = r.storageKey(e);
            r.cache.set(s, o);
            try {
              localStorage.setItem(s, o);
            } catch (e) {
              console.warn('[GhostStore] localStorage write failed:', e);
            }
            try {
              yield r.supabase
                .from('note_ghosts')
                .upsert(
                  {
                    user_id: r.userId,
                    note_id: e,
                    version: t,
                    data: n,
                    updated_at: new Date().toISOString(),
                  },
                  { onConflict: 'user_id,note_id' }
                );
            } catch (e) {
              console.warn(
                '[GhostStore] Supabase write failed (will retry):',
                e
              );
            }
            return !0;
          })();
        }
        remove(e) {
          var t = this;
          return (0, a.A)(function* () {
            var n = t.storageKey(e);
            t.cache.delete(n), localStorage.removeItem(n);
            try {
              yield t.supabase
                .from('note_ghosts')
                .delete()
                .eq('user_id', t.userId)
                .eq('note_id', e);
            } catch (e) {
              console.warn('[GhostStore] Supabase delete failed:', e);
            }
          })();
        }
        getChangeVersion() {
          var e = this;
          return (0, a.A)(function* () {
            try {
              var t = localStorage.getItem(''.concat(rr, '_').concat(e.userId));
              if (t) return t;
              var { data: n } = yield e.supabase
                .from('sync_cursors')
                .select('change_version')
                .eq('user_id', e.userId)
                .maybeSingle();
              if (null != n && n.change_version)
                return (
                  localStorage.setItem(
                    ''.concat(rr, '_').concat(e.userId),
                    n.change_version
                  ),
                  n.change_version
                );
            } catch (e) {}
            return null;
          })();
        }
        setChangeVersion(e) {
          var t = this;
          return (0, a.A)(function* () {
            e
              ? localStorage.setItem(''.concat(rr, '_').concat(t.userId), e)
              : localStorage.removeItem(''.concat(rr, '_').concat(t.userId));
            try {
              yield t.supabase
                .from('sync_cursors')
                .upsert(
                  {
                    user_id: t.userId,
                    change_version: e,
                    updated_at: new Date().toISOString(),
                  },
                  { onConflict: 'user_id' }
                );
            } catch (e) {
              console.warn('[GhostStore] Failed to save CV to Supabase:', e);
            }
          })();
        }
        eachGhost(e) {
          var t = ''.concat(ar).concat(this.userId, '_');
          this.cache.forEach((n, a) => {
            if (a.startsWith(t))
              try {
                var r = JSON.parse(n);
                r.key || (r.key = a.slice(t.length)), e(r);
              } catch (e) {}
          });
        }
        pullAllFromSupabase() {
          var e = this;
          return (0, a.A)(function* () {
            var { data: t, error: n } = yield e.supabase
              .from('note_ghosts')
              .select('note_id, version, data')
              .eq('user_id', e.userId);
            if (n)
              return (
                console.error('[GhostStore] Failed to pull ghosts:', n), []
              );
            var a = [];
            for (var r of t || []) {
              var o = { key: r.note_id, version: r.version, data: r.data },
                s = JSON.stringify(o),
                i = e.storageKey(r.note_id);
              e.cache.set(i, s);
              try {
                localStorage.setItem(i, s);
              } catch (e) {}
              a.push(o);
            }
            return a;
          })();
        }
      }
      var sr = (n(41624).default, n(34441)),
        ir = {
          buildChange: sr.buildChange,
          compressChanges: sr.compressChanges,
          transform: sr.transform,
          modify: sr.modify,
          apply: sr.apply,
          isEmptyChange: sr.isEmptyChange,
          diff: sr.diff,
          type: sr.type,
        },
        lr = n(13796),
        cr = lr.default || lr;
      class ur extends $t.EventEmitter {
        constructor(e) {
          super(),
            (this.store = e),
            (this.sent = {}),
            (this.queues = {}),
            (this.ready = !1);
        }
        start() {
          for (var e in ((this.ready = !0), this.queues)) this.processQueue(e);
        }
        pause() {
          this.ready = !1;
        }
        acknowledge(e) {
          this.sent[e.id] === e && delete this.sent[e.id],
            this.processQueue(e.id);
        }
        queue(e) {
          var t = this.queues[e.id];
          t || ((t = []), (this.queues[e.id] = t)),
            t.push(e),
            this.emit('queued', e.id, e, t),
            this.ready && this.processQueue(e.id);
        }
        dequeueChangesFor(e) {
          var t = [],
            n = this.sent[e],
            a = this.queues[e];
          return n && t.push(n), a && (delete this.queues[e], t.push(...a)), t;
        }
        processQueue(e) {
          var t = this.queues[e];
          t &&
            (0 !== t.length
              ? this.sent[e]
                ? this.emit('wait', e)
                : this.store.get(e).then((t) => {
                    var n = this.queues[e];
                    if (this.sent[e]) this.emit('wait', e);
                    else if (n && 0 !== n.length) {
                      var a = n.reduce((e, t) => ('remove' === e.type ? e : t)),
                        r = cr(a, t);
                      (this.queues[e] = []),
                        ir.isEmptyChange(r) ||
                          ((this.sent[e] = r), this.emit('send', r));
                    } else delete this.queues[e];
                  })
              : delete this.queues[e]);
        }
        resendSentChanges() {
          for (var e in this.sent) this.emit('send', this.sent[e]);
        }
        hasLocalChanges() {
          return (
            Object.keys(this.queues).length > 0 ||
            Object.keys(this.sent).length > 0
          );
        }
      }
      class dr extends $t.EventEmitter {
        constructor(e, t) {
          var n =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
          super(),
            (0, o.A)(this, 'realtimeChannel', null),
            (0, o.A)(this, 'status', 'idle'),
            (0, o.A)(this, 'isIndexing', !1),
            (this.supabase = e),
            (this.userId = t),
            (this.clientId = '1txt-'.concat((0, Ea.A)().slice(0, 8))),
            (this.store = new or(e, t)),
            (this.localQueue = new ur(this.store)),
            (this.getLocalNoteData = n.getLocalNoteData),
            this.localQueue.on('send', (e) => {
              this.sendChange(e);
            });
        }
        flushPending() {
          for (var e in (this.localQueue.ready || this.localQueue.start(),
          this.localQueue.resendSentChanges(),
          this.localQueue.queues))
            this.localQueue.processQueue(e);
        }
        start() {
          var e = this;
          return (0, a.A)(function* () {
            e.setStatus('syncing');
            try {
              var t = e.hydrateFromLocalCache(),
                n = yield e.store.getChangeVersion();
              n && 0 !== t
                ? yield e.performIncrementalSync(n)
                : (n &&
                    0 === t &&
                    console.warn(
                      '[SyncChannel] CV exists but local ghost cache is empty — forcing full index'
                    ),
                  yield e.performFullIndex()),
                e.subscribeToRealtime(),
                e.localQueue.start(),
                e.setStatus('idle');
            } catch (t) {
              console.error('[SyncChannel] Start failed:', t),
                e.setStatus('offline');
            }
          })();
        }
        hydrateFromLocalCache() {
          var e = 0;
          return (
            this.store.eachGhost &&
              this.store.eachGhost((t) => {
                t.key && (this.emit('update', t.key, t.data, {}, {}, !0), e++);
              }),
            e > 0 &&
              console.log(
                '[SyncChannel] Hydrated '.concat(e, ' note(s) from local cache')
              ),
            e
          );
        }
        stop() {
          this.localQueue.pause(),
            this.realtimeChannel &&
              (this.supabase.removeChannel(this.realtimeChannel),
              (this.realtimeChannel = null)),
            this.setStatus('idle');
        }
        update(e, t) {
          var n = this;
          return (0, a.A)(function* () {
            try {
              var a = yield n.store.get(e),
                r = ir.diff(a.data, t);
              if (!r || 0 === Object.keys(r).length)
                return void n.emit('unmodified', e, t, a);
              n.localQueue.queue({ type: 'modify', id: e, object: t });
            } catch (e) {
              console.error('[SyncChannel] Update failed:', e);
            }
          })();
        }
        remove(e) {
          var t = this;
          return (0, a.A)(function* () {
            t.localQueue.queue({ type: 'remove', id: e });
          })();
        }
        getStatus() {
          return this.status;
        }
        hasLocalChanges() {
          return this.localQueue.hasLocalChanges();
        }
        hasPendingForNote(e) {
          var t, n;
          return (
            !!this.localQueue.sent[e] ||
            (null !==
              (t =
                null === (n = this.localQueue.queues[e]) || void 0 === n
                  ? void 0
                  : n.length) && void 0 !== t
              ? t
              : 0) > 0
          );
        }
        setStatus(e) {
          (this.status = e), this.emit('status', e);
        }
        refreshGhostFromServer(e) {
          var t = this;
          return (0, a.A)(function* () {
            var { data: n, error: a } = yield t.supabase
              .from('note_ghosts')
              .select('version, data')
              .eq('user_id', t.userId)
              .eq('note_id', e)
              .maybeSingle();
            if (!a && n) {
              var r = yield t.store.get(e);
              n.version <= r.version ||
                (yield t.store.put(e, n.version, n.data),
                t.emit('update', e, n.data, r.data, {}, t.isIndexing));
            }
          })();
        }
        performFullIndex() {
          var e = this;
          return (0, a.A)(function* () {
            (e.isIndexing = !0), e.setStatus('indexing'), e.emit('indexing');
            try {
              var t = yield e.store.pullAllFromSupabase();
              for (var n of t) e.emit('update', n.key, n.data, {}, {}, !0);
              var { data: a } = yield e.supabase
                  .from('note_changes')
                  .select('created_at')
                  .eq('user_id', e.userId)
                  .order('created_at', { ascending: !1 })
                  .limit(1)
                  .maybeSingle(),
                r =
                  (null == a ? void 0 : a.created_at) ||
                  new Date().toISOString();
              yield e.store.setChangeVersion(r),
                (e.isIndexing = !1),
                e.emit('index', r);
            } catch (t) {
              console.error('[SyncChannel] Full index failed:', t),
                (e.isIndexing = !1);
            }
          })();
        }
        performIncrementalSync(e) {
          var t = this;
          return (0, a.A)(function* () {
            try {
              var { data: n, error: a } = yield t.supabase
                .from('note_changes')
                .select('*')
                .eq('user_id', t.userId)
                .neq('client_id', t.clientId)
                .gt('created_at', e)
                .order('created_at', { ascending: !0 });
              if (a)
                return (
                  console.warn(
                    '[SyncChannel] Incremental sync failed, falling back to full index'
                  ),
                  yield t.store.setChangeVersion(null),
                  void (yield t.performFullIndex())
                );
              if (n && n.length > 0) {
                for (var r of n) yield t.applyRemoteChange(r);
                var o = n[n.length - 1].created_at;
                yield t.store.setChangeVersion(o);
              }
            } catch (e) {
              console.error('[SyncChannel] Incremental sync error:', e);
            }
          })();
        }
        subscribeToRealtime() {
          var e = this;
          this.realtimeChannel = this.supabase
            .channel('sync_changes')
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'note_changes',
                filter: 'user_id=eq.'.concat(this.userId),
              },
              (function () {
                var t = (0, a.A)(function* (t) {
                  var n = t.new;
                  n.client_id !== e.clientId &&
                    (yield e.applyRemoteChange(n),
                    yield e.store.setChangeVersion(n.created_at));
                });
                return function (e) {
                  return t.apply(this, arguments);
                };
              })()
            )
            .subscribe((e) => {
              if ('SUBSCRIBED' === e) {
                var t = 'offline' === this.status;
                console.log('[SyncChannel] Realtime connected'),
                  t && this.flushPending(),
                  this.setStatus(
                    this.localQueue.hasLocalChanges() ? 'syncing' : 'idle'
                  );
              } else
                ('CLOSED' !== e && 'CHANNEL_ERROR' !== e) ||
                  (console.warn(
                    '[SyncChannel] Realtime disconnected, will retry'
                  ),
                  this.setStatus('offline'));
            });
        }
        applyRemoteChange(e) {
          var t = this;
          return (0, a.A)(function* () {
            var n,
              a = e.note_id,
              r = yield t.store.get(a);
            if ('remove' === e.operation)
              return yield t.store.remove(a), void t.emit('remove', a);
            var o = e.patch,
              s = e.sv;
            if (r.version > 0 && r.version !== s) {
              console.warn(
                '[SyncChannel] Version mismatch for '
                  .concat(a, ': ghost=')
                  .concat(r.version, ', sv=')
                  .concat(s, '. Requesting re-index.')
              );
              var { data: i } = yield t.supabase
                .from('note_ghosts')
                .select('version, data')
                .eq('user_id', t.userId)
                .eq('note_id', a)
                .maybeSingle();
              i &&
                (yield t.store.put(a, i.version, i.data),
                t.emit('update', a, i.data, r.data, o, t.isIndexing));
            } else {
              var l = r.data,
                c = ir.apply(o, l),
                u = e.ev || r.version + 1,
                d = t.localQueue.queues[a],
                m = t.localQueue.sent[a];
              if (
                !(
                  (null !== (n = null == d ? void 0 : d.length) && void 0 !== n
                    ? n
                    : 0) > 0 || m
                )
              )
                return (
                  yield t.store.put(a, u, c),
                  void t.emit('update', a, c, l, o, t.isIndexing)
                );
              var p = l,
                h = null == d ? void 0 : d[d.length - 1];
              if (null != h && h.object) p = h.object;
              else if (t.getLocalNoteData) {
                var g = t.getLocalNoteData(a);
                g && (p = g);
              }
              if (p === l && null != m && m.v)
                try {
                  p = ir.apply(m.v, l) || l;
                } catch (e) {
                  console.warn(
                    '[SyncChannel] Could not re-apply in-flight patch, falling back to ghost:',
                    e
                  );
                }
              var v = ir.diff(l, p),
                E =
                  v && Object.keys(v).length > 0 ? ir.transform(v, o, l) : null;
              t.localQueue.dequeueChangesFor(a), yield t.store.put(a, u, c);
              var f = c;
              E &&
                Object.keys(E).length > 0 &&
                ((f = ir.apply(E, c) || c),
                t.localQueue.queue({ type: 'modify', id: a, object: f })),
                t.emit('update', a, f, l, o, t.isIndexing);
            }
          })();
        }
        sendChange(e) {
          var t = this;
          return (0, a.A)(function* () {
            t.setStatus('syncing');
            try {
              var n,
                a = yield t.store.get(e.id),
                { error: r } = yield t.supabase
                  .from('note_changes')
                  .insert({
                    user_id: t.userId,
                    note_id: e.id,
                    ccid: e.ccid,
                    sv: e.sv || a.version,
                    ev: (e.sv || a.version) + 1,
                    operation: '-' === e.o ? 'remove' : 'modify',
                    patch: e.v || {},
                    client_id: t.clientId,
                  });
              if (r)
                return '23505' === r.code
                  ? (yield t
                      .refreshGhostFromServer(e.id)
                      .catch((t) =>
                        console.warn(
                          '[SyncChannel] Could not resync ghost after 23505 for',
                          e.id,
                          t
                        )
                      ),
                    t.localQueue.acknowledge(e),
                    t.emit('acknowledge', e.id, e),
                    void t.setStatus(
                      t.localQueue.hasLocalChanges() ? 'syncing' : 'idle'
                    ))
                  : '53100' === r.code ||
                      /quota_exceeded/i.test(
                        null !== (n = r.message) && void 0 !== n ? n : ''
                      )
                    ? (console.warn(
                        '[SyncChannel] Quota exceeded — pausing uploads for',
                        e.id
                      ),
                      t.emit('quota-exceeded', e.id, r),
                      t.localQueue.acknowledge(e),
                      void t.setStatus('idle'))
                    : (console.error('[SyncChannel] Failed to send change:', r),
                      void t.setStatus('offline'));
              var o = (e.sv || a.version) + 1,
                s = null;
              if ('M' === e.o && e.v) {
                var i = ir.apply(e.v, a.data);
                yield t.store.put(e.id, o, i);
                var { error: l } = yield t.supabase
                  .from('note_ghosts')
                  .upsert(
                    {
                      user_id: t.userId,
                      note_id: e.id,
                      version: o,
                      data: i,
                      updated_at: new Date().toISOString(),
                    },
                    { onConflict: 'user_id,note_id' }
                  );
                if (l) {
                  var c;
                  if (
                    '53100' === l.code ||
                    /quota_exceeded/i.test(
                      null !== (c = l.message) && void 0 !== c ? c : ''
                    )
                  )
                    return (
                      console.warn(
                        '[SyncChannel] Quota exceeded on ghost upsert for',
                        e.id
                      ),
                      t.emit('quota-exceeded', e.id, l),
                      t.localQueue.acknowledge(e),
                      void t.setStatus('idle')
                    );
                  console.warn(
                    '[SyncChannel] Ghost upsert failed (non-fatal):',
                    l
                  );
                }
                s = i;
              } else '-' === e.o && (yield t.store.remove(e.id));
              t.localQueue.acknowledge(e),
                t.emit('acknowledge', e.id, e),
                yield t.store.setChangeVersion(new Date().toISOString()),
                s && (yield t.recordRevision(e.id, o, s)),
                t.setStatus(
                  t.localQueue.hasLocalChanges() ? 'syncing' : 'idle'
                );
            } catch (e) {
              console.error('[SyncChannel] Send error:', e),
                t.setStatus('offline');
            }
          })();
        }
        recordRevision(e, t, n) {
          var r = this;
          return (0, a.A)(function* () {
            try {
              var { error: a } = yield r.supabase
                .from('note_revisions')
                .insert({
                  user_id: r.userId,
                  note_id: e,
                  version: t,
                  content: n,
                });
              if (a) {
                if ('23505' === a.code) return;
                console.warn('[SyncChannel] recordRevision failed:', a);
              }
            } catch (e) {
              console.warn('[SyncChannel] recordRevision threw:', e);
            }
          })();
        }
        getRevisions(e) {
          var t = this;
          return (0, a.A)(function* () {
            try {
              var n,
                { data: a, error: r } = yield t.supabase
                  .from('note_revisions')
                  .select('version, content, created_at')
                  .eq('user_id', t.userId)
                  .eq('note_id', e)
                  .order('version', { ascending: !0 });
              if (r)
                return (
                  console.warn('[SyncChannel] getRevisions failed:', r), []
                );
              var o =
                null !==
                  (n = (null != a ? a : []).map((e) => ({
                    version: e.version,
                    data: e.content,
                  }))) && void 0 !== n
                  ? n
                  : [];
              try {
                var s = yield t.store.get(e);
                s &&
                  s.version > 0 &&
                  (0 === o.length || o[o.length - 1].version < s.version) &&
                  o.push({ version: s.version, data: s.data });
              } catch (e) {}
              return o;
            } catch (e) {
              return (
                console.error('[SyncChannel] Failed to get revisions:', e), []
              );
            }
          })();
        }
      }
      var mr = null,
        pr = null,
        hr = null,
        gr = null,
        vr = new Set(),
        Er = 0,
        fr = null,
        yr = 'undefined' == typeof navigator || navigator.onLine,
        Nr = !1,
        br = (function () {
          var e = (0, a.A)(function* (e, t, n, a, r) {
            if ((pr = (0, nr.A)())) {
              r && (hr = r),
                (gr = t),
                yield pr.auth.setSession({ access_token: n, refresh_token: a }),
                (mr = new dr(pr, t, {
                  getLocalNoteData: (t) => {
                    var n;
                    return null === (n = e.getState()) ||
                      void 0 === n ||
                      null === (n = n.data) ||
                      void 0 === n ||
                      null === (n = n.notes) ||
                      void 0 === n
                      ? void 0
                      : n.get(t);
                  },
                }));
              var { dispatch: o, getState: s } = e;
              Ir(e),
                o({
                  type: 'CHANGE_CONNECTION_STATUS',
                  status: yr ? 'green' : 'offline',
                }),
                mr.on('update', (e, t, n, a, r) => {
                  o(
                    n && a && void 0 !== r
                      ? {
                          type: 'REMOTE_NOTE_UPDATE',
                          noteId: e,
                          note: t,
                          remoteInfo: { original: n, patch: a, isIndexing: r },
                        }
                      : { type: 'REMOTE_NOTE_UPDATE', noteId: e, note: t }
                  );
                }),
                mr.on('remove', (e) => {
                  o({ type: 'REMOTE_NOTE_DELETE_FOREVER', noteId: e });
                }),
                mr.on('status', (e) => {
                  o(
                    yr
                      ? {
                          type: 'CHANGE_CONNECTION_STATUS',
                          status:
                            'syncing' === e
                              ? 'green'
                              : 'offline' === e
                                ? 'offline'
                                : 'green',
                        }
                      : { type: 'CHANGE_CONNECTION_STATUS', status: 'offline' }
                  );
                }),
                mr.on('indexing', () => {
                  o(
                    yr
                      ? { type: 'CHANGE_CONNECTION_STATUS', status: 'green' }
                      : { type: 'CHANGE_CONNECTION_STATUS', status: 'offline' }
                  );
                }),
                mr.on('acknowledge', (e) => {
                  var t;
                  !vr.has(e) ||
                    (null !== (t = mr) &&
                      void 0 !== t &&
                      t.hasPendingForNote(e)) ||
                    Ar(e),
                    Tr(o);
                }),
                mr.on('quota-exceeded', (e, t) => {
                  var n, a;
                  o({
                    type: 'SET_QUOTA_EXCEEDED',
                    noteId: e,
                    message: String(
                      null !==
                        (n =
                          null !== (a = null == t ? void 0 : t.message) &&
                          void 0 !== a
                            ? a
                            : t) && void 0 !== n
                        ? n
                        : 'Cloud quota exceeded'
                    ),
                  }),
                    Tr(o, !0);
                });
              try {
                yield mr.start();
              } catch (e) {
                console.error('[Sync] Failed to start:', e);
              }
              Tr(o, !0),
                console.log('[Sync] Supabase sync initialized for user:', t);
            } else
              console.warn(
                '[Sync] No Supabase config (supabase_url/supabase_key missing), skipping cloud sync'
              );
          });
          return function (t, n, a, r, o) {
            return e.apply(this, arguments);
          };
        })(),
        Tr = function (e) {
          var t =
            arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
          if (pr && gr) {
            var n = Date.now(),
              a = n - Er;
            if (t || a >= 5e3)
              return (
                (Er = n),
                fr && (clearTimeout(fr), (fr = null)),
                void Or(e).catch((e) =>
                  console.warn('[Sync] refreshQuota failed:', e)
                )
              );
            fr ||
              (fr = setTimeout(() => {
                (fr = null),
                  (Er = Date.now()),
                  Or(e).catch((e) =>
                    console.warn('[Sync] refreshQuota failed:', e)
                  );
              }, 5e3 - a));
          }
        },
        wr = !1,
        _r = (function () {
          var e = (0, a.A)(function* (e) {
            if (wr || !pr) return !1;
            wr = !0;
            try {
              var { data: t, error: n } = yield pr.auth.refreshSession();
              return n || null == t || !t.session
                ? (console.warn(
                    '[Sync] Session is broken and refreshSession failed; forcing logout',
                    n
                  ),
                  e({ type: 'LOGOUT' }),
                  !1)
                : (console.log(
                    '[Sync] Session refreshed successfully, retrying quota fetch'
                  ),
                  !0);
            } catch (t) {
              return (
                console.warn('[Sync] refreshSession threw:', t),
                e({ type: 'LOGOUT' }),
                !1
              );
            }
          });
          return function (t) {
            return e.apply(this, arguments);
          };
        })(),
        Or = (function () {
          var e = (0, a.A)(function* (e) {
            if (pr && gr) {
              var t = (function () {
                  var e = (0, a.A)(function* () {
                    return pr
                      .from('user_profiles')
                      .select('used_bytes, quota_bytes')
                      .eq('id', gr)
                      .maybeSingle();
                  });
                  return function () {
                    return e.apply(this, arguments);
                  };
                })(),
                { data: n, error: r } = yield t();
              if (!r && !n) {
                if (!(yield _r(e))) return;
                ({ data: n, error: r } = yield t());
              }
              r
                ? 'PGRST116' !== r.code &&
                  console.warn('[Sync] refreshQuota query error:', r)
                : n &&
                  e({
                    type: 'SET_QUOTA',
                    used: Number(n.used_bytes) || 0,
                    total: Number(n.quota_bytes) || 1048576,
                  });
            }
          });
          return function (t) {
            return e.apply(this, arguments);
          };
        })(),
        Sr = {},
        Ar = (e) => {
          var t;
          vr.delete(e) &&
            (null === (t = kr) ||
              void 0 === t ||
              t({ type: 'ACKNOWLEDGE_PENDING_CHANGE', entityId: e, ccid: '' }));
        },
        Cr = function (e) {
          var t,
            n =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : 300;
          vr.has(e) ||
            (vr.add(e),
            null === (t = kr) ||
              void 0 === t ||
              t({ type: 'SUBMIT_PENDING_CHANGE', entityId: e, ccid: '' })),
            Sr[e] && clearTimeout(Sr[e]),
            (Sr[e] = setTimeout(() => {
              var t;
              if ((delete Sr[e], mr)) {
                var n =
                  null === (t = Rr) ||
                  void 0 === t ||
                  null === (t = t()) ||
                  void 0 === t ||
                  null === (t = t.data) ||
                  void 0 === t ||
                  null === (t = t.notes) ||
                  void 0 === t
                    ? void 0
                    : t.get(e);
                n && mr.update(e, n);
              }
            }, n));
        },
        Ir = (e) => {
          Nr ||
            'undefined' == typeof window ||
            ((Nr = !0),
            window.addEventListener('offline', () => {
              (yr = !1),
                e.dispatch({
                  type: 'CHANGE_CONNECTION_STATUS',
                  status: 'offline',
                });
            }),
            window.addEventListener('online', () => {
              if (((yr = !0), mr))
                try {
                  mr.flushPending();
                } catch (e) {
                  console.warn(
                    '[Sync] flushPending after reconnect failed:',
                    e
                  );
                }
              else
                e.dispatch({
                  type: 'CHANGE_CONNECTION_STATUS',
                  status: 'green',
                });
            }));
        },
        Rr = null,
        kr = null,
        Dr = (e) => (t) => (n) => {
          var a = t(n);
          if ('CLOSE_WINDOW' === n.type)
            return e.dispatch({ type: 'REALLY_CLOSE_WINDOW' }), a;
          if (!mr) return a;
          switch (
            ((Rr = e.getState.bind(e)), (kr = e.dispatch.bind(e)), n.type)
          ) {
            case 'CREATE_NOTE_WITH_ID':
            case 'EDIT_NOTE':
            case 'INSERT_TASK_INTO_NOTE':
            case 'RESTORE_NOTE_REVISION':
            case 'IMPORT_NOTE_WITH_ID':
              n.noteId && Cr(n.noteId);
              break;
            case 'MARKDOWN_NOTE':
            case 'PIN_NOTE':
            case 'PUBLISH_NOTE':
            case 'RESTORE_NOTE':
            case 'TRASH_NOTE':
            case 'ADD_NOTE_TAG':
            case 'REMOVE_NOTE_TAG':
            case 'ADD_COLLABORATOR':
            case 'REMOVE_COLLABORATOR':
              n.noteId && Cr(n.noteId, 10);
              break;
            case 'DELETE_NOTE_FOREVER':
              mr.remove(n.noteId);
              break;
            case 'LOGOUT':
            case 'REALLY_LOG_OUT':
              Pr();
              try {
                localStorage.removeItem('1txt_refresh_token'),
                  localStorage.removeItem('1txt_user_id');
                for (var r = [], o = 0; o < localStorage.length; o++) {
                  var s = localStorage.key(o);
                  s &&
                    (s.startsWith('1txt_ghost_') ||
                      s.startsWith('1txt_sync_cv_')) &&
                    r.push(s);
                }
                r.forEach((e) => localStorage.removeItem(e)),
                  localStorage.setItem(
                    'simplenote_logout',
                    Math.random().toString()
                  );
              } catch (e) {}
              hr && (hr(), (hr = null));
              break;
            case 'FILTER_NOTES':
            case 'OPEN_NOTE':
            case 'SELECT_NOTE':
              var i,
                l,
                c,
                u,
                d =
                  null !==
                    (i =
                      null !== (l = n.noteId) && void 0 !== l
                        ? l
                        : null === (c = n.meta) || void 0 === c
                          ? void 0
                          : c.nextNoteToOpen) && void 0 !== i
                    ? i
                    : e.getState().ui.openedNote,
                m = e.getState();
              !d ||
                (null !== (u = m.data.noteRevisions.get(d)) &&
                  void 0 !== u &&
                  u.size) ||
                Lr.has(d) ||
                (Lr.add(d),
                setTimeout(() => {
                  e.getState().ui.openedNote === d && Mr(d, e.dispatch);
                }, 500));
              break;
            case 'REVISIONS_TOGGLE':
              var p = e.getState();
              p.ui.showRevisions &&
                p.ui.openedNote &&
                Mr(p.ui.openedNote, e.dispatch);
          }
          return a;
        },
        Lr = new Set();
      function Mr(e, t) {
        return xr.apply(this, arguments);
      }
      function xr() {
        return (xr = (0, a.A)(function* (e, t) {
          if (mr)
            try {
              t({
                type: 'LOAD_REVISIONS',
                noteId: e,
                revisions: (yield mr.getRevisions(e))
                  .map((e) => {
                    var { version: t, data: n } = e;
                    return [t, n];
                  })
                  .sort((e, t) => e[0] - t[0]),
              });
            } catch (t) {
              console.warn('[Sync] Failed to load revisions for', e, t);
            }
        })).apply(this, arguments);
      }
      var Pr = () => {
          mr && (mr.stop(), (mr = null)),
            fr && (clearTimeout(fr), (fr = null)),
            (Er = 0),
            (gr = null),
            (wr = !1);
        },
        Gr = '1txt:welcome-note-seeded';
      const Hr = function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
          t = Boolean(e),
          n = t ? 'Development' : 'Production';
        return console[e ? 'warn' : 'info']('Simperium config: '.concat(n)), t;
      };
      var Vr = (e, t, n) => {
        l().setAppElement('#root');
        var o =
            ('undefined' != typeof localStorage &&
              localStorage.getItem('1txt_user_id')) ||
            '',
          i =
            ('undefined' != typeof localStorage &&
              localStorage.getItem('1txt_refresh_token')) ||
            '',
          c = !1;
        'undefined' != typeof sessionStorage &&
          (c = '1' === sessionStorage.getItem('1txt_pending_initial_sync')) &&
          sessionStorage.removeItem('1txt_pending_initial_sync'),
          (function (e) {
            for (
              var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), a = 1;
              a < t;
              a++
            )
              n[a - 1] = arguments[a];
            return ha(e).then((t) => {
              var a,
                r,
                [o, s] = t;
              return (0, ia.y$)(
                $a,
                Xa(
                  Xa({}, o),
                  {},
                  {
                    settings: Xa(
                      Xa({}, (0, A.pick)(o.settings, Ja)),
                      {},
                      {
                        accountName:
                          null !==
                            (a =
                              null === (r = o.settings) || void 0 === r
                                ? void 0
                                : r.accountName) && void 0 !== a
                            ? a
                            : e,
                      }
                    ),
                  }
                ),
                er(
                  ca()('settings', {
                    key: 'simpleNote',
                    slicer: (e) => (t) => ({
                      [e]: (0, A.omit)(t[e], [
                        'allowNotifications',
                        'focusModeEnabled',
                      ]),
                    }),
                  }),
                  (0, ia.Tw)(
                    ba,
                    Jn.r1,
                    Da,
                    Oa.r1,
                    Ue,
                    Ca,
                    ...(Ee.b8 ? [_a] : []),
                    ...n,
                    ...(s ? [s] : [])
                  )
                )
              );
            });
          })(n, Dr).then(
            (function () {
              var n = (0, a.A)(function* (n) {
                var a, l, u;
                if (
                  (Object.defineProperties(window, {
                    dispatch: { get: () => n.dispatch },
                    state: { get: () => n.getState() },
                  }),
                  null === (a = window.electron) ||
                    void 0 === a ||
                    a.send('appStateUpdate', {
                      settings: n.getState().settings,
                      editMode: n.getState().ui.editMode,
                    }),
                  o && t)
                )
                  try {
                    if (c) {
                      yield br(n, o, t, i, e),
                        yield (function (e) {
                          return new Promise((t) => {
                            var n,
                              a,
                              r = !1,
                              o = () => {
                                void 0 !== a && clearTimeout(a);
                                try {
                                  var e;
                                  null === (e = n) || void 0 === e || e();
                                } catch (e) {}
                              },
                              s = (e) => {
                                r ||
                                  ((r = !0),
                                  o(),
                                  e
                                    ? requestAnimationFrame(() => {
                                        requestAnimationFrame(() => {
                                          setTimeout(t, 150);
                                        });
                                      })
                                    : t());
                              },
                              i = () => {
                                var t = e.getState();
                                if (0 === t.data.notes.size) return s(!1), !0;
                                var n = t.ui.openedNote;
                                return !(
                                  null == n ||
                                  !t.data.notes.has(n) ||
                                  (s(!0), 0)
                                );
                              };
                            i() ||
                              ((n = e.subscribe(() => {
                                i();
                              })),
                              (a = setTimeout(() => {
                                r || ((r = !0), o(), t());
                              }, 8e3)));
                          });
                        })(n);
                      try {
                        !(function (e) {
                          var t =
                            arguments.length > 1 && void 0 !== arguments[1]
                              ? arguments[1]
                              : {};
                          if ('undefined' == typeof localStorage) return null;
                          if ('1' === localStorage.getItem(Gr)) return null;
                          if (e.getState().data.notes.size > 0)
                            return localStorage.setItem(Gr, '1'), null;
                          var n = (0, Ea.A)(),
                            a = Date.now() / 1e3;
                          e.dispatch({
                            type: 'CREATE_NOTE_WITH_ID',
                            noteId: n,
                            note: {
                              content:
                                '# Welcome to 1TXT 👋\n\n1TXT is a fast, Markdown-first note app that keeps your notes in sync\nacross your devices.\n\nFeel free to edit, rename, or delete this note — it is a regular note\nlike any other.\n\n## Getting started\n\n- **New note** — press `Ctrl + Shift + I`.\n- **Switch view** — use the `</>` (source) and `Aa` (WYSIWYG) buttons\n  in the top-right toolbar.\n- **Insert Markdown** — click the M↓ badge for quick snippets (headings,\n  lists, links, code blocks, …).\n- **Tag a note** — type in the "Add a tag…" field at the bottom. Click a\n  chip later to filter by that tag, or hover for the × to remove it.\n- **Find anything** — start typing in the search box at the top of the\n  note list, or use `tag:work` to filter by tag.\n\nHappy writing!\n',
                              systemTags: ['markdown'],
                              tags: [],
                              creationDate: a,
                              modificationDate: a,
                              deleted: !1,
                              publishURL: '',
                              shareURL: '',
                            },
                            meta: { nextNoteToOpen: n },
                          }),
                            e.dispatch({ type: 'SELECT_NOTE', noteId: n }),
                            t.forceWysiwyg &&
                              e.dispatch({
                                type: 'SET_EDITOR_VIEW_MODE',
                                mode: 'wysiwyg',
                              }),
                            localStorage.setItem(Gr, '1');
                        })(n, { forceWysiwyg: !0 });
                      } catch (e) {
                        console.warn(
                          '[Welcome] Failed to seed welcome note:',
                          e
                        );
                      }
                    } else
                      br(n, o, t, i, e).catch((e) =>
                        console.error('[Sync] Init failed:', e)
                      );
                  } catch (e) {
                    console.error('[Sync] Init failed:', e);
                  }
                else
                  console.warn(
                    '[Sync] Missing userId/token, cloud sync disabled for this session'
                  );
                (0, tr.render)(
                  r.createElement(
                    s.Kq,
                    { store: n },
                    r.createElement(
                      sa.N,
                      {
                        isDevConfig: Hr(
                          null ===
                            (l = {
                              app_id: 'history-analyst-dad',
                              app_key: 'be606bcfa3db4377bf488900281aa1cc',
                              development: !0,
                              wpcc_client_id: '0',
                              wpcc_redirect_url: 'https://simplenote.com',
                              supabase_url:
                                'https://otwdueyugisryvbccesr.supabase.co',
                              supabase_key:
                                'sb_publishable_vNbOHrBzJbT16SqlXms2CA_dl8P7HZH',
                              version: '1.0.3',
                              public_web_url: 'https://1txt.xyz',
                            }) || void 0 === l
                            ? void 0
                            : l.development
                        ),
                      },
                      r.createElement(oa, {
                        isDevConfig: Hr(
                          null ===
                            (u = {
                              app_id: 'history-analyst-dad',
                              app_key: 'be606bcfa3db4377bf488900281aa1cc',
                              development: !0,
                              wpcc_client_id: '0',
                              wpcc_redirect_url: 'https://simplenote.com',
                              supabase_url:
                                'https://otwdueyugisryvbccesr.supabase.co',
                              supabase_key:
                                'sb_publishable_vNbOHrBzJbT16SqlXms2CA_dl8P7HZH',
                              version: '1.0.3',
                              public_web_url: 'https://1txt.xyz',
                            }) || void 0 === u
                            ? void 0
                            : u.development
                        ),
                      })
                    )
                  ),
                  document.getElementById('root')
                );
              });
              return function (e) {
                return n.apply(this, arguments);
              };
            })()
          );
      };
    },
    94541: (e, t, n) => {
      'use strict';
      n.r(t), n.d(t, { NotePreview: () => E, default: () => y });
      var a = n(63696),
        r = n(80249),
        o = n(51938),
        s = n(48940),
        i = n(14111),
        l = n(9985),
        c = n.n(l),
        u = n(17243),
        d = {
          type: 'output',
          regex: '<input type="checkbox" disabled',
          replace: '<input type="checkbox" ',
        },
        m = { type: 'output', regex: '>\n', replace: '>' },
        p = (e, t) => {
          var n = e.parentNode;
          t.forEach((e) => {
            n.childNodes.forEach((n) => {
              var a, r, o;
              if (
                n.nodeType === Node.TEXT_NODE &&
                null !== (a = n.textContent) &&
                void 0 !== a &&
                a.toLocaleLowerCase().includes(e)
              ) {
                var s =
                    null === (r = n.textContent) || void 0 === r
                      ? void 0
                      : r.toLocaleLowerCase().indexOf(e),
                  i = n.splitText(s),
                  l = i.splitText(e.length),
                  c = document.createElement('span');
                c.setAttribute('class', 'search-match'),
                  null === (o = i.parentNode) ||
                    void 0 === o ||
                    o.replaceChild(c, i),
                  c.appendChild(i),
                  p(l, t);
              }
            });
          });
        };
      const h = (e, t, a) =>
        ((e) =>
          n
            .e(6632)
            .then(n.t.bind(n, 79132, 23))
            .then((t) => {
              var { default: n } = t;
              n.extension('enableCheckboxes', d),
                n.extension('removeLineBreaks', m);
              var a = new n.Converter({
                extensions: ['enableCheckboxes', 'removeLineBreaks'],
              });
              a.setFlavor('github'),
                a.setOption('ghMentions', !1),
                a.setOption('literalMidWordUnderscores', !0),
                a.setOption('simpleLineBreaks', !1),
                a.setOption('smoothLivePreview', !0),
                a.setOption('splitAdjacentBlockquotes', !0),
                a.setOption('strikethrough', !0),
                a.setOption('tables', !0);
              var r = e.replace(/([ \t\u2000-\u200a]*)\u2022(\s)/gm, '$1-$2');
              return ((e) => {
                for (
                  var t = new DOMParser().parseFromString(e, 'text/html'),
                    n = t.createTreeWalker(
                      t.body,
                      NodeFilter.SHOW_ALL,
                      null,
                      !1
                    ),
                    a = [],
                    r = [],
                    o = function () {
                      var e = n.currentNode;
                      if (
                        ((e) => {
                          switch (e.nodeName.toLowerCase()) {
                            case 'head':
                            case 'html':
                            case 'iframe':
                            case 'link':
                            case 'meta':
                            case 'object':
                            case 'script':
                            case 'style':
                              return !0;
                            default:
                              return !1;
                          }
                        })(e)
                      )
                        return r.push(e), 0;
                      if (
                        !((e) => {
                          var t = e.nodeName.toLowerCase();
                          if ('input' === t)
                            return 'checkbox' === e.getAttribute('type');
                          switch (t) {
                            case '#text':
                            case 'a':
                            case 'article':
                            case 'b':
                            case 'br':
                            case 'blockquote':
                            case 'cite':
                            case 'code':
                            case 'dd':
                            case 'del':
                            case 'div':
                            case 'dt':
                            case 'em':
                            case 'h1':
                            case 'h2':
                            case 'h3':
                            case 'h4':
                            case 'h5':
                            case 'h6':
                            case 'hr':
                            case 'i':
                            case 'img':
                            case 'ins':
                            case 'kbd':
                            case 'li':
                            case 'ol':
                            case 'p':
                            case 'pre':
                            case 's':
                            case 'span':
                            case 'strong':
                            case 'sub':
                            case 'sup':
                            case 'table':
                            case 'tbody':
                            case 'td':
                            case 'th':
                            case 'thead':
                            case 'tr':
                            case 'tt':
                            case 'ul':
                              return !0;
                            default:
                              return !1;
                          }
                        })(e)
                      )
                        return a.push(e), 0;
                      var t = e.nodeName.toLowerCase();
                      (0, u.filter)(e.attributes, (e) => {
                        var { name: n, value: a } = e;
                        return !(
                          ((e, t, n) => {
                            switch (e) {
                              case 'a':
                                switch (t) {
                                  case 'href':
                                    return [
                                      'http',
                                      'https',
                                      'simplenote',
                                    ].includes(
                                      n.toLowerCase().trim().split('://')[0]
                                    );
                                  case 'alt':
                                  case 'rel':
                                  case 'title':
                                    return !0;
                                  default:
                                    return !1;
                                }
                              case 'img':
                                switch (t) {
                                  case 'alt':
                                  case 'src':
                                  case 'title':
                                  case 'width':
                                    return !0;
                                  default:
                                    return !1;
                                }
                              case 'input':
                                switch (t) {
                                  case 'disabled':
                                  case 'checked':
                                  case 'type':
                                    return !0;
                                  default:
                                    return !1;
                                }
                              case 'li':
                                return 'class' === t && 'task-list-item' === n;
                              case 'ol':
                                return 'start' === t;
                              case 'th':
                              case 'td':
                                if ('style' === t)
                                  switch (n) {
                                    case 'text-align:center;':
                                    case 'text-align:left;':
                                    case 'text-align:right;':
                                      return !0;
                                    default:
                                      return !1;
                                  }
                                return !1;
                              default:
                                return !1;
                            }
                          })(t, n, a) ||
                          (('href' === n || 'src' === n) && c().isWebUri(a)) ||
                          ('href' === n &&
                            a.startsWith('mailto:') &&
                            i.validate(a.slice(7)))
                        );
                      }).forEach((t) => {
                        var { name: n } = t;
                        return e.removeAttribute(n);
                      });
                      var o = 'a' === t && e.getAttribute('href');
                      'a' !== t ||
                        'string' != typeof o ||
                        o.startsWith('mailto:') ||
                        (e.setAttribute('target', '_blank'),
                        e.setAttribute('rel', 'external noopener noreferrer')),
                        'li' === t &&
                          'task-list-item' === e.getAttribute('class') &&
                          e.setAttribute('style', 'list-style: none;');
                    };
                  n.nextNode();

                )
                  o();
                return (
                  r.forEach((e) => {
                    try {
                      var t;
                      null == e ||
                        null === (t = e.parentNode) ||
                        void 0 === t ||
                        t.removeChild(e);
                    } catch (e) {}
                  }),
                  a.forEach((e) => {
                    var t,
                      n = e.parentNode;
                    try {
                      for (; (t = e.firstChild); )
                        null == n || n.insertBefore(t, e);
                      null == n || n.removeChild(e);
                    } catch (e) {}
                  }),
                  t.body.innerHTML
                );
              })(a.makeHtml(r));
            }))(t)
          .then((t) => ((e.innerHTML = t), e))
          .then((e) => {
            if (!a) return e.querySelectorAll('pre code');
            var t = (0, s.S)(a).map((e) => e.toLocaleLowerCase());
            if (!t.length) return e.querySelectorAll('pre code');
            for (
              var n = document.createTreeWalker(
                  e,
                  NodeFilter.SHOW_TEXT,
                  {
                    acceptNode: function (e) {
                      return t.some((t) => {
                        var n;
                        return null === (n = e.textContent) || void 0 === n
                          ? void 0
                          : n.toLocaleLowerCase().includes(t);
                      })
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT;
                    },
                  },
                  !1
                ),
                r = [],
                o = n.currentNode;
              o;

            )
              r.push(o), (o = n.nextNode());
            return r.forEach((e) => p(e, t)), e.querySelectorAll('pre code');
          })
          .then((e) => {
            if (e.length)
              return n
                .e(6021)
                .then(n.bind(n, 42408))
                .then((t) => {
                  var { default: n } = t;
                  e.forEach(n.highlightElement);
                })
                .catch();
          });
      var g = n(37453),
        v = n(61943),
        E = (e) => {
          var t,
            {
              editNote: n,
              isFocused: r,
              note: s,
              noteId: i,
              notes: l,
              openNote: c,
              searchQuery: u,
              showRenderedView: d,
            } = e,
            m = (0, a.useRef)();
          return (
            (0, a.useEffect)(() => {
              var e = (e) => {
                if (!r) return !0;
                if (!document.getSelection().isCollapsed) return !0;
                var t = document.createElement('div');
                h(t, s.content, u).then(() => {
                  try {
                    e.clipboardData.setData('text/plain', t.innerHTML);
                  } catch (e) {
                    navigator.clipboard.writeText(t.innerHTML);
                  }
                }),
                  e.preventDefault();
              };
              return (
                document.addEventListener('copy', e, !1),
                () => document.removeEventListener('copy', e, !1)
              );
            }, [r, u]),
            (0, a.useEffect)(() => {
              var e,
                t = (e) => {
                  for (var t, a, r = e.target; null !== r; r = r.parentNode)
                    if ('A' === r.tagName) {
                      e.preventDefault(), e.stopPropagation();
                      var u = r;
                      if (u.href.startsWith('simplenote://note/')) {
                        var d = /^simplenote:\/\/note\/(.+)$/.exec(u.href);
                        if (!d) return;
                        var [p, h] = d;
                        return void (l.has(h) && c(h));
                      }
                      return void (
                        u.href.startsWith('http://localhost') ||
                        (0, g.i)(u.href)
                      );
                    }
                  var v =
                    'INPUT' ===
                    (null == e || null === (t = e.target) || void 0 === t
                      ? void 0
                      : t.tagName)
                      ? e.target.parentElement
                      : e.target;
                  if (
                    'INPUT' !==
                    (null == v || null === (a = v.children[0]) || void 0 === a
                      ? void 0
                      : a.tagName)
                  );
                  else {
                    e.preventDefault(), e.stopPropagation();
                    var E = m.current.querySelectorAll(
                        '[data-markdown-root] .task-list-item'
                      ),
                      f = Array.prototype.indexOf.call(E, v),
                      y = 0,
                      N = s.content.replace(
                        o.Dm,
                        (e, t, n, a) =>
                          t +
                          (y++ === f
                            ? ' ' === n
                              ? '- [x]'
                              : '- [ ]'
                            : ' ' === n
                              ? '- [ ]'
                              : '- [x]') +
                          a
                      );
                    n(i, { content: N });
                  }
                };
              return (
                null === (e = m.current) ||
                  void 0 === e ||
                  e.addEventListener('click', t, !0),
                () => {
                  var e;
                  return null === (e = m.current) || void 0 === e
                    ? void 0
                    : e.removeEventListener('click', t, !0);
                }
              );
            }, [s.content]),
            (0, a.useEffect)(() => {
              var e;
              m.current &&
                (null != s && s.content && d
                  ? h(m.current, s.content, u)
                  : (m.current.innerText = (0, o.yK)(
                      null !== (e = null == s ? void 0 : s.content) &&
                        void 0 !== e
                        ? e
                        : ''
                    )));
            }, [null == s ? void 0 : s.content, u, d]),
            (0, a.useEffect)(() => {
              if ('undefined' != typeof MutationObserver) {
                var e = new MutationObserver((e) => {
                  e.some(
                    (e) =>
                      'attributes' === e.type &&
                      'data-theme' === e.attributeName
                  ) &&
                    m.current &&
                    null != s &&
                    s.content &&
                    d &&
                    h(m.current, s.content, u);
                });
                return (
                  e.observe(document.body, {
                    attributes: !0,
                    attributeFilter: ['data-theme'],
                  }),
                  () => e.disconnect()
                );
              }
            }, [null == s ? void 0 : s.content, u, d]),
            a.createElement(
              'div',
              { className: 'note-detail-wrapper' },
              a.createElement(
                'div',
                { className: 'note-detail note-detail-preview' },
                a.createElement(
                  'div',
                  {
                    ref: m,
                    className: 'note-detail-markdown note-preview',
                    'data-markdown-root': !0,
                  },
                  !d &&
                    (0, o.yK)(
                      null !== (t = null == s ? void 0 : s.content) &&
                        void 0 !== t
                        ? t
                        : ''
                    )
                )
              )
            )
          );
        },
        f = { editNote: v.A.data.editNote, openNote: v.A.ui.selectNote };
      const y = (0, r.Ng)((e, t) => {
        var n,
          a,
          r = null !== (n = t.noteId) && void 0 !== n ? n : e.ui.openedNote,
          o = null !== (a = t.note) && void 0 !== a ? a : e.data.notes.get(r);
        return {
          isFocused: 0 === e.ui.dialogs.length && !e.ui.showNoteActions,
          note: o,
          noteId: r,
          notes: e.data.notes,
          searchQuery: e.ui.searchQuery,
          showRenderedView: !(
            null == o ||
            !o.systemTags.includes('markdown') ||
            e.ui.editMode
          ),
        };
      }, f)(E);
    },
    70103: (e, t, n) => {
      'use strict';
      n.d(t, { A: () => i });
      var a = n(63696),
        r = n(14863),
        o = n(4452),
        s = n.n(o);
      const i = (e) => {
        var {
          onSelect: t,
          onRemove: n,
          selected: o = !1,
          interactive: i = !0,
          deleted: l = !1,
          tagName: c,
        } = e;
        return a.createElement(
          'div',
          {
            className: s()('tag-chip', {
              selected: o,
              interactive: i,
              deleted: l,
            }),
            'data-tag-name': c,
            onClick: t,
          },
          c,
          i &&
            (n
              ? a.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'remove-tag-icon',
                    'aria-label': c ? 'Remove tag '.concat(c) : 'Remove tag',
                    title: c ? 'Remove tag "'.concat(c, '"') : 'Remove tag',
                    onClick: (e) => {
                      e.preventDefault(),
                        e.stopPropagation(),
                        void 0 !== c && (null == n || n(c));
                    },
                    onMouseDown: (e) => {
                      e.stopPropagation();
                    },
                  },
                  a.createElement(r.A, null)
                )
              : a.createElement(
                  'span',
                  { className: 'remove-tag-icon', 'aria-hidden': 'true' },
                  a.createElement(r.A, null)
                ))
        );
      };
    },
    255: (e, t, n) => {
      'use strict';
      n.d(t, { A: () => l });
      var a = n(68102),
        r = n(81515),
        o = n(63696),
        s = n(30592),
        i = ['icon', 'title'];
      const l = (e) => {
        var { icon: t, title: n } = e,
          l = (0, r.A)(e, i);
        return o.createElement(
          s.A,
          {
            classes: { tooltip: 'icon-button__tooltip' },
            enterDelay: 200,
            title: n,
          },
          o.createElement(
            'span',
            null,
            o.createElement(
              'button',
              (0, a.A)(
                {
                  'aria-label': n,
                  className: 'icon-button',
                  type: 'button',
                  'data-title': n,
                },
                l
              ),
              t
            )
          )
        );
      };
    },
    38634: (e, t, n) => {
      'use strict';
      n.d(t, { A: () => r });
      var a = n(63696);
      function r() {
        return a.createElement(
          'svg',
          {
            className: 'icon-notes',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          a.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          a.createElement('path', {
            d: 'M19 5V15H9V5H19m0-2H9A2 2 0 0 0 7 5V15a2 2 0 0 0 2 2H19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM5 19V7A2 2 0 0 0 3 9V19a2 2 0 0 0 2 2H15a2 2 0 0 0 2-2ZM17 7H11V9h6Zm0 4H11v2h6Z',
          })
        );
      }
    },
    38711: (e, t, n) => {
      'use strict';
      n.d(t, { A: () => r });
      var a = n(63696);
      function r() {
        return a.createElement(
          'svg',
          {
            className: 'logo',
            width: '96',
            height: '96',
            viewBox: '0 0 176 176',
            role: 'img',
            'aria-label': '1TXT',
          },
          a.createElement(
            'text',
            {
              x: '50%',
              y: '54%',
              textAnchor: 'middle',
              dominantBaseline: 'middle',
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: '92',
              fontWeight: '700',
              fill: 'currentColor',
              letterSpacing: '-3',
            },
            '1T'
          )
        );
      }
    },
    97099: (e, t, n) => {
      'use strict';
      n.d(t, { A: () => r });
      var a = n(63696);
      function r(e) {
        var { onClick: t } = e;
        return a.createElement(
          'svg',
          {
            className: 'icon-trash',
            onClick: t,
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          a.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          a.createElement('path', {
            d: 'M18 21H6c-1.105 0-2-0.895-2-2V9h2v10h12V9h2v10C20 20.105 19.105 21 18 21zM9 9h2v8H9V9zM13 9h2v8h-2V9zM16 5V4c0-1.105-0.895-2-2-2h-4C8.895 2 8 2.895 8 4v1H3v2h18V5H16zM10 4h4v1h-4V4z',
          })
        );
      }
    },
    64784: (e, t, n) => {
      'use strict';
      n.d(t, { A: () => r });
      var a = n(63696);
      function r() {
        return a.createElement(
          'svg',
          {
            className: 'icon-untagged-notes',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          a.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          a.createElement('path', {
            d: 'M15.79 7.21c0.552 0 1 0.448 1 1s-0.448 1-1 1 -1-0.448-1-1S15.238 7.21 15.79 7.21zM11.5 7.48L13.12 6H18v4.88l-1.48 1.62 1.34 1.42L20 11.71V4h-7.71l-2.21 2.14L11.5 7.48zM21 19.59L4.41 3 3 4.41l4.3 4.3L4 12c-0.388 0.39-0.388 1.02 0 1.41L10.59 20c0.39 0.388 1.02 0.388 1.41 0l3.29-3.29 4.3 4.3L21 19.59zM11.28 17.88l-5.16-5.17 2.59-2.59 5.17 5.17L11.28 17.88z',
          })
        );
      }
    },
    45851: (e, t, n) => {
      'use strict';
      n.d(t, { Ff: () => o, nc: () => a, zG: () => r });
      var a = [
          {
            id: 'h1',
            label: 'Heading 1',
            caption: 'H1 Heading',
            snippet: '# ',
            blockLevel: !0,
          },
          {
            id: 'h2',
            label: 'Heading 2',
            caption: 'H2 Heading',
            snippet: '## ',
            blockLevel: !0,
          },
          {
            id: 'h3',
            label: 'Heading 3',
            caption: 'H3 Heading',
            snippet: '### ',
            blockLevel: !0,
          },
          {
            id: 'bold',
            label: 'Bold (Ctrl+B)',
            caption: 'Bold',
            snippet: '**bold text**',
            blockLevel: !1,
            selectionAnchor: [2, 11],
          },
          {
            id: 'italic',
            label: 'Italic (Ctrl+I)',
            caption: 'Italic',
            snippet: '*italic text*',
            blockLevel: !1,
            selectionAnchor: [1, 12],
          },
          {
            id: 'quote',
            label: 'Blockquote',
            caption: 'Quoted text',
            snippet: '> ',
            blockLevel: !0,
          },
          {
            id: 'ul',
            label: 'Bulleted list',
            caption: 'Bulleted list',
            snippet: '- ',
            blockLevel: !0,
          },
          {
            id: 'ol',
            label: 'Numbered list',
            caption: 'Numbered list',
            snippet: '1. ',
            blockLevel: !0,
          },
          {
            id: 'checklist',
            label: 'Task list',
            caption: 'Task list',
            snippet: '- [ ] ',
            blockLevel: !0,
          },
          {
            id: 'inline-code',
            label: 'Inline code',
            caption: 'Inline code',
            snippet: '`code`',
            blockLevel: !1,
            selectionAnchor: [1, 5],
          },
          {
            id: 'code-block',
            label: 'Code block',
            caption: 'Code block',
            snippet: '```\ncode\n```\n',
            blockLevel: !0,
            selectionAnchor: [4, 8],
          },
          {
            id: 'link',
            label: 'Link',
            caption: 'Link',
            snippet: '[text](url)',
            blockLevel: !1,
            selectionAnchor: [7, 10],
          },
          {
            id: 'hr',
            label: 'Horizontal rule',
            caption: 'Horizontal rule',
            snippet: '---\n',
            blockLevel: !0,
          },
        ],
        r = 'insertMarkdown',
        o = (e) => {
          'undefined' != typeof window &&
            window.dispatchEvent(
              new CustomEvent(r, {
                detail: {
                  snippet: e.snippet,
                  blockLevel: e.blockLevel,
                  selectionAnchor: e.selectionAnchor,
                },
              })
            );
        };
    },
    71559: (e, t, n) => {
      'use strict';
      n.d(t, { Sz: () => p, r1: () => h, u: () => m });
      var a = n(41705),
        r = n(16663),
        o = n(48940),
        s = n(62285),
        i = n(16742);
      function l(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function c(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? l(Object(n), !0).forEach(function (t) {
                (0, a.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : l(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t)
                  );
                });
        }
        return e;
      }
      var u = [],
        d = (e) => {
          var t, n, a, r, o, i, l, c, u;
          return {
            content:
              null !==
                (t =
                  null === (n = e.content) || void 0 === n
                    ? void 0
                    : n.toLocaleLowerCase()) && void 0 !== t
                ? t
                : '',
            casedContent: null !== (a = e.content) && void 0 !== a ? a : '',
            tags: new Set(
              null !==
                (r =
                  null === (o = e.tags) || void 0 === o
                    ? void 0
                    : o.map(s.YG)) && void 0 !== r
                ? r
                : []
            ),
            creationDate:
              null !== (i = e.creationDate) && void 0 !== i
                ? i
                : Date.now() / 1e3,
            modificationDate:
              null !== (l = e.modificationDate) && void 0 !== l
                ? l
                : Date.now() / 1e3,
            isPinned:
              null !==
                (c =
                  null === (u = e.systemTags) || void 0 === u
                    ? void 0
                    : u.includes('pinned')) &&
              void 0 !== c &&
              c,
            isTrashed: !!e.deleted,
          };
        },
        m = (e) => {
          for (
            var t, n = /(?:\btag:)([^\s,]+)/g, a = new Set();
            null !== (t = n.exec(e));

          )
            a.add((0, s.YG)(t[1]));
          return a;
        },
        p = () => [],
        h = (e) => {
          var t,
            n,
            a = {
              collection:
                null !==
                  (t =
                    null === (n = e.getState().ui) || void 0 === n
                      ? void 0
                      : n.collection) && void 0 !== t
                  ? t
                  : { type: 'all' },
              excludeIDs: [],
              hasSelectedFirstNote: !1,
              notes: new Map(),
              searchQuery: '',
              searchTags: new Set(),
              searchTerms: [],
              sortType: e.getState().settings.sortType,
              sortReversed: e.getState().settings.sortReversed,
              titleOnly: !1,
            },
            l = [],
            h = [],
            g = [],
            v = (e) => {
              var t = (e) => (t, n) => {
                  var r = a.notes.get(t),
                    o = a.notes.get(n);
                  if (!r || !o) return t.localeCompare(n);
                  if (r.isPinned !== o.isPinned) return r.isPinned ? -1 : 1;
                  var s = e(r, o);
                  return 0 !== s ? s : t.localeCompare(n);
                },
                n = t((e, t) => e.casedContent.localeCompare(t.casedContent)),
                r = t((e, t) => t.creationDate - e.creationDate),
                o = t((e, t) => t.modificationDate - e.modificationDate),
                s = (e, t, n, a, r) => {
                  if (a >= r) return a;
                  var o = Math.floor((a + r) / 2),
                    i = n(t, e[o]);
                  return i < 0
                    ? s(e, t, n, a, o)
                    : i > 0
                      ? s(e, t, n, o + 1, r)
                      : o;
                };
              [
                [l, n],
                [h, r],
                [g, o],
              ].forEach((t) => {
                var [n, a] = t,
                  r = n.indexOf(e);
                r > -1 && n.splice(r, 1);
                var o = s(n, e, a, 0, n.length);
                n.splice(o, 0, e);
              });
            },
            E = function () {
              for (
                var t =
                    arguments.length > 0 && void 0 !== arguments[0]
                      ? arguments[0]
                      : {},
                  n =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : 1 / 0,
                  {
                    collection: r,
                    excludeIDs: o,
                    notes: u,
                    searchTags: d,
                    searchTerms: m,
                    sortReversed: p,
                    sortType: v,
                    titleOnly: E,
                  } = c(c({}, a), t),
                  f = new Set(),
                  y = new Set(),
                  N = e.getState().data.notes,
                  b = 'alphabetical' === v ? l : 'creationDate' === v ? h : g,
                  T = function () {
                    var e = b[p ? b.length - w - 1 : w];
                    if (null != o && o.includes(e)) return 0;
                    var t = u.get(e);
                    if (!t || !N.has(e)) return 0;
                    if (('trash' === r.type) !== t.isTrashed) return 0;
                    if (
                      ('untagged' === r.type || d.has((0, s.YG)('untagged'))) &&
                      t.tags.size
                    )
                      return 0;
                    var n = !0;
                    for (var a of d.values())
                      if ('untagged' !== a && !t.tags.has(a)) {
                        n = !1;
                        break;
                      }
                    if (!n) return 0;
                    var l = 'tag' === r.type && (0, s.YG)(r.tagName);
                    if (0 === m.length && 0 === d.size && l && !t.tags.has(l))
                      return 0;
                    var c = E ? (0, i.LK)(t.content) : t.content;
                    if (
                      m.length > 0 &&
                      !m.every((e) => c.includes(e.toLocaleLowerCase()))
                    )
                      return 0;
                    t.isPinned ? y.add(e) : f.add(e);
                  },
                  w = 0;
                w < b.length && y.size + f.size <= n;
                w++
              )
                T();
              return [...y.values(), ...f.values()];
            };
          p = (t, n) => E(t, n).map((t) => [t, e.getState().data.notes.get(t)]);
          var f = (t) => {
              var { data: n } = e.getState(),
                { searchQuery: o } = a,
                s = (0, r._N)(n.tags, n.noteTags, o);
              return { noteIds: t, tagHashes: s.length > 0 ? s : u };
            },
            y = (e) =>
              c(
                c({}, e),
                {},
                { meta: c(c({}, e.meta), {}, { searchResults: f(E()) }) }
              ),
            N = (t, n) => {
              var a,
                r,
                o,
                {
                  ui: { filteredNotes: s, openedNote: i },
                } = e.getState();
              if (!i || i !== t) return n;
              var l = s.findIndex((e) => e === i),
                u =
                  -1 === l
                    ? null !== (a = s[0]) && void 0 !== a
                      ? a
                      : null
                    : null !==
                          (r =
                            null !== (o = s[l + 1]) && void 0 !== o
                              ? o
                              : s[l - 1]) && void 0 !== r
                      ? r
                      : null;
              return c(
                c({}, n),
                {},
                { meta: c(c({}, n.meta), {}, { nextNoteToOpen: u }) }
              );
            },
            b = null,
            T = () => {
              clearTimeout(b),
                (b = setTimeout(() => {
                  var t = f(E());
                  e.dispatch(
                    c(
                      c({ type: 'FILTER_NOTES' }, t),
                      {},
                      { meta: { searchResults: t } }
                    )
                  );
                }, 30));
            };
          return (
            e.getState().data.notes.forEach((e, t) => {
              a.notes.set(t, d(e)), v(t);
            }),
            T(),
            (t) => (n) => {
              var r,
                i,
                u,
                p,
                E,
                f = (e) => {
                  var n, r;
                  return !a.hasSelectedFirstNote &&
                    null !== (n = e.meta) &&
                    void 0 !== n &&
                    null !== (n = n.searchResults) &&
                    void 0 !== n &&
                    n.noteIds.length
                    ? ((a.hasSelectedFirstNote = !0),
                      t(
                        c(
                          c({}, e),
                          {},
                          {
                            meta: c(
                              c({}, e.meta),
                              {},
                              {
                                nextNoteToOpen:
                                  null === (r = e.meta) || void 0 === r
                                    ? void 0
                                    : r.searchResults.noteIds[0],
                              }
                            ),
                          }
                        )
                      ))
                    : t(e);
                };
              switch (n.type) {
                case 'ADD_NOTE_TAG':
                  var b = a.notes.get(n.noteId);
                  return b
                    ? (b.tags.add((0, s.YG)(n.tagName)),
                      (b.modificationDate = Date.now() / 1e3),
                      v(n.noteId),
                      f(y(n)))
                    : f(n);
                case 'CREATE_NOTE_WITH_ID':
                  return (
                    null !== (r = n.note) &&
                    void 0 !== r &&
                    r.tags &&
                    (null === (i = n.note) || void 0 === i
                      ? void 0
                      : i.tags.length) > 0
                      ? (a.collection = {
                          type: 'tag',
                          tagName: n.note.tags[0],
                        })
                      : (a.collection = { type: 'all' }),
                    a.notes.set(
                      n.noteId,
                      d(null !== (u = n.note) && void 0 !== u ? u : {})
                    ),
                    v(n.noteId),
                    T(),
                    f(n)
                  );
                case 'IMPORT_NOTE_WITH_ID':
                case 'REMOTE_NOTE_UPDATE':
                case 'RESTORE_NOTE_REVISION':
                  return (
                    a.notes.set(
                      n.noteId,
                      d(null !== (p = n.note) && void 0 !== p ? p : {})
                    ),
                    v(n.noteId),
                    T(),
                    f(n)
                  );
                case 'DELETE_NOTE_FOREVER':
                case 'REMOTE_NOTE_DELETE_FOREVER':
                  return (
                    a.notes.delete(n.noteId),
                    (E = n.noteId),
                    [l, h, g].forEach((e) => {
                      var t = e.indexOf(E);
                      t > -1 && e.splice(t, 1);
                    }),
                    f(N(n.noteId, y(n)))
                  );
                case 'EDIT_NOTE':
                  var w = a.notes.get(n.noteId);
                  return (
                    void 0 !== n.changes.content &&
                      ((w.content = n.changes.content.toLocaleLowerCase()),
                      (w.casedContent = n.changes.content)),
                    void 0 !== n.changes.tags &&
                      (w.tags = new Set(n.changes.tags.map(s.YG))),
                    void 0 !== n.changes.creationDate &&
                      (w.creationDate = n.changes.creationDate),
                    (w.modificationDate =
                      void 0 !== n.changes.modificationDate
                        ? n.changes.modificationDate
                        : Date.now() / 1e3),
                    void 0 !== n.changes.deleted &&
                      (w.isTrashed = !!n.changes.deleted),
                    void 0 !== n.changes.systemTags &&
                      (w.isPinned = n.changes.systemTags.includes('pinned')),
                    v(n.noteId),
                    f(y(n))
                  );
                case 'OPEN_TAG':
                  return (
                    (a.collection = { type: 'tag', tagName: n.tagName }),
                    f(y(n))
                  );
                case 'PIN_NOTE':
                  var _ = a.notes.get(n.noteId);
                  return _
                    ? ((_.isPinned = n.shouldPin),
                      (_.modificationDate = Date.now() / 1e3),
                      v(n.noteId),
                      f(y(n)))
                    : f(n);
                case 'REMOVE_NOTE_TAG':
                  var O = a.notes.get(n.noteId);
                  return O
                    ? (O.tags.delete((0, s.YG)(n.tagName)),
                      (O.modificationDate = Date.now() / 1e3),
                      v(n.noteId),
                      f(y(n)))
                    : f(n);
                case 'RENAME_TAG':
                  var S = (0, s.YG)(n.oldTagName),
                    A = (0, s.YG)(n.newTagName);
                  return (
                    'tag' === a.collection.type &&
                      a.collection.tagName === n.oldTagName &&
                      (a.collection = { type: 'tag', tagName: n.newTagName }),
                    a.notes.forEach((e, t) => {
                      e.tags.has(S) &&
                        (e.tags.delete(S),
                        e.tags.add(A),
                        (e.modificationDate = Date.now() / 1e3),
                        v(t));
                    }),
                    f(y(n))
                  );
                case 'RESTORE_NOTE':
                  var C = a.notes.get(n.noteId);
                  return C
                    ? ((C.isTrashed = !1),
                      (C.modificationDate = Date.now() / 1e3),
                      v(n.noteId),
                      f(N(n.noteId, y(n))))
                    : f(n);
                case 'SELECT_TRASH':
                  return (a.collection = { type: 'trash' }), f(y(n));
                case 'SHOW_ALL_NOTES':
                  return (a.collection = { type: 'all' }), f(y(n));
                case 'SHOW_UNTAGGED_NOTES':
                  return (a.collection = { type: 'untagged' }), f(y(n));
                case 'SEARCH':
                  return (
                    (a.searchQuery = n.searchQuery),
                    (a.searchTerms = (0, o.S)(n.searchQuery)),
                    (a.searchTags = m(n.searchQuery)),
                    f(y(n))
                  );
                case 'setSortReversed':
                  return (a.sortReversed = n.sortReversed), f(y(n));
                case 'setSortType':
                  return (
                    (a.sortType = n.sortType),
                    void 0 !== n.sortReversed &&
                      (a.sortReversed = n.sortReversed),
                    f(y(n))
                  );
                case 'TOGGLE_SORT_ORDER':
                  return (a.sortReversed = !a.sortReversed), f(y(n));
                case 'TRASH_NOTE':
                  var I = a.notes.get(n.noteId);
                  return I
                    ? ((I.isTrashed = !0),
                      (I.modificationDate = Date.now() / 100),
                      v(n.noteId),
                      f(N(n.noteId, y(n))))
                    : f(n);
                case 'TRASH_TAG':
                  var R = (0, s.YG)(n.tagName);
                  return (
                    a.notes.forEach((e, t) => {
                      e.tags.has(R) &&
                        (e.tags.delete(R),
                        (e.modificationDate = Date.now() / 1e3),
                        v(t));
                    }),
                    'tag' === a.collection.type &&
                    a.collection.tagName !== n.tagName
                      ? f(n)
                      : ('untagged' === a.collection.type &&
                          e.getState().data.tags.size <= 1 &&
                          (a.collection = { type: 'all' }),
                        f(y(n)))
                  );
              }
              return f(n);
            }
          );
        };
    },
    61943: (e, t, n) => {
      'use strict';
      n.d(t, { A: () => b });
      var a = {};
      n.r(a), n.d(a, { recordEvent: () => l, withEvent: () => i });
      var r = {};
      n.r(r),
        n.d(r, {
          addCollaborator: () => c,
          editNote: () => u,
          exportNotes: () => d,
          importNote: () => m,
          markdownNote: () => p,
          pinNote: () => h,
          publishNote: () => g,
          removeCollaborator: () => v,
          renameTag: () => E,
        });
      var o = {};
      n.r(o), n.d(o, { reallyCloseWindow: () => f });
      var s = {};
      n.r(s), n.d(s, { remoteNoteUpdate: () => N });
      var i = (e, t) => (e) => e,
        l = (e, t) => ({
          type: 'RECORD_EVENT',
          eventName: e,
          eventProperties: t,
        }),
        c = (e, t) => ({
          type: 'ADD_COLLABORATOR',
          noteId: e,
          collaboratorAccount: t,
        }),
        u = (e, t) => ({ type: 'EDIT_NOTE', noteId: e, changes: t }),
        d = () => ({ type: 'EXPORT_NOTES' }),
        m = (e) => ({ type: 'IMPORT_NOTE', note: e }),
        p = (e, t) => ({
          type: 'MARKDOWN_NOTE',
          noteId: e,
          shouldEnableMarkdown: t,
        }),
        h = (e, t) => ({ type: 'PIN_NOTE', noteId: e, shouldPin: t }),
        g = (e, t) => ({ type: 'PUBLISH_NOTE', noteId: e, shouldPublish: t }),
        v = (e, t) => ({
          type: 'REMOVE_COLLABORATOR',
          noteId: e,
          collaboratorAccount: t,
        }),
        E = (e, t) => ({ type: 'RENAME_TAG', oldTagName: e, newTagName: t }),
        f = () => ({ type: 'REALLY_CLOSE_WINDOW' }),
        y = n(69343),
        N = (e, t) => ({ type: 'REMOTE_NOTE_UPDATE', noteId: e, note: t });
      const b = {
        analytics: a,
        data: r,
        electron: o,
        simperium: s,
        settings: y,
        ui: n(27528),
      };
    },
    1962: (e, t, n) => {
      'use strict';
      n.d(t, {
        AK: () => m,
        Iy: () => h,
        O4: () => c,
        Q5: () => p,
        Qv: () => l,
        R_: () => g,
        Yt: () => u,
        g7: () => E,
        hf: () => d,
        nn: () => v,
        qB: () => f,
      });
      var a = n(41705),
        r = n(59874),
        o = n(62285);
      function s(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      function i(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? s(Object(n), !0).forEach(function (t) {
                (0, a.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : s(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t)
                  );
                });
        }
        return e;
      }
      var l = (e) => e.browser.windowWidth <= 750,
        c = (e) =>
          'system' === e.settings.theme
            ? e.browser.systemTheme
            : e.settings.theme,
        u = (e, t) =>
          !!(
            e &&
            t &&
            e.content === t.content &&
            e.creationDate === t.creationDate &&
            e.modificationDate === t.modificationDate &&
            !!e.deleted == !!t.deleted &&
            e.publishURL === t.publishURL &&
            e.shareURL === t.shareURL &&
            e.tags.length === t.tags.length &&
            e.systemTags.length === t.systemTags.length &&
            e.tags.every((e) => t.tags.includes(e)) &&
            e.systemTags.every((e) => t.systemTags.includes(e))
          ),
        d = (e, t) => e.simperium.pendingChanges.has(t),
        m = (e) => {
          var {
            data: { accountVerification: t },
          } = e;
          return 'unverified' === t || 'pending' === t;
        },
        p = (e) => {
          var {
            ui: { collection: t },
          } = e;
          return ('tag' === t.type && t.tagName) || null;
        },
        h = (e) => {
          var {
            ui: { collection: t },
          } = e;
          return 'trash' === t.type;
        },
        g = (e, t) =>
          void 0 !==
          e.ui.dialogs.find((e) => {
            var { type: n } = e;
            return n === t;
          }),
        v = (e) => {
          var { data: t } = e;
          return [...t.tags.values()].filter((e) => !(0, r.A)(e.name)).length;
        },
        E = (e, t) => {
          var { data: n } = e;
          return t.tags.filter((e) => !(0, r.A)(e));
        },
        f = (e, t, n, a) => {
          var s = e.data.notes.get(t),
            l = e.data.noteRevisions.get(t),
            c = null == l ? void 0 : l.get(n);
          if (!s || !c) return null;
          var u = s.tags.filter((e) => (0, r.A)(e)),
            d = c.tags.filter((t) => {
              var n = (0, o.YG)(t),
                s = e.data.tags.has(n);
              return !(0, r.A)(t) && (s || a);
            });
          return i(
            i({}, c),
            {},
            { tags: [...u, ...d], systemTags: s.systemTags }
          );
        };
    },
    69343: (e, t, n) => {
      'use strict';
      n.r(t),
        n.d(t, {
          activateTheme: () => a,
          setAccountName: () => u,
          setLineLength: () => o,
          setNoteDisplay: () => r,
          setSortType: () => l,
          toggleAutoHideMenuBar: () => h,
          toggleFocusMode: () => d,
          toggleKeyboardShortcuts: () => s,
          togglePreviewButton: () => p,
          toggleSortOrder: () => i,
          toggleSortTagsAlpha: () => c,
          toggleSpellCheck: () => m,
        });
      var a = (e) => ({ type: 'setTheme', theme: e }),
        r = (e) => ({ type: 'setNoteDisplay', noteDisplay: e }),
        o = (e) => ({ type: 'setLineLength', lineLength: e }),
        s = () => ({ type: 'KEYBOARD_SHORTCUTS_TOGGLE' }),
        i = () => ({ type: 'TOGGLE_SORT_ORDER' }),
        l = (e, t) => ({ type: 'setSortType', sortType: e, sortReversed: t }),
        c = () => ({ type: 'TOGGLE_SORT_TAGS_ALPHA' }),
        u = (e) => ({ type: 'setAccountName', accountName: e }),
        d = () => ({ type: 'TOGGLE_FOCUS_MODE' }),
        m = () => ({ type: 'TOGGLE_SPELLCHECK' }),
        p = () => ({ type: 'TOGGLE_PREVIEW_BUTTON' }),
        h = () => ({ type: 'TOGGLE_AUTO_HIDE_MENU_BAR' });
    },
    27528: (e, t, n) => {
      'use strict';
      n.r(t),
        n.d(t, {
          closeDialog: () => o,
          closeNote: () => s,
          closeNoteActions: () => i,
          closeWindow: () => l,
          createNote: () => c,
          deleteOpenNoteForever: () => d,
          dismissEmailVerifyDialog: () => u,
          emptyTrash: () => m,
          filterNotes: () => p,
          focusSearchField: () => h,
          hideAlternateLoginPrompt: () => A,
          logout: () => g,
          openNote: () => v,
          openTag: () => E,
          reallyLogOut: () => f,
          restoreOpenNote: () => y,
          search: () => k,
          selectNote: () => D,
          selectNoteAbove: () => N,
          selectNoteBelow: () => b,
          selectTrash: () => T,
          showAllNotes: () => w,
          showAlternateLoginPrompt: () => S,
          showDialog: () => O,
          showUntaggedNotes: () => _,
          storeRevisions: () => C,
          toggleEditMode: () => L,
          toggleNavigation: () => M,
          toggleNoteActions: () => P,
          toggleNoteInfo: () => G,
          toggleNoteList: () => x,
          toggleRestoringDeletedTags: () => R,
          toggleRevisions: () => I,
          toggleTagDrawer: () => H,
          toggleTagEditing: () => V,
          trashOpenNote: () => F,
        });
      var a = n(41705);
      function r(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          t &&
            (a = a.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, a);
        }
        return n;
      }
      var o = () => ({ type: 'CLOSE_DIALOG' }),
        s = () => ({ type: 'CLOSE_NOTE' }),
        i = () => ({ type: 'NOTE_ACTIONS_CLOSE' }),
        l = () => ({ type: 'CLOSE_WINDOW' }),
        c = (e) => ({ type: 'CREATE_NOTE', note: e }),
        u = () => ({ type: 'UPDATE_ACCOUNT_VERIFICATION', state: 'dismissed' }),
        d = () => ({ type: 'DELETE_OPEN_NOTE_FOREVER' }),
        m = () => ({ type: 'EMPTY_TRASH' }),
        p = (e, t) => ({ type: 'FILTER_NOTES', noteIds: e, tagHashes: t }),
        h = () => ({ type: 'FOCUS_SEARCH_FIELD' }),
        g = () => ({ type: 'LOGOUT' }),
        v = (e) => ({ type: 'OPEN_NOTE', noteId: e }),
        E = (e) => ({ type: 'OPEN_TAG', tagName: e }),
        f = () => ({ type: 'REALLY_LOG_OUT' }),
        y = () => ({ type: 'RESTORE_OPEN_NOTE' }),
        N = () => ({ type: 'SELECT_NOTE_ABOVE' }),
        b = () => ({ type: 'SELECT_NOTE_BELOW' }),
        T = () => ({ type: 'SELECT_TRASH' }),
        w = () => ({ type: 'SHOW_ALL_NOTES' }),
        _ = () => ({ type: 'SHOW_UNTAGGED_NOTES' }),
        O = function (e) {
          return (function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? r(Object(n), !0).forEach(function (t) {
                    (0, a.A)(e, t, n[t]);
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(
                      e,
                      Object.getOwnPropertyDescriptors(n)
                    )
                  : r(Object(n)).forEach(function (t) {
                      Object.defineProperty(
                        e,
                        t,
                        Object.getOwnPropertyDescriptor(n, t)
                      );
                    });
            }
            return e;
          })(
            { type: 'SHOW_DIALOG', name: e },
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
          );
        },
        S = (e) => ({ type: 'SHOW_ALTERNATE_LOGIN_PROMPT', email: e }),
        A = (e) => ({ type: 'HIDE_ALTERNATE_LOGIN_PROMPT', email: e }),
        C = (e, t) => ({ type: 'STORE_REVISIONS', noteId: e, revisions: t }),
        I = () => ({ type: 'REVISIONS_TOGGLE' }),
        R = () => ({ type: 'TOGGLE_RESTORING_DELETED_TAGS' }),
        k = (e) => ({ type: 'SEARCH', searchQuery: e }),
        D = (e) => ({ type: 'SELECT_NOTE', noteId: e }),
        L = () => ({ type: 'TOGGLE_EDIT_MODE' }),
        M = () => ({ type: 'NAVIGATION_TOGGLE' }),
        x = () => ({ type: 'NOTE_LIST_TOGGLE' }),
        P = () => ({ type: 'NOTE_ACTIONS_TOGGLE' }),
        G = () => ({ type: 'NOTE_INFO_TOGGLE' }),
        H = (e) => ({ type: 'TAG_DRAWER_TOGGLE', show: e }),
        V = () => ({ type: 'TAG_EDITING_TOGGLE' }),
        F = () => ({ type: 'TRASH_OPEN_NOTE' });
    },
    16663: (e, t, n) => {
      'use strict';
      n.d(t, { Ay: () => u, _N: () => c });
      var a = n(41705),
        r = n(63696),
        o = n(80249),
        s = n(27528),
        i = n(62285);
      class l extends r.Component {
        constructor() {
          super(...arguments),
            (0, a.A)(this, 'updateSearch', (e) => {
              var { searchQuery: t, onSearch: n } = this.props,
                a = t.trim().split(' ');
              a.splice(-1, 1, e);
              var r = a.join(' ');
              n((r += ' '));
            });
        }
        render() {
          var { filteredTags: e, tags: t } = this.props;
          return r.createElement(
            r.Fragment,
            null,
            e.length > 0 &&
              r.createElement(
                'div',
                { className: 'tag-suggestions' },
                r.createElement(
                  'div',
                  { className: 'note-list-header' },
                  'Search by Tag'
                ),
                r.createElement(
                  'ul',
                  { className: 'tag-suggestions-list' },
                  e.map((e) => {
                    var n = 'untagged' === e ? 'untagged' : t.get(e).name;
                    return r.createElement(
                      'li',
                      {
                        key: e,
                        id: e,
                        className: 'tag-suggestion-row',
                        onClick: () => this.updateSearch('tag:'.concat(n)),
                      },
                      r.createElement(
                        'div',
                        { className: 'tag-suggestion', title: n },
                        'tag:',
                        n
                      )
                    );
                  })
                )
              )
          );
        }
      }
      (0, a.A)(l, 'displayName', 'TagSuggestions');
      var c = (e, t, n) => {
        var a = n.trim().split(' ').pop();
        if (!a) return [];
        var r = (0, i.YG)(a),
          o =
            a.startsWith('tag:') && a.length > 4 ? (0, i.YG)(a.slice(4)) : null,
          s = (e) => !(!o || e === o || !e.startsWith(o)) || e.includes(r),
          l = [];
        for (var c of e.keys()) s(c) && l.push(c);
        return (
          n.includes('tag:') ||
            (s((0, i.YG)('untagged')) && l.push((0, i.YG)('untagged'))),
          l
            .sort((e, n) => {
              var a,
                o,
                s,
                i,
                l = e.startsWith(r);
              if (l !== n.startsWith(r)) return l ? -1 : 1;
              var c =
                  null !==
                    (a =
                      null === (o = t.get(e)) || void 0 === o
                        ? void 0
                        : o.size) && void 0 !== a
                    ? a
                    : 0,
                u =
                  null !==
                    (s =
                      null === (i = t.get(n)) || void 0 === i
                        ? void 0
                        : i.size) && void 0 !== s
                    ? s
                    : 0;
              return c !== u ? u - c : e.localeCompare(n);
            })
            .slice(0, 5)
        );
      };
      const u = (0, o.Ng)(
        (e) => {
          var {
            data: t,
            ui: { searchQuery: n, tagSuggestions: a },
          } = e;
          return { filteredTags: a, searchQuery: n, tags: t.tags };
        },
        (e) => ({
          onSearch: (t) => {
            e((0, s.search)(t));
          },
        })
      )(l);
    },
    48940: (e, t, n) => {
      'use strict';
      n.d(t, { C: () => a, S: () => r });
      var a = (e) => e.replace(/(?:\btag:)([^\s,]+)/g, '').trim(),
        r = (e) => {
          if (!e) return [];
          for (
            var t,
              n = /(?:")((?:"|[^"])+?)(?:")/g,
              r = 0,
              o = '',
              s = a(e),
              i = [];
            null !== (t = n.exec(s));

          )
            i.push(t[0].slice(1, -1)),
              (o += s.slice(r, t.index)),
              (r = n.lastIndex);
          (r > 0 || 0 === i.length) && r < s.length && (o += s.slice(r));
          var l = o
            .split(/[\b\s]/g)
            .map((e) => e.trim())
            .filter((e) => e);
          return [...i, ...l];
        };
    },
    59874: (e, t, n) => {
      'use strict';
      n.d(t, { A: () => r });
      var a = /^(?:[^@]+)@(?:.+)(?:\.[^.]{2,})$/;
      const r = (e) => a.test(e);
    },
    16742: (e, t, n) => {
      'use strict';
      n.d(t, { Ay: () => d, Cb: () => u, LK: () => i });
      var a = n(66701),
        r = n.n(a),
        o = n(17243),
        s = n(48940),
        i = (e) => {
          var t = new RegExp('\\s*([^\n]{1,'.concat(64, '})'), 'g').exec(e);
          if (!t) return 'New Note…';
          var [, n] = t;
          return n;
        },
        l = (e, t) => {
          return e
            ? ((n = t),
              r()(n.replace(/(\s)\s+/g, '$1'), { stripListLeaders: !1 }) || t)
            : t;
          var n;
        },
        c = new Map(),
        u = (e, t) => {
          var n = (function (e) {
              return e.systemTags.includes('markdown');
            })(e),
            a = c.get(e.content);
          if (a) {
            var [r, u, d] = a;
            if (u === n && d === t) return r;
          }
          var m = e.content || '',
            p = l(n, i(m)),
            h = l(
              n,
              ((e, t) => {
                var n,
                  a = '',
                  r = 0;
                if (null != t && t.trim()) {
                  var l = (0, s.S)(t);
                  if (l.length > 0) {
                    var c = l[0].toLocaleLowerCase(),
                      u = 30 - c.length,
                      d = new RegExp(
                        '(?:\\s|^)[^\n]{0,' +
                          u +
                          '}' +
                          (0, o.escapeRegExp)(c) +
                          '.{0,200}(?=\\s|$)',
                        'ims'
                      ).exec(e);
                    if (d && d.length > 0)
                      return 56320 <=
                        (n = (a = d[0]
                          .split('\n')
                          .filter((t) => '\r' !== t && '' !== t && t !== i(e))
                          .join('\n')).charCodeAt(0)) && n <= 57343
                        ? a.slice(1)
                        : a;
                  }
                }
                var m = e.indexOf('\n');
                if (-1 === m) return '';
                for (; m > -1 && r < 3; ) {
                  var p = e.indexOf('\n', m);
                  if (-1 === p) return a + e.slice(m).trim();
                  var h = e.slice(m, p).trim();
                  h && ((a += h + '\n'), r++), (m = p + 1);
                }
                return a.trim();
              })(m, t)
            ),
            g = { title: p, preview: h };
          return c.set(e.content, [g, n, t]), g;
        };
      const d = u;
    },
    62285: (e, t, n) => {
      'use strict';
      n.d(t, {
        Fk: () => o,
        Rd: () => s,
        YG: () => r,
        nb: () => i,
        oH: () => a,
      });
      var a = 256,
        r = (e) => {
          var t = e.normalize('NFC').toLocaleLowerCase('en-US');
          return encodeURIComponent(t).replace(
            /[!'()*\-_~.]/g,
            (e) => '%' + e.charCodeAt(0).toString(16).toUpperCase()
          );
        },
        o = (e) => decodeURIComponent(e),
        s = (e, t) => {
          var n = r(t);
          return e.findIndex((e) => r(e) === n) > -1 ? e : [...e, t];
        },
        i = (e, t) => {
          var n = r(t);
          for (var a of e) if (r(a) === n) return e.filter((e) => r(e) !== n);
          return e;
        };
    },
    51938: (e, t, n) => {
      'use strict';
      n.d(t, { Dm: () => a, TC: () => o, yK: () => r });
      var a = /^(\s*)- \[( |x|X)\](\s)/gm,
        r = (e) =>
          e.replace(a, (e, t, n, a) => t + (' ' === n ? '' : '') + a),
        o = (e) =>
          e.replace(/\ue000|\ue001/g, (e) => ('' === e ? '- [ ]' : '- [x]'));
    },
    37453: (e, t, n) => {
      'use strict';
      n.d(t, { i: () => l });
      var a,
        r,
        o = n(17243),
        s = ['http:', 'https:', 'mailto:'],
        i = {
          isRunningElectron: (r =
            window && (0, o.has)(window, 'process.versions.electron')),
          openExternalUrl: r
            ? (a = window.require('electron').shell).openExternal.bind(a)
            : window.open.bind(window),
        },
        l = (e) => {
          try {
            var t = new URL(e).protocol;
            if (!s.some((e) => e === t)) return;
          } catch (e) {
            return;
          }
          i.openExternalUrl(e);
        };
    },
    51800: () => {},
    28034: () => {},
  },
]);
