'use strict';
(self.webpackChunk = self.webpackChunk || []).push([
  [5368],
  {
    61716: (e, t, n) => {
      n.r(t), n.d(t, { NoteList: () => j, default: () => Q });
      var a = n(41705),
        s = n(63696),
        o = n(27478),
        l = n(4452),
        r = n.n(l),
        i = n(80249),
        c = n(38634);
      function u() {
        return s.createElement(
          'svg',
          {
            className: 'icon-tag',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
          },
          s.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '24',
            height: '24',
          }),
          s.createElement('path', {
            d: 'M18.29 5.71v5.17l-7 7L6.12 12.71l7-7h5.17m2-2h-8L4 12a1 1 0 0 0 0 1.41L10.59 20A1 1 0 0 0 12 20l8.29-8.29v-8Zm-4.5 5.5a1 1 0 1 0-1-1A1 1 0 0 0 15.79 9.21Z',
          })
        );
      }
      var h = n(97099),
        d = n(64784),
        m = n(61943);
      const p = () => {
        var e = (0, i.d4)((e) => e.ui.collection),
          t = (0, i.d4)((e) => e.ui.hasLoadedNotes),
          n = (0, i.d4)((e) => e.ui.searchQuery),
          a = (0, i.wA)(),
          o = () =>
            n.length
              ? s.createElement(
                  'button',
                  { onClick: () => a(m.A.ui.createNote({ content: n })) },
                  'Create a new note titled "',
                  n,
                  '"'
                )
              : s.createElement(
                  'button',
                  { onClick: () => a(m.A.ui.createNote()) },
                  'Create your first note'
                ),
          {
            message: l,
            icon: r,
            button: p,
          } = ((e) => {
            var { collection: t, searchQuery: n } = e;
            if (n.length > 0)
              return { message: 'No Results', icon: null, button: o() };
            switch (t.type) {
              case 'tag':
                return {
                  message: 'No notes tagged "'.concat(t.tagName, '"'),
                  icon: s.createElement(u, null),
                  button: null,
                };
              case 'trash':
                return {
                  message: 'Your trash is empty',
                  icon: s.createElement(h.A, null),
                  button: null,
                };
              case 'untagged':
                return {
                  message: 'No untagged notes',
                  icon: s.createElement(d.A, null),
                  button: null,
                };
              default:
                return {
                  message: '',
                  icon: s.createElement(c.A, null),
                  button: o(),
                };
            }
          })({ collection: e, searchQuery: n });
        return s.createElement(
          'div',
          { className: 'note-list-placeholder' },
          s.createElement('div', { className: 'no-notes-icon' }, r),
          s.createElement('div', { className: 'no-notes-message' }, l),
          s.createElement('div', { className: 'no-notes-button' }, t && p)
        );
      };
      function g() {
        return s.createElement(
          'svg',
          {
            className: 'icon-published-small',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 16 16',
          },
          s.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '16',
            height: '16',
          }),
          s.createElement('path', {
            d: 'M7.38 10.25L5.13 8.11l1.03-1.09 1.2 1.15 2.46-2.42 1.05 1.07L7.38 10.25zM13 0.93H3c-0.828 0-1.5 0.672-1.5 1.5l0 0v10.14c0 0.828 0.672 1.5 1.5 1.5h10c0.828 0 1.5-0.672 1.5-1.5V2.43C14.5 1.602 13.828 0.93 13 0.93L13 0.93zM3.5 12.07V4h9v8.07H3.5z',
          })
        );
      }
      function y() {
        return s.createElement(
          'svg',
          {
            className: 'icon-pinned-small',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 16 16',
          },
          s.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '16',
            height: '16',
          }),
          s.createElement('path', {
            d: 'M4.41 10.17l-4-4 5.65-0.52L8.65 3.1 7.24 1.69l1.42-1.42 7.07 7.07 -1.42 1.42 -1.42-1.43 -2.56 2.58 -0.52 5.66 -4-4L3 14.41 1.59 13 4.41 10.17zM8.21 11.17L8.4 9l3.07-3.1 -1.4-1.41L7 7.6 4.87 7.79 8.21 11.17z',
          })
        );
      }
      function w() {
        return s.createElement(
          'svg',
          {
            className: 'icon-sync-small',
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 16 16',
          },
          s.createElement('rect', {
            x: '0',
            fill: 'none',
            width: '16',
            height: '16',
          }),
          s.createElement('path', {
            d: 'M14 2v5h-0.09 -2.05H9l1.82-1.82C10.1 4.46 9.11 4 8 4 6.14 4 4.59 5.28 4.14 7H2.09C2.57 4.17 5.03 2 8 2c1.65 0 3.14 0.69 4.22 1.78L14 2zM8 12c-1.11 0-2.1-0.46-2.82-1.18L7 9H4.14 2.09 2v5l1.78-1.78C4.86 13.31 6.35 14 8 14c2.97 0 5.43-2.17 5.91-5h-2.05C11.41 10.72 9.86 12 8 12z',
          })
        );
      }
      var v = n(17243),
        N = n(73467),
        E = n.n(N),
        f = n(48940),
        b = (e, t) =>
          e.length > 0 && t.length > 0
            ? e
                .reduce((e, t) => {
                  var { filter: n, replacer: a } = t,
                    s = 'string' == typeof n && (0, f.C)(n),
                    o =
                      s && s.length > 0
                        ? new RegExp((0, v.escapeRegExp)(s), 'gi')
                        : n;
                  return E()(e, o, a);
                }, t)
                .map((e, t) =>
                  e && 'string' != typeof e ? s.cloneElement(e, { key: t }) : e
                )
            : t,
        x = (e) => ({
          filter: e,
          replacer: (e) => {
            if (e.length)
              return s.createElement('span', { className: 'search-match' }, e);
          },
        }),
        A = n(16742),
        C = n(51938),
        S = n(1962);
      class k extends s.Component {
        constructor(e) {
          super(e), (this.createdAt = Date.now());
        }
        componentDidUpdate(e) {
          var t, n;
          (null === (t = e.note) || void 0 === t ? void 0 : t.content) !==
            (null === (n = this.props.note) || void 0 === n
              ? void 0
              : n.content) && this.props.invalidateHeight(),
            this.props.lastUpdated < 1e3 &&
              !this.updateScheduled &&
              (this.updateScheduled = setTimeout(
                () => this.forceUpdate(),
                1e3
              ));
        }
        componentWillUnmount() {
          clearTimeout(this.updateScheduled);
        }
        render() {
          var {
            displayMode: e,
            hasPendingChanges: t,
            isOffline: n,
            isOpened: a,
            lastSyncedAt: o,
            lastUpdated: l,
            noteId: i,
            note: c,
            openNote: u,
            pinNote: h,
            searchQuery: d,
            style: m,
          } = this.props;
          if (!c) return s.createElement('div', null, "Couldn't find note");
          var p,
            { title: v, preview: N } = (0, A.Cb)(c, d),
            E = c.systemTags.includes('pinned'),
            S = !!c.publishURL,
            k = l - this.createdAt > 1e3 && Date.now() - l < 1200,
            L = r()('note-list-item', {
              'note-list-item-selected': a,
              'note-list-item-pinned': E,
              'note-recently-updated': k,
              'published-note': S,
            }),
            D = r()('note-list-item-pinner', { 'note-list-item-pinned': E }),
            O = E ? 'Unpin note '.concat(v) : 'Pin note '.concat(v),
            M = (0, f.S)(d).map(x);
          return s.createElement(
            'div',
            { style: m, className: L, role: 'row' },
            s.createElement(
              'div',
              { className: 'note-list-item-content', role: 'cell' },
              s.createElement(
                'div',
                { className: 'note-list-item-status' },
                s.createElement(
                  'button',
                  { 'aria-label': O, className: D, onClick: () => h(i, !E) },
                  s.createElement(y, null)
                )
              ),
              s.createElement(
                'button',
                {
                  'aria-label': 'Edit note '.concat(v),
                  className: 'note-list-item-text',
                  onClick: () => u(i),
                },
                s.createElement(
                  'div',
                  { className: 'note-list-item-title' },
                  s.createElement('span', null, b(M, (0, C.yK)(v)))
                ),
                'expanded' === e &&
                  N.length > 0 &&
                  s.createElement(
                    'div',
                    { className: 'note-list-item-excerpt' },
                    (0, C.yK)(N)
                      .split('\n')
                      .map((e, t) =>
                        s.createElement(
                          s.Fragment,
                          { key: t },
                          t > 0 && s.createElement('br', null),
                          b(M, e.slice(0, 200))
                        )
                      )
                  ),
                'comfy' === e &&
                  N.length > 0 &&
                  s.createElement(
                    'div',
                    { className: 'note-list-item-excerpt' },
                    b(M, (0, C.yK)(N).slice(0, 200))
                  )
              ),
              s.createElement(
                'div',
                { className: 'note-list-item-status-right' },
                t &&
                  ((p = ((e, t) => {
                    var n =
                      'number' == typeof t
                        ? 'Last successful sync: '.concat(
                            ((e, t) => {
                              var n = Math.max(0, e - t),
                                a = Math.round(n / 1e3);
                              if (a < 60) return ''.concat(a || 1, 's ago');
                              var s = Math.round(a / 60);
                              if (s < 60) return ''.concat(s, 'm ago');
                              var o = Math.round(s / 60);
                              if (o < 24) return ''.concat(o, 'h ago');
                              var l = Math.round(o / 24);
                              return ''.concat(l, 'd ago');
                            })(Date.now(), t),
                            '.'
                          )
                        : 'No successful sync yet.';
                    return e
                      ? 'Offline — your edits are saved locally and will sync as soon as the network returns. '.concat(
                          n
                        )
                      : 'Syncing your changes… '.concat(n);
                  })(n, o)),
                  s.createElement(
                    'span',
                    {
                      className: 'note-list-item-pending-changes',
                      title: p,
                      'aria-label': p,
                    },
                    s.createElement(w, null)
                  )),
                S &&
                  s.createElement(
                    'span',
                    { className: 'note-list-item-published-icon' },
                    s.createElement(g, null)
                  )
              )
            )
          );
        }
      }
      var L = { openNote: m.A.ui.openNote, pinNote: m.A.data.pinNote };
      const D = (0, i.Ng)((e, t) => {
        var n,
          { noteId: a } = t;
        return {
          displayMode: e.settings.noteDisplay,
          hasPendingChanges: S.hf(e, a),
          isOffline: 'offline' === e.simperium.connectionStatus,
          isOpened: e.ui.openedNote === a,
          lastSyncedAt: e.simperium.lastSync.get(a),
          lastUpdated:
            null !== (n = e.simperium.lastRemoteUpdate.get(a)) && void 0 !== n
              ? n
              : -1 / 0,
          note: e.data.notes.get(a),
          searchQuery: e.ui.searchQuery,
        };
      }, L)(k);
      var O = n(16663);
      function M(e, t) {
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
      function P(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? M(Object(n), !0).forEach(function (t) {
                (0, a.A)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : M(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t)
                  );
                });
        }
        return e;
      }
      var I = (e, t) => {
        switch (e.type) {
          case 'tag':
            return t;
          case 'trash':
            return 'Trash';
          case 'untagged':
            return 'Untagged Notes';
          default:
            return 'All Notes';
        }
      };
      class j extends s.Component {
        constructor() {
          super(...arguments),
            (0, a.A)(this, 'state', {
              heightCache: new o.jS({
                defaultHeight: 135,
                fixedWidth: !0,
                keyMapper: (e) => {
                  var {
                    filteredNotes: t,
                    searchQuery: n,
                    tagResultsFound: a,
                  } = this.props;
                  return 0 === a && 0 === t.length
                    ? 'no-notes'
                    : 0 === n.length || 0 === a
                      ? t[e]
                      : 0 === e
                        ? 'tag-suggestions'
                        : 1 === e
                          ? 'notes-header'
                          : t[e - 2];
                },
              }),
              lastNoteDisplay: null,
              windowWidth: null,
            }),
            (0, a.A)(this, 'list', (0, s.createRef)()),
            (0, a.A)(this, 'handleShortcut', (e) => {
              if (this.props.keyboardShortcuts) {
                var { ctrlKey: t, metaKey: n, shiftKey: a } = e,
                  s = e.key.toLowerCase(),
                  { isSmallScreen: o, showNoteList: l } = this.props,
                  r = t || n;
                return r && a && 'k' === s
                  ? (this.props.selectNoteAbove(),
                    e.stopPropagation(),
                    e.preventDefault(),
                    !1)
                  : r && a && 'j' === s
                    ? (this.props.selectNoteBelow(),
                      e.stopPropagation(),
                      e.preventDefault(),
                      !1)
                    : o && r && a && 'l' === s
                      ? (this.props.toggleNoteList(),
                        e.stopPropagation(),
                        e.preventDefault(),
                        !1)
                      : !o ||
                        !l ||
                        'Enter' !== s ||
                        (this.props.openNote(),
                        e.stopPropagation(),
                        e.preventDefault(),
                        !1);
              }
            }),
            (0, a.A)(this, 'toggleShortcuts', (e) => {
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
              collection: e,
              filteredNotes: t,
              noteDisplay: n,
              onEmptyTrash: a,
              openedNote: l,
              openedTag: i,
              searchQuery: c,
              showTrash: u,
              tagResultsFound: h,
            } = this.props,
            { heightCache: d } = this.state,
            m = ((e, t, n) =>
              0 === t.length || 0 === n
                ? e
                : [
                    'tag-suggestions',
                    'notes-header',
                    ...(e.length > 0 ? e : ['no-notes']),
                  ])(t, c, h),
            g = m.findIndex((e) => e === l),
            y = ((e, t) => {
              var { heightCache: n } = t;
              return (t) => {
                var { index: a, key: l, parent: r, style: i } = t,
                  c = e[a];
                return 'no-notes' === c
                  ? s.createElement(
                      o.dl,
                      {
                        cache: n,
                        columnIndex: 0,
                        key: 'no-notes',
                        parent: r,
                        rowIndex: a,
                      },
                      s.createElement(
                        'div',
                        {
                          className: 'note-list is-empty',
                          style: P(P({}, i), {}, { height: 200 }),
                        },
                        s.createElement(
                          'span',
                          { className: 'note-list-placeholder' },
                          'No Notes'
                        )
                      )
                    )
                  : 'tag-suggestions' === c || 'notes-header' === c
                    ? 'tag-suggestions' === c
                      ? s.createElement(
                          o.dl,
                          {
                            cache: n,
                            columnIndex: 0,
                            key: 'tag-suggestions',
                            parent: r,
                            rowIndex: a,
                          },
                          s.createElement(O.Ay, { style: P({}, i) })
                        )
                      : s.createElement(
                          o.dl,
                          {
                            cache: n,
                            columnIndex: 0,
                            key: 'notes-header',
                            parent: r,
                            rowIndex: a,
                          },
                          s.createElement(
                            'div',
                            { className: 'note-list-header', style: P({}, i) },
                            'Notes'
                          )
                        )
                    : s.createElement(
                        o.dl,
                        {
                          cache: n,
                          columnIndex: 0,
                          key: l,
                          parent: r,
                          rowIndex: a,
                        },
                        s.createElement(D, {
                          invalidateHeight: () => n.clear(a, 0),
                          noteId: c,
                          style: i,
                        })
                      );
              };
            })(m, { heightCache: d }),
            w = 0 === m.length,
            v = s.createElement(
              'div',
              { className: 'note-list-empty-trash' },
              s.createElement(
                'button',
                {
                  type: 'button',
                  className: 'button button-borderless button-danger',
                  onClick: a,
                },
                'Empty Trash'
              )
            );
          return s.createElement(
            'div',
            { className: r()('note-list', { 'is-empty': w }) },
            w
              ? s.createElement(p, null)
              : s.createElement(
                  s.Fragment,
                  null,
                  s.createElement(
                    'div',
                    { className: 'note-list-items '.concat(n) },
                    s.createElement(o.t$, null, (t) => {
                      var { height: a, width: l } = t;
                      return s.createElement(o.B8, {
                        'aria-label': I(e, i),
                        ref: this.list,
                        estimatedRowSize: 126,
                        height: a,
                        noteDisplay: n,
                        notes: m,
                        rowCount: m.length,
                        rowHeight: d.rowHeight,
                        rowRenderer: y,
                        scrollToIndex: g,
                        tabIndex: null,
                        width: l,
                      });
                    })
                  ),
                  u && v
                )
          );
        }
      }
      (0, a.A)(j, 'displayName', 'NoteList'),
        (0, a.A)(
          j,
          'getDerivedStateFromProps',
          (e, t) => (
            t.heightCache.clear(0),
            t.heightCache.clear(1),
            t.heightCache.clear(2),
            e.noteDisplay !== t.lastNoteDisplay ||
            e.windowWidth !== t.windowWidth
              ? (t.heightCache.clearAll(),
                { lastNoteDisplay: e.noteDisplay, windowWidth: e.windowWidth })
              : null
          )
        );
      var T = {
        onEmptyTrash: m.A.ui.emptyTrash,
        openNote: m.A.ui.openNote,
        selectNoteAbove: m.A.ui.selectNoteAbove,
        selectNoteBelow: m.A.ui.selectNoteBelow,
        toggleNoteList: m.A.ui.toggleNoteList,
      };
      const Q = (0, i.Ng)(
        (e) => ({
          collection: e.ui.collection,
          isSmallScreen: S.Qv(e),
          keyboardShortcuts: e.settings.keyboardShortcuts,
          noteDisplay: e.settings.noteDisplay,
          filteredNotes: e.ui.filteredNotes,
          openedNote: e.ui.openedNote,
          openedTag: S.Q5(e),
          searchQuery: e.ui.searchQuery,
          showNoteList: e.ui.showNoteList,
          showTrash: S.Iy(e),
          tagResultsFound: e.ui.tagSuggestions.length,
          windowWidth: e.browser.windowWidth,
        }),
        T
      )(j);
    },
  },
]);
