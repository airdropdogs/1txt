const menuItems = require('./menu-items');
const platform = require('../detect/platform');
const { appCommandSender } = require('./utils');
const { t } = require('../i18n');

const buildFileMenu = (isAuthenticated) => {
  isAuthenticated = isAuthenticated || false;

  let submenu = [];

  if (isAuthenticated) {
    submenu = [
      {
        label: t('menu.file.newNote'),
        accelerator: 'CommandOrControl+Shift+I',
        click: appCommandSender({ action: 'newNote' }),
      },
      { type: 'separator' },
      {
        label: t('menu.file.importNotes'),
        click: appCommandSender({
          action: 'showDialog',
          dialog: 'IMPORT',
        }),
      },
      {
        label: t('menu.file.exportNotes'),
        accelerator: 'CommandOrControl+Shift+E',
        click: appCommandSender({
          action: 'exportNotes',
        }),
      },
      { type: 'separator' },
      {
        label: t('menu.file.print'),
        accelerator: 'CommandOrControl+P',
        click: appCommandSender({ action: 'printNote' }),
      },
    ];
  }

  const defaultSubmenuAdditions = [
    { type: 'separator' },
    menuItems.preferences(isAuthenticated),
    ...(isAuthenticated ? [{ type: 'separator' }] : []),
    { role: 'quit' },
  ];

  const fileMenu = {
    label: t('menu.file.title'),
    submenu: platform.isOSX()
      ? submenu
      : submenu.concat(defaultSubmenuAdditions),
  };

  // we have nothing to show in the File menu on OSX logged out
  if (!isAuthenticated && platform.isOSX()) {
    fileMenu.visible = false;
  }

  return fileMenu;
};

module.exports = buildFileMenu;
