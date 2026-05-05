const { app, BrowserWindow } = require('electron');

const { appCommandSender } = require('./utils');
const updater = require('../updater');
const { t } = require('../i18n');

const about = {
  label: t('menu.common.about'),
  click: appCommandSender({
    action: 'showDialog',
    dialog: 'ABOUT',
  }),
};

const checkForUpdates = {
  label: t('menu.common.checkForUpdates'),
  click: () => updater.pingAndShowProgress(BrowserWindow.getFocusedWindow()),
};

const emptyTrash = (isAuthenticated) => {
  return {
    label: t('menu.common.emptyTrash'),
    visible: isAuthenticated,
    click: appCommandSender({ action: 'emptyTrash' }),
  };
};

const preferences = (isAuthenticated) => {
  return {
    label: t('menu.common.preferences'),
    visible: isAuthenticated,
    accelerator: 'CommandOrControl+,',
    click: appCommandSender({
      action: 'showDialog',
      dialog: 'SETTINGS',
    }),
  };
};

const signout = (isAuthenticated) => {
  return {
    label: t('menu.common.signOut'),
    visible: isAuthenticated,
    click: appCommandSender({
      action: 'logout',
    }),
  };
};

module.exports = {
  about,
  checkForUpdates,
  emptyTrash,
  preferences,
  signout,
};
