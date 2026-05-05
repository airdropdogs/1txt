import React, {
  FunctionComponent,
  Fragment,
  KeyboardEvent,
  useEffect,
  useState,
} from 'react';
import { connect } from 'react-redux';

import actions from '../../../state/actions';
import { t } from '../../../i18n';
import PanelTitle from '../../../components/panel-title';
import ButtonGroup from '../../button-group';
import SettingsGroup, { Item } from '../../settings-group';
import { showDialog } from '../../../state/ui/actions';
import ToggleGroup from '../../toggle-settings-group';

import * as S from '../../../state';

const DEFAULT_BOSS_KEY_SHORTCUT = 'Alt+1';

const RESERVED_SHORTCUTS = [
  'CommandOrControl+/',
  'CommandOrControl+Shift+F',
  'CommandOrControl+Shift+S',
  'CommandOrControl+G',
  'CommandOrControl+Shift+G',
  'CommandOrControl+,',
  'CommandOrControl+Shift+E',
  'CommandOrControl+Shift+U',
  'CommandOrControl+Shift+K',
  'CommandOrControl+Shift+J',
  'CommandOrControl+Shift+Y',
  'CommandOrControl+Shift+L',
  'CommandOrControl+Shift+I',
  'CommandOrControl+P',
  'CommandOrControl+Shift+P',
  'CommandOrControl+Shift+C',
  'CommandOrControl+F',
  'CommandOrControl+=',
  'CommandOrControl+-',
  'CommandOrControl+0',
];

const normalizeKeyToken = (token: string) => {
  const normalized = token.trim();
  if (!normalized) {
    return '';
  }

  const upper = normalized.toUpperCase();
  if (upper === 'CTRL' || upper === 'CONTROL') {
    return 'Control';
  }
  if (upper === 'CMD' || upper === 'COMMAND' || upper === 'META') {
    return 'Command';
  }
  if (upper === 'COMMANDORCONTROL' || upper === 'CMDORCTRL') {
    return 'CommandOrControl';
  }
  if (upper === 'ALT' || upper === 'OPTION') {
    return 'Alt';
  }
  if (upper === 'SHIFT') {
    return 'Shift';
  }

  if (/^F\d{1,2}$/.test(upper)) {
    return upper;
  }

  if (normalized.length === 1) {
    if (/^[a-zA-Z]$/.test(normalized)) {
      return normalized.toUpperCase();
    }

    if (/^[0-9]$/.test(normalized)) {
      return normalized;
    }

    return normalized;
  }

  const namedKeyMap = {
    ENTER: 'Enter',
    ESC: 'Esc',
    ESCAPE: 'Esc',
    SPACE: 'Space',
    TAB: 'Tab',
    BACKSPACE: 'Backspace',
    DELETE: 'Delete',
    INSERT: 'Insert',
    HOME: 'Home',
    END: 'End',
    PAGEUP: 'PageUp',
    PAGEDOWN: 'PageDown',
    UP: 'Up',
    DOWN: 'Down',
    LEFT: 'Left',
    RIGHT: 'Right',
  };

  return namedKeyMap[upper] || normalized;
};

const canonicalizeShortcut = (shortcut: string) => {
  const tokens = shortcut.split('+').map(normalizeKeyToken).filter(Boolean);

  const hasControl = tokens.includes('Control');
  const hasCommand = tokens.includes('Command');

  const normalized = tokens.map((token) => {
    if (
      (token === 'Control' || token === 'Command') &&
      (hasControl || hasCommand)
    ) {
      return 'CommandOrControl';
    }

    return token;
  });

  const modifiers = ['CommandOrControl', 'Alt', 'Shift'];
  const shortcutModifiers = modifiers.filter((modifier) =>
    normalized.includes(modifier)
  );
  const key = normalized.find((token) => !modifiers.includes(token));

  if (shortcutModifiers.length === 0 || !key) {
    return '';
  }

  return [...shortcutModifiers, key].join('+');
};

const eventToShortcut = (event: KeyboardEvent<HTMLInputElement>) => {
  const modifiers: string[] = [];

  if (event.ctrlKey || event.metaKey) {
    modifiers.push('CommandOrControl');
  }
  if (event.altKey) {
    modifiers.push('Alt');
  }
  if (event.shiftKey) {
    modifiers.push('Shift');
  }

  const key = normalizeKeyToken(event.key);

  if (!key || ['Control', 'Command', 'Alt', 'Shift'].includes(key)) {
    return '';
  }

  return [...modifiers, key].join('+');
};

const reservedCanonicalShortcuts = new Set(
  RESERVED_SHORTCUTS.map(canonicalizeShortcut)
);

const isBossShortcutConflict = (shortcut: string) =>
  reservedCanonicalShortcuts.has(canonicalizeShortcut(shortcut));

type StateProps = {
  bossKeyShortcut: string;
  keyboardShortcuts: boolean;
  sendNotifications: boolean;
};

