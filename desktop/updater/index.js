'use strict';

/**
 * 1TXT lightweight updater
 *
 * 设计原则：极简、不下载、不安装。
 *
 *   1. 应用启动后异步拉一次 metadata JSON（来自自托管服务器或 GitHub Release）
 *   2. 比对 latest.version 与当前 app.getVersion()
 *   3. 命中就弹一个对话框：[去下载] / [跳过此版本]
 *      - 去下载：shell.openExternal(downloadPageUrl) 跳浏览器
 *      - 跳过此版本：把 version 写入用户数据目录的 skipped-versions.json，下次不再提示
 *   4. 如果 metadata 里 force === true（或当前版本 < minSupportedVersion），
 *      改弹强制升级对话框：[升级桌面版] / [使用 Web 端]，不可关闭、不可跳过
 *
 * metadata JSON schema（你需要在 downloadPageUrl 同域托管这个文件）：
 *
 *   {
 *     "version": "1.2.0",                       // 必填，最新版本号
 *     "downloadPageUrl": "http://1txt.pkpkpk.com/down",
 *     "webAppUrl": "http://1txt.pkpkpk.com",
 *     "releaseNotes": "本次更新...",             // 可选，对话框正文
 *     "minSupportedVersion": "1.0.0",           // 可选，低于此版本必须强制升级
 *     "force": false                            // 可选，true 时所有人强制升级
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
  const message = `1TXT ${meta.version} 已发布`;
  const detail =
    `当前版本：${current}\n最新版本：${meta.version}\n\n` +
    (meta.releaseNotes ? meta.releaseNotes + '\n\n' : '') +
    `点击"去下载"将在浏览器中打开下载页。`;

  const result = dialog.showMessageBoxSync(parentWindow || null, {
    type: 'info',
    buttons: ['去下载', '跳过此版本', '稍后提醒'],
    defaultId: 0,
    cancelId: 2,
    title: '发现新版本',
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
  // 选项 2（稍后提醒）：什么也不做，下次启动再问
}

function showForceUpgradeDialog(meta, parentWindow) {
  const downloadUrl = meta.downloadPageUrl || config.updater.downloadPageUrl;
  const webUrl = meta.webAppUrl || config.updater.webAppUrl;
  const message = '当前版本已不再支持，请立即升级';
  const detail =
    `当前版本：${app.getVersion()}\n最新版本：${meta.version}\n\n` +
    (meta.releaseNotes ||
      '由于同步协议或数据格式发生重大变更，旧版本无法继续使用。') +
    '\n\n请选择升级方式：';

  const result = dialog.showMessageBoxSync(parentWindow || null, {
    type: 'warning',
    buttons: ['升级桌面版', '使用 Web 端', '退出'],
    defaultId: 0,
    cancelId: 2,
    title: '需要升级',
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
        buttons: ['确定'],
        title: '检查更新失败',
        message: '无法连接到更新服务器',
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

  // 1) 强制升级判断
  const minVer = meta.minSupportedVersion;
  const mustForce =
    meta.force === true ||
    (isValidVersion(minVer) && semver.lt(current, minVer));
  if (mustForce && semver.gt(meta.version, current)) {
    showForceUpgradeDialog(meta, parentWindow);
    return;
  }

  // 2) 普通升级提示
  if (semver.lte(meta.version, current)) {
    if (!silent) {
      dialog.showMessageBoxSync(parentWindow || null, {
        type: 'info',
        buttons: ['确定'],
        title: '已是最新版本',
        message: `1TXT ${current} 已是最新版本`,
      });
    }
    return;
  }

  // 静默检查时尊重"跳过此版本"
  if (silent && readSkipped().includes(meta.version)) {
    log.debug(`Skip notify: user previously skipped ${meta.version}`);
    return;
  }

  showUpdateDialog(meta, parentWindow);
}

module.exports = {
  /** 启动后自动调用，静默失败 + 尊重跳过列表 */
  ping(parentWindow) {
    check({ silent: true, parentWindow }).catch((e) =>
      log.warn('ping error: ' + e.message)
    );
  },

  /** 用户主动从菜单触发，失败 / 已是最新都会弹提示 */
  pingAndShowProgress(parentWindow) {
    check({ silent: false, parentWindow }).catch((e) =>
      log.warn('manual check error: ' + e.message)
    );
  },
};
