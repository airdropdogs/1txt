const { shell } = require('electron');

const menuItems = require('./menu-items');
const platform = require('../detect/platform');
const build = require('../detect/build');
const log = require('../logger')('desktop:menu:help');
const zipLogs = require('../logger/zip-logs');

const { appCommandSender } = require('./utils');
const { t } = require('../i18n');

const buildHelpMenu = (mainWindow, isAuthenticated) => {
  isAuthenticated = isAuthenticated || false;
  const submenu = [
    {
      label: t('menu.help.helpAndSupport'),
      accelerator: platform.isLinux() ? 'F1' : null,
      click: () =>
        shell.openExternal('https://github.com/airdropdogs/1txt#readme'),
    },
    {
      label: t('menu.help.keyboardShortcuts'),
      visible: isAuthenticated,
      click: appCommandSender({
        action: 'showDialog',
        dialog: 'KEYBINDINGS',
      }),
    },
    { type: 'separator' },
    {
      label: t('menu.help.advanced'),
      submenu: [
        {
          label: t('menu.help.debuggingConsole'),
          click: (item, focusedWindow) => focusedWindow?.toggleDevTools(),
        },
      ],
    },
    {
      type: 'separator',
    },
    {
      label: t('menu.help.getApplicationLogs'),
      click: function () {
        log.info("User selected 'Get Application Logs'...");
        zipLogs(mainWindow);
      },
    },
  ];

  const defaultSubmenuAdditions = [
    { type: 'separator' },
    ...(build.isWindowsStore() ? [] : [menuItems.checkForUpdates]),
    menuItems.about,
  ];

  const helpMenu = {
    label: t('menu.help.title'),
    role: 'help',
    submenu: platform.isOSX()
      ? submenu
      : submenu.concat(defaultSubmenuAdditions),
  };

  return helpMenu;
};

module.exports = buildHelpMenu;
