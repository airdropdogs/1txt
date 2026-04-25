'use strict';

/**
 * Internal dependencies
 */
const Updater = require('../lib/Updater');

// Skip auto-updater in dev mode — electron-updater@4.x crashes with electron@34+
const isDev = process.env.NODE_ENV === 'development';

let autoUpdater;
if (!isDev) {
  try {
    autoUpdater = require('electron-updater').autoUpdater;
  } catch (e) {
    console.warn('[AutoUpdater] Failed to load:', e.message);
  }
}

class AutoUpdater extends Updater {
  constructor({ changelogUrl, options = {} }) {
    super(changelogUrl, options);

    if (!autoUpdater) return;

    autoUpdater.on('error', this.onError.bind(this));
    autoUpdater.on('update-not-available', this.onNotAvailable.bind(this));
    autoUpdater.on('update-downloaded', this.onDownloaded.bind(this));

    autoUpdater.autoInstallOnAppQuit = false;
  }

  // For non-user-initiated checks.
  // Check and download in the background, and only notify the user if
  // an update exists and has completed downloading.
  ping() {
    if (autoUpdater) autoUpdater.checkForUpdates();
  }

  // For user-initiated checks.
  // Will check and download, displaying progress dialogs.
  pingAndShowProgress() {
    if (!autoUpdater) return;
    const setupProgressUpdates = require('../lib/setup-progress-updates');
    setupProgressUpdates({ updater: autoUpdater, willAutoDownload: true });
    autoUpdater.checkForUpdates();
  }

  onConfirm() {
    if (!autoUpdater) return;
    const AppQuit = require('../../app-quit');
    AppQuit.allowQuit();
    autoUpdater.quitAndInstall();
  }
}

module.exports = AutoUpdater;
