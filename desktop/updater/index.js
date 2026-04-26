'use strict';

/**
 * 1TXT lightweight updater
 *
 * Principles: minimal — no auto-download, no silent install.
 *
 *   1. After launch, fetch metadata JSON (self-hosted or GitHub raw).
 *   2. Compare metadata.version to app.getVersion().
 *   3. If newer: dialog [Download] / [Skip this version] / [Remind me later].
 *      - Download: shell.openExternal(downloadPageUrl)
 *      - Skip: append version to userData/skipped-versions.json
 *   4. If force === true or current < minSupportedVersion: blocking dialog
 *      [Upgrade desktop] / [Use web app] / [Quit] — cannot dismiss without choosing.
 *
 * Metadata JSON (same shape as repo-root version.json), e.g.:
 *
 *   {
 *     "version": "1.2.0",
 *     "downloadPageUrl": "https://github.com/org/repo/releases/latest",
 *     "webAppUrl": "https://example.com",
 *     "releaseNotes": "Short summary for the dialog.",
 *     "minSupportedVersion": "1.0.0",
 *     "force": false
 *   }
 */

const { app, dialog, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const semver = require('semver');

const config = require('../config');
const log = require('../logger')('desktop:updater');

const SKIP_FILE = () =>
  path.join(app.getPath('userData'), 'skipped-versions.json');

// ---- helpers ----------------------------------------------------------------

function fetchJson(url, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https:') ? https : http;
    const req = lib.get(
      url,
      { headers: { 'User-Agent': `1TXT/${app.getVersion()}` } },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // follow one redirect
          fetchJson(res.headers.location, timeoutMs).then(resolve, reject);
          res.resume();
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} from ${url}`));
          res.resume();
          return;
        }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error(`Invalid JSON from ${url}: ${e.message}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`Request to ${url} timed out`));
    });
  });
}

function readSkipped() {
  try {
    const raw = fs.readFileSync(SKIP_FILE(), 'utf8');
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeSkipped(versions) {
  try {
    fs.mkdirSync(path.dirname(SKIP_FILE()), { recursive: true });
    fs.writeFileSync(SKIP_FILE(), JSON.stringify(versions), 'utf8');
  } catch (e) {
    log.warn('Failed to persist skipped-versions: ' + e.message);
  }
}

function isValidVersion(v) {
  return typeof v === 'string' && semver.valid(v) !== null;
}

// ---- core dialogs -----------------------------------------------------------

function showUpdateDialog(meta, parentWindow) {
  const current = app.getVersion();
  const downloadUrl = meta.downloadPageUrl || config.updater.downloadPageUrl;
  const message = `1TXT ${meta.version} is available`;
  const detail =
    `Current version: ${current}\nLatest version: ${meta.version}\n\n` +
    (meta.releaseNotes ? meta.releaseNotes + '\n\n' : '') +
    `Choose Download to open the download page in your browser.`;

  const result = dialog.showMessageBoxSync(parentWindow || null, {
    type: 'info',
    buttons: ['Download', 'Skip this version', 'Remind me later'],
    defaultId: 0,
    cancelId: 2,
    title: 'Update available',
    message,
    detail,
    noLink: true,
  });

  if (result === 0) {
    shell.openExternal(downloadUrl);
  } else if (result === 1) {
    const skipped = readSkipped();
    if (!skipped.includes(meta.version)) {
      skipped.push(meta.version);
      writeSkipped(skipped);
    }
    log.info(`User skipped version ${meta.version}`);
  }
  // Remind me later: no-op; prompt again on next launch
}

function showForceUpgradeDialog(meta, parentWindow) {
  const downloadUrl = meta.downloadPageUrl || config.updater.downloadPageUrl;
  const webUrl = meta.webAppUrl || config.updater.webAppUrl;
  const message = 'This version is no longer supported. Please upgrade.';
  const detail =
    `Current version: ${app.getVersion()}\nLatest version: ${meta.version}\n\n` +
    (meta.releaseNotes ||
      'The sync protocol or data format has changed; this build cannot continue.') +
    '\n\nChoose how to proceed:';

  const result = dialog.showMessageBoxSync(parentWindow || null, {
    type: 'warning',
    buttons: ['Upgrade desktop', 'Use web app', 'Quit'],
    defaultId: 0,
    cancelId: 2,
    title: 'Upgrade required',
    message,
    detail,
    noLink: true,
  });

  if (result === 0) {
    shell.openExternal(downloadUrl);
    app.quit();
  } else if (result === 1) {
    if (webUrl) shell.openExternal(webUrl);
    app.quit();
  } else {
    app.quit();
  }
}

// ---- public API -------------------------------------------------------------

async function check({ silent = true, parentWindow = null } = {}) {
  const url = config.updater.metadataUrl;
  if (!url) {
    log.debug('updater.metadataUrl not configured, skipping');
    return;
  }

  let meta;
  try {
    meta = await fetchJson(url);
  } catch (e) {
    log.info('Update check failed: ' + e.message);
    if (!silent) {
      dialog.showMessageBoxSync(parentWindow || null, {
        type: 'error',
        buttons: ['OK'],
        title: 'Update check failed',
        message: 'Could not reach the update server',
        detail: e.message,
      });
    }
    return;
  }

  if (!isValidVersion(meta.version)) {
    log.warn(`Invalid version in metadata: ${JSON.stringify(meta.version)}`);
    return;
  }

  const current = app.getVersion();

  // 1) Forced upgrade
  const minVer = meta.minSupportedVersion;
  const mustForce =
    meta.force === true ||
    (isValidVersion(minVer) && semver.lt(current, minVer));
  if (mustForce && semver.gt(meta.version, current)) {
    showForceUpgradeDialog(meta, parentWindow);
    return;
  }

  // 2) Optional upgrade
  if (semver.lte(meta.version, current)) {
    if (!silent) {
      dialog.showMessageBoxSync(parentWindow || null, {
        type: 'info',
        buttons: ['OK'],
        title: 'Up to date',
        message: `1TXT ${current} is the latest version`,
      });
    }
    return;
  }

  // Silent check: honor skipped list
  if (silent && readSkipped().includes(meta.version)) {
    log.debug(`Skip notify: user previously skipped ${meta.version}`);
    return;
  }

  showUpdateDialog(meta, parentWindow);
}

module.exports = {
  /** Called after launch; failures are silent; honors skip list */
  ping(parentWindow) {
    check({ silent: true, parentWindow }).catch((e) =>
      log.warn('ping error: ' + e.message)
    );
  },

  /** Menu action: show errors and “up to date” dialogs */
  pingAndShowProgress(parentWindow) {
    check({ silent: false, parentWindow }).catch((e) =>
      log.warn('manual check error: ' + e.message)
    );
  },
};