type DispatchProps = {
  exportNotes: () => any;
  requestNotifications: (sendNotifications: boolean) => any;
  setBossKeyShortcut: (bossKeyShortcut: string) => any;
  showImportDialog: () => any;
  toggleShortcuts: () => any;
};

type Props = DispatchProps & StateProps;

const ToolsPanel: FunctionComponent<Props> = ({
  bossKeyShortcut,
  exportNotes,
  keyboardShortcuts,
  requestNotifications,
  sendNotifications,
  setBossKeyShortcut,
  showImportDialog,
  toggleShortcuts,
}) => {
  const [bossKeyError, setBossKeyError] = useState('');
  const [bossKeyValue, setBossKeyValue] = useState(
    bossKeyShortcut || DEFAULT_BOSS_KEY_SHORTCUT
  );

  useEffect(() => {
    setBossKeyValue(bossKeyShortcut || DEFAULT_BOSS_KEY_SHORTCUT);
  }, [bossKeyShortcut]);

  const onSelectItem = (item) => {
    if (item.slug === 'import') {
      showImportDialog();
    } else if (item.slug === 'export') {
      exportNotes();
    }
  };

  const onCaptureBossShortcut = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const shortcut = eventToShortcut(event);
    if (!shortcut) {
      setBossKeyError(t('settings.tools.bossKeyErrorNoModifier'));
      return;
    }

    if (isBossShortcutConflict(shortcut)) {
      setBossKeyError(t('settings.tools.bossKeyErrorConflict'));
      return;
    }

    setBossKeyError('');
    setBossKeyValue(shortcut);
    setBossKeyShortcut(shortcut);
  };

  const onResetBossShortcut = () => {
    setBossKeyError('');
    setBossKeyValue(DEFAULT_BOSS_KEY_SHORTCUT);
    setBossKeyShortcut(DEFAULT_BOSS_KEY_SHORTCUT);
  };

  return (
    <Fragment>
      <div className="settings-tools">
        <PanelTitle headingLevel={3}>{t('settings.tools.title')}</PanelTitle>
        <ButtonGroup
          items={[
            {
              name: t('settings.tools.importNotes'),
              slug: 'import',
            },
            {
              name: t('settings.tools.exportNotes'),
              slug: 'export',
            },
          ]}
          onClickItem={onSelectItem}
        />
      </div>
      <SettingsGroup
        slug="keyboardShortcuts"
        activeSlug={keyboardShortcuts ? 'keyboardShortcuts' : ''}
        onChange={toggleShortcuts}
        renderer={ToggleGroup}
      >
        <Item
          title={t('settings.tools.keyboardShortcuts')}
          slug="keyboardShortcuts"
        />
      </SettingsGroup>

      <div className="settings-group">
        <PanelTitle headingLevel={3}>{t('settings.tools.bossKey')}</PanelTitle>
        <div className="settings-items">
          <label
            className="settings-item"
            htmlFor="settings-field-boss-key-shortcut"
          >
            <div className="settings-item-label">
              {t('settings.tools.shortcut')}
            </div>
            <div className="settings-item-control settings-item-control--inline">
              <input
                id="settings-field-boss-key-shortcut"
                className="settings-item-text-input transparent-input settings-item-text-input--shortcut"
                placeholder={t('settings.tools.pressShortcut')}
                value={bossKeyValue}
                onKeyDown={onCaptureBossShortcut}
                onFocus={(event) => event.currentTarget.select()}
                readOnly
                spellCheck={false}
              />
              <button
                type="button"
                className="button button-borderless"
                onClick={onResetBossShortcut}
              >
                {t('settings.tools.reset')}
              </button>
            </div>
          </label>
        </div>
        <p className="settings-hint">{t('settings.tools.bossKeyHint')}</p>
        {bossKeyError && <p className="settings-error">{bossKeyError}</p>}
      </div>

      <SettingsGroup
        slug="allowNotifications"
        activeSlug={sendNotifications ? 'allowNotifications' : ''}
        onChange={() => requestNotifications(!sendNotifications)}
        renderer={ToggleGroup}
      >
        <Item
          title={t('settings.tools.notifyOnChanges')}
          slug="allowNotifications"
        />
      </SettingsGroup>
    </Fragment>
  );
};

const mapStateToProps: S.MapState<StateProps> = ({
  settings: { bossKeyShortcut, keyboardShortcuts, sendNotifications },
}) => ({
  bossKeyShortcut,
  keyboardShortcuts,
  sendNotifications,
});

const mapDispatchToProps: S.MapDispatch<DispatchProps> = {
  exportNotes: () => actions.data.exportNotes(),
  requestNotifications: (sendNotifications) => ({
    type: 'REQUEST_NOTIFICATIONS',
    sendNotifications,
  }),
  setBossKeyShortcut: (bossKeyShortcut) =>
    actions.settings.setBossKeyShortcut(bossKeyShortcut),
  showImportDialog: () => showDialog('IMPORT'),
  toggleShortcuts: () => actions.settings.toggleKeyboardShortcuts(),
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolsPanel);
