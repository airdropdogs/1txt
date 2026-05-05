const { buildRadioGroup, appCommandSender } = require('./utils');
const platform = require('../detect/platform');
const { t } = require('../i18n');

const minimizeWithBossKey = (item, focusedWindow) => {
  if (focusedWindow) {
    focusedWindow.minimize();
  }
};

const buildViewMenu = (settings, isAuthenticated) => {
  settings = settings || {};
  isAuthenticated = isAuthenticated || false;

  const themeSubMenu = [];
  if (!platform.isLinux()) {
    themeSubMenu.push({
      label: t('menu.view.system'),
      id: 'system',
    });
  }
  themeSubMenu.push({
    label: t('menu.view.light'),
    id: 'light',
  });
  themeSubMenu.push({
    label: t('menu.view.dark'),
    id: 'dark',
  });

  const menu = {
    label: t('menu.view.title'),
    submenu: [
      {
        label: t('menu.view.sortType'),
        visible: isAuthenticated,
        submenu: [
          {
            label: t('menu.view.dateModified'),
            id: 'modificationDate',
          },
          {
            label: t('menu.view.dateCreated'),
            id: 'creationDate',
          },
          {
            label: t('menu.view.alphabetical'),
            id: 'alphabetical',
          },
        ]
          .map(
            buildRadioGroup({
              action: 'setSortType',
              propName: 'sortType',
              settings,
            })
          )
          .concat([
            {
              type: 'separator',
            },
            {
              label: t('menu.view.reversed'),
              type: 'checkbox',
              checked: settings.sortReversed,
              click: appCommandSender({
                action: 'toggleSortOrder',
              }),
            },
          ]),
      },
      {
        label: t('menu.view.noteDisplay'),
        visible: isAuthenticated,
        submenu: [
          {
            label: t('menu.view.comfy'),
            id: 'comfy',
          },
          {
            label: t('menu.view.condensed'),
            id: 'condensed',
          },
          {
            label: t('menu.view.expanded'),
            id: 'expanded',
          },
        ].map(
          buildRadioGroup({
            action: 'setNoteDisplay',
            propName: 'noteDisplay',
            settings,
          })
        ),
      },
      {
        label: t('menu.view.lineLength'),
        visible: isAuthenticated,
        submenu: [
          {
            label: t('menu.view.narrow'),
            id: 'narrow',
          },
          {
            label: t('menu.view.full'),
            id: 'full',
          },
        ].map(
          buildRadioGroup({
            action: 'setLineLength',
            propName: 'lineLength',
            settings,
          })
        ),
      },
      {
        label: t('menu.view.tags'),
        visible: isAuthenticated,
        submenu: [
          {
            label: t('menu.view.sortAlphabetically'),
            type: 'checkbox',
            checked: settings.sortTagsAlpha,
            click: appCommandSender({
              action: 'toggleSortTagsAlpha',
            }),
          },
        ],
      },
      {
        label: t('menu.view.theme'),
        visible: isAuthenticated,
        submenu: themeSubMenu.map(
          buildRadioGroup({
            action: 'activateTheme',
            propName: 'theme',
            settings,
          })
        ),
      },
      ...(isAuthenticated ? [{ type: 'separator' }] : []),
      {
        role: 'ZoomIn',
      },
      {
        // enable ZoomIn shortcut to work both with and without Shift
        // the default accelerator added by Electron is CommandOrControl+Shift+=
        role: 'ZoomIn',
        visible: false,
        acceleratorWorksWhenHidden: true,
        accelerator: 'CommandOrControl+=',
      },
      {
        role: 'ZoomOut',
      },
      {
        role: 'ResetZoom',
      },

      // backup shortcuts for numeric keypad,
      // see https://github.com/electron/electron/issues/5256#issuecomment-692068367
      {
        role: 'ZoomIn',
        visible: false,
        acceleratorWorksWhenHidden: true,
        accelerator: 'CommandOrControl+numadd',
      },
      {
        role: 'ZoomOut',
        visible: false,
        acceleratorWorksWhenHidden: true,
        accelerator: 'CommandOrControl+numsub',
      },
      {
        role: 'ResetZoom',
        visible: false,
        acceleratorWorksWhenHidden: true,
        accelerator: 'CommandOrControl+num0',
      },

      ...(isAuthenticated ? [{ type: 'separator' }] : []),
      {
        label: t('menu.view.focusMode'),
        visible: isAuthenticated,
        accelerator: 'CommandOrControl+Shift+F',
        type: 'checkbox',
        checked: settings.focusModeEnabled,
        click: appCommandSender({ action: 'toggleFocusMode' }),
      },
      {
        label: t('menu.view.bossKey'),
        visible: isAuthenticated,
        accelerator: settings.bossKeyShortcut || 'Alt+1',
        registerAccelerator: false,
        click: minimizeWithBossKey,
      },
      {
        type: 'separator',
      },
      {
        label: t('menu.view.toggleFullScreen'),
        accelerator: platform.isOSX() ? 'Ctrl+Command+F' : 'F11',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
      },
    ],
  };

  return menu;
};

module.exports = buildViewMenu;
