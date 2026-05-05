import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Dialog from '../../dialog';
import { closeDialog as closeDialogAction } from '../../state/ui/actions';
import { CmdOrCtrl, isElectron } from '../../utils/platform';
import { t } from '../../i18n';

import * as S from '../../state';

type StateProps = {
  bossKeyShortcut: string;
};

type DispatchProps = {
  closeDialog: () => any;
};

const Keys = ({
  keys,
  children,
}: {
  keys: (string | [string, string])[];
  children: React.ReactNode;
}) => (
  <div className="keybindings__key-item">
    <div className="keybindings__key-list">
      {keys.map((key, i) => (
        <Fragment key={i}>
          {i > 0 && ' + '}
          {'string' === typeof key ? (
            <kbd key={key}>{key}</kbd>
          ) : (
            <>
              <kbd>{key[0]}</kbd> / <kbd>{key[1]}</kbd>
            </>
          )}
        </Fragment>
      ))}
    </div>
    {'\u2000-\u2000'}
    <div className="keybindings__key-description">{children}</div>
  </div>
);

type Props = StateProps & DispatchProps;

const toDisplayKeys = (shortcut: string): (string | [string, string])[] =>
  shortcut
    .split('+')
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => {
      if (token === 'CommandOrControl') {
        return CmdOrCtrl;
      }

      if (token === 'Alt') {
        return ['Alt', 'Option'];
      }

      return token;
    });

export class AboutDialog extends Component<Props> {
  render() {
    const { bossKeyShortcut, closeDialog } = this.props;
    const bossKeyDisplay = toDisplayKeys(bossKeyShortcut || 'Alt+1');

    return (
      <div className="keybindings">
        <Dialog onDone={closeDialog} title={t('keybindings.title')}>
          <div className="keybindings__sections">
            <section>
              <h1>{t('keybindings.view')}</h1>
              <ul>
                <li>
                  <Keys keys={[CmdOrCtrl, '/']}>
                    {t('keybindings.showShortcuts')}
                  </Keys>
                </li>
                <li>
                  <Keys keys={[CmdOrCtrl, 'Shift', 'F']}>
                    {t('keybindings.toggleFocusMode')}
                  </Keys>
                </li>
                {isElectron && (
                  <li>
                    <Keys keys={bossKeyDisplay}>
                      {t('keybindings.bossKey')}
                    </Keys>
                  </li>
                )}
                <li>
                  <Keys keys={[CmdOrCtrl, 'Shift', 'S']}>
                    {t('keybindings.focusSearch')}
                  </Keys>
                </li>
                <li>
                  <Keys keys={[CmdOrCtrl, 'G']}>
                    {t('keybindings.jumpNextMatch')}
                  </Keys>
                </li>
                <li>
                  <Keys keys={[CmdOrCtrl, 'Shift', 'G']}>
                    {t('keybindings.jumpPrevMatch')}
                  </Keys>
                </li>
                {isElectron && (
                  <li>
                    <Keys keys={[CmdOrCtrl, '+']}>
                      {t('keybindings.increaseFont')}
                    </Keys>
                  </li>
                )}
                {isElectron && (
                  <li>
                    <Keys keys={[CmdOrCtrl, '-']}>
                      {t('keybindings.decreaseFont')}
                    </Keys>
                  </li>
                )}
                {isElectron && (
                  <li>
                    <Keys keys={[CmdOrCtrl, '0']}>
                      {t('keybindings.resetFont')}
                    </Keys>
                  </li>
                )}
              </ul>
            </section>

            <section>
              <h1>{t('keybindings.navigation')}</h1>
              <ul>
                {isElectron && (
                  <li>
                    <Keys keys={[CmdOrCtrl, ',']}>
                      {t('keybindings.openPreferences')}
                    </Keys>
                  </li>
                )}
                {isElectron && (
                  <li>
                    <Keys keys={[CmdOrCtrl, 'Shift', 'E']}>
                      {t('keybindings.exportAllNotes')}
                    </Keys>
                  </li>
                )}
                <li>
                  <Keys keys={[CmdOrCtrl, 'Shift', 'U']}>
                    {t('keybindings.toggleTagList')}
                  </Keys>
                </li>
                <li>
                  <Keys keys={[CmdOrCtrl, 'Shift', 'K']}>
                    {t('keybindings.openNoteAbove')}
                  </Keys>
                </li>
                <li>
                  <Keys keys={[CmdOrCtrl, 'Shift', 'J']}>
                    {t('keybindings.openNoteBelow')}
                  </Keys>
                </li>
                <li>
                  <Keys keys={[CmdOrCtrl, 'Shift', 'Y']}>
                    {t('keybindings.toggleEditTags')}
                  </Keys>
                </li>
                <li>
                  <Keys keys={[CmdOrCtrl, 'Shift', 'L']}>
                    {t('keybindings.toggleNoteList')}
                  </Keys>
                </li>
              </ul>
            </section>

            <section>
              <h1>{t('keybindings.noteEditing')}</h1>
              <ul>
                <li>
                  <Keys keys={[CmdOrCtrl, 'Shift', 'I']}>
                    {t('keybindings.createNewNote')}
                  </Keys>
                </li>
                {isElectron && (
                  <li>
                    <Keys keys={[CmdOrCtrl, 'P']}>
                      {t('keybindings.printNote')}
                    </Keys>
                  </li>
                )}
                <li>
                  <Keys keys={[CmdOrCtrl, 'Shift', 'P']}>
                    {t('keybindings.toggleMarkdownPreview')}
                  </Keys>
                </li>
                <li>
                  <Keys keys={[CmdOrCtrl, 'Shift', 'C']}>
                    {t('keybindings.insertChecklist')}
                  </Keys>
                </li>
              </ul>
            </section>
          </div>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps: S.MapState<StateProps> = ({
  settings: { bossKeyShortcut },
}) => ({
  bossKeyShortcut,
});

const mapDispatchToProps: S.MapDispatch<DispatchProps> = {
  closeDialog: closeDialogAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AboutDialog);
