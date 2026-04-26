#!/usr/bin/env node
'use strict';

/**
 * 1TXT release helper
 *
 * Usage:
 *   npm run release            # bump version, commit, tag, push (no build)
 *   npm run release:win        # also runs npm run build:win
 *   node scripts/release.js --skip-push     # dry run without push
 *   node scripts/release.js --skip-tag      # bump only, no tag
 *
 * Steps (abort on first failure):
 *   1. Read version.json (required); new version must be > package.json
 *   2. Git working tree must be clean except version.json
 *   3. Sync package.json.version
 *   4. Optional: npm run build:<target>
 *   5. git add + commit + tag
 *   6. git push --follow-tags
 *   7. Open release/ + GitHub “New release” in the browser (Windows)
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

// ---- 1. Read + validate -----------------------------------------------------------

if (!fs.existsSync(VERSION_JSON)) fail('version.json is missing');

const versionJson = readJson(VERSION_JSON);
const packageJson = readJson(PACKAGE_JSON);
const newVer = versionJson.version;
const oldVer = packageJson.version;

if (!semver.valid(newVer)) {
  fail(`version.json.version is not valid semver: ${newVer}`);
}
if (semver.eq(newVer, oldVer)) {
  fail(
    `version.json.version (${newVer}) equals package.json (${oldVer}); nothing to release.\n` +
      'Bump the version in version.json first.'
  );
}
if (semver.lt(newVer, oldVer)) {
  fail(
    `version.json.version (${newVer}) is lower than package.json (${oldVer}); downgrades are not allowed.`
  );
}
if (!versionJson.releaseNotes || !versionJson.releaseNotes.trim()) {
  fail('version.json.releaseNotes must be non-empty (short text for the update dialog).');
}

console.log(`\n▶ Releasing 1TXT v${oldVer} → v${newVer}`);
console.log(`  release notes: ${versionJson.releaseNotes.split('\n')[0].slice(0, 60)}…`);

// ---- 2. Git working tree ------------------------------------------------------

step(1, 'Check git working tree');
const status = shOut('git status --porcelain');
const dirtyOther = status
  .split('\n')
  .filter(Boolean)
  .filter((line) => !/\sversion\.json$/.test(line));
if (dirtyOther.length > 0) {
  console.error('  Uncommitted changes (other than version.json):');
  console.error('  ' + dirtyOther.join('\n  '));
  fail('Commit or stash everything except version.json before releasing.');
}

// ---- 3. Sync package.json.version -------------------------------------------

step(2, `Sync package.json.version → ${newVer}`);
packageJson.version = newVer;
writeJson(PACKAGE_JSON, packageJson);

// ---- 4. Optional build --------------------------------------------------------

const buildTarget = flagValue('--build');
if (buildTarget) {
  step(3, `Build ${buildTarget}`);
  sh(`npm run build:${buildTarget}`);
} else {
  console.log('\n[3] Skipping build (pass --build win or run npm run build:win later)');
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
  console.log('\n[5] Skipping push (--skip-push)');
}

// ---- 7. Next steps ----------------------------------------------------------

const newReleaseUrl = `${REPO_URL}/releases/new?tag=v${newVer}&title=v${newVer}`;
console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log(`  ✓ v${newVer} is on git; version.json is in effect after push.`);
console.log('═══════════════════════════════════════════════════════════');
console.log('');
console.log('Next (manual, ~1–2 min):');
console.log(`  1. Open: ${newReleaseUrl}`);
console.log(`  2. Upload artifacts from release/ (.exe, .zip, .dmg, …)`);
console.log(`  3. Paste release notes from RELEASE-NOTES.md or version.json`);
console.log(`  4. Click “Publish release”`);
console.log('');
console.log(`Clients may take 5–10 minutes (GitHub raw CDN) to see the new version.`);
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
