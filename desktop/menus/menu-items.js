const { app, BrowserWindow } = require('electron');

const { appCommandSender } = require('./utils');
const updater = require('../updater');

const about = {
  label: '&About ' + (app ? app.name : '1TXT'),
  click: appCommandSender({
    action: 'showDialog',
    dialog: 'ABOUT',
  }),
};

const checkForUpdates = {
  label: '&Check for Updates…',
  click: () =>
    updater.pingAndShowProgress(BrowserWindow.getFocusedWindow()),
};

const emptyTrash = (isAuthenticated) => {
  return {
    label: '&Empty Trash',
    visible: isAuthenticated,
    click: appCommandSender({ action: 'emptyTrash' }),
  };
};

const preferences = (isAuthenticated) => {
  return {
    label: 'P&references…',
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
    label: '&Sign Out',
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
