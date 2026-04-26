#!/usr/bin/env node
'use strict';

/**
 * 1TXT 一键发版脚本
 *
 * 用法：
 *   npm run release            # 不打包，只升版本号 + commit + tag + push
 *   npm run release:win        # 同时跑 npm run build:win
 *   node scripts/release.js --skip-push     # 本地试跑，不 push
 *   node scripts/release.js --skip-tag      # 不打 tag（仅升 version）
 *
 * 流程（每一步失败立即 abort，不会留下半成品）：
 *   1. 读 version.json（必须存在），版本号必须 > package.json 当前版本
 *   2. 检查 git 工作区干净（仅允许 version.json 修改）
 *   3. 同步 package.json.version
 *   4. （可选）npm run build:win
 *   5. git add + commit + tag
 *   6. git push --follow-tags
 *   7. 打开 release/ 文件夹 + 浏览器到 GitHub New Release 页
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const semver = require('semver');

const ROOT = path.resolve(__dirname, '..');
const VERSION_JSON = path.join(ROOT, 'version.json');
const PACKAGE_JSON = path.join(ROOT, 'package.json');
const REPO_URL = 'https://github.com/airdropdogs/1txt';

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const flagValue = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : null;
};

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}
function sh(cmd) {
  console.log('  $ ' + cmd);
  execSync(cmd, { stdio: 'inherit', cwd: ROOT });
}
function shOut(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim();
}
function fail(msg) {
  console.error('\n✗ ' + msg);
  process.exit(1);
}
function step(n, msg) {
  console.log(`\n[${n}] ${msg}`);
}

// ---- 1. 读 + 校验 -----------------------------------------------------------

if (!fs.existsSync(VERSION_JSON)) fail('version.json 不存在');

const versionJson = readJson(VERSION_JSON);
const packageJson = readJson(PACKAGE_JSON);
const newVer = versionJson.version;
const oldVer = packageJson.version;

if (!semver.valid(newVer)) {
  fail(`version.json.version 不是合法 semver: ${newVer}`);
}
if (semver.eq(newVer, oldVer)) {
  fail(`version.json.version (${newVer}) 与 package.json 一致，没有什么要发的。\n请先编辑 version.json 把版本号往上提。`);
}
if (semver.lt(newVer, oldVer)) {
  fail(`version.json.version (${newVer}) 比 package.json (${oldVer}) 还小，拒绝降级。`);
}
if (!versionJson.releaseNotes || !versionJson.releaseNotes.trim()) {
  fail('version.json.releaseNotes 不能为空，先写两句给用户看的更新说明。');
}

console.log(`\n▶ Releasing 1TXT v${oldVer} → v${newVer}`);
console.log(`  release notes: ${versionJson.releaseNotes.split('\n')[0].slice(0, 60)}…`);

// ---- 2. git 工作区检查 ------------------------------------------------------

step(1, '检查 git 工作区');
const status = shOut('git status --porcelain');
const dirtyOther = status
  .split('\n')
  .filter(Boolean)
  .filter((line) => !/\sversion\.json$/.test(line));
if (dirtyOther.length > 0) {
  console.error('  工作区还有未提交修改（除 version.json 外）：');
  console.error('  ' + dirtyOther.join('\n  '));
  fail('请先把它们 commit 掉再发版。');
}

// ---- 3. 同步 package.json.version -------------------------------------------

step(2, `同步 package.json.version → ${newVer}`);
packageJson.version = newVer;
writeJson(PACKAGE_JSON, packageJson);

// ---- 4. （可选）打包 --------------------------------------------------------

const buildTarget = flagValue('--build');
if (buildTarget) {
  step(3, `打包 ${buildTarget}`);
  sh(`npm run build:${buildTarget}`);
} else {
  console.log('\n[3] 跳过打包（用 --build win 启用，或自己后续手工 npm run build:win）');
}

// ---- 5. git commit + tag ---------------------------------------------------

step(4, 'git commit + tag');
sh('git add version.json package.json package-lock.json');
sh(`git commit -m "chore: release v${newVer}"`);

if (!flag('--skip-tag')) {
  sh(`git tag v${newVer}`);
}

// ---- 6. git push -----------------------------------------------------------

if (!flag('--skip-push')) {
  step(5, 'git push --follow-tags');
  sh('git push --follow-tags');
} else {
  console.log('\n[5] 跳过 push（--skip-push）');
}

// ---- 7. 提示下一步 ----------------------------------------------------------

const newReleaseUrl = `${REPO_URL}/releases/new?tag=v${newVer}&title=v${newVer}`;
console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log(`  ✓ v${newVer} 已发布到 git，version.json 已生效`);
console.log('═══════════════════════════════════════════════════════════');
console.log('');
console.log(`下一步（手工，约 1-2 分钟）：`);
console.log(`  1. 打开浏览器：${newReleaseUrl}`);
console.log(`  2. 把 release/ 目录里的 .exe / .zip / .dmg 等产物拖到上传区`);
console.log(`  3. Release notes 复制 RELEASE-NOTES.md 顶部条目（也可以直接`);
console.log(`     从 version.json 的 releaseNotes 字段复制简版）`);
console.log(`  4. 点 "Publish release" 完事`);
console.log('');
console.log(`客户端将在 5-10 分钟内（GitHub raw 缓存）感知到新版本，自动弹窗。`);
console.log('');

if (process.platform === 'win32') {
  try {
    if (fs.existsSync(path.join(ROOT, 'release'))) {
      sh('explorer .\\release');
    }
  } catch {}
  try {
    sh(`start "" "${newReleaseUrl}"`);
  } catch {}
}
