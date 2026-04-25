const { app } = require('electron');

const { appCommandSender } = require('./utils');
const updater = require('../updater');
let autoUpdater;
if (process.env.NODE_ENV !== 'development') {
  try {
    autoUpdater = require('electron-updater').autoUpdater;
  } catch (e) {
    console.warn('[MenuItems] electron-updater not available:', e.message);
  }
}

const about = {
  label: '&About ' + (app ? app.name : '1TXT'),
  click: appCommandSender({
    action: 'showDialog',
    dialog: 'ABOUT',
  }),
};

const checkForUpdates = {
  label: '&Check for Updates…',
  enabled: autoUpdater ? autoUpdater.isUpdaterActive() : false,
  click:
    updater && updater.pingAndShowProgress
      ? updater.pingAndShowProgress.bind(updater)
      : () => {},
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
