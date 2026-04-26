# 1TXT versioning and updates

> How version numbers, releases, user upgrades, and data migration are handled.  
> The updater is **minimal**: check → dialog → open the download page in the browser. No silent download or silent install.

> **中文:** [版本号与升级.md](./版本号与升级.md)

---

## Quick checklist (release in three steps)

```
1. Edit version.json (bump version + releaseNotes)
2. npm run release:win
3. Browser opens GitHub “New release” → drag artifacts from release/ → Publish
```

Details below (start at Section 3).

---

## 1. SemVer

Format `MAJOR.MINOR.PATCH`, per [Semantic Versioning 2.0](https://semver.org/).

| Bump | When | Example |
|------|------|---------|
| **PATCH** | Bug fixes, small tweaks, copy edits | `1.0.0` → `1.0.1`: fix “sync icon lag” |
| **MINOR** | Backward-compatible features | `1.0.1` → `1.1.0`: folders, export PDF |
| **MAJOR** | Breaking changes: schema incompatible, required migration | `1.x` → `2.0.0`: Supabase layout change |

> **Data migration usually implies MAJOR.** If old IndexedDB or remote tables cannot be read without a migration path, bump MAJOR and plan a forced upgrade (Section 4.3).

---

## 2. Single source of truth

> Maintain the version **only** in repo-root **`version.json`**.  
> Release automation syncs everything else — do not hand-edit `package.json` for releases.

| Location | Maintainer | How it updates |
|----------|------------|----------------|
| **`version.json`** | **You** | Edit before each release |
| `package.json` `version` | Script | `npm run release` |
| `webpack.config.js` | Build | Reads `package.json` |
| `desktop/config/index.js` | App | Reads `package.json` |
| Running app | Electron | `app.getVersion()` |
| `electron-builder.json` artifacts | Builder | `${version}` |
| About dialog | UI | `config.version` |
| Git tag `v1.0.0` | Script | Created on release |

Clients may fetch metadata from:

`https://raw.githubusercontent.com/airdropdogs/1txt/main/version.json`

**Pushing `version.json` is what makes clients notice a new version** — no extra server is required.

---

## 3. Release flow

### Step 1 — Edit `version.json`

```json
{
  "version": "1.1.0",
  "downloadPageUrl": "https://github.com/airdropdogs/1txt/releases/latest",
  "webAppUrl": "https://your-web-app.example",
  "releaseNotes": "Folder groups, offline toggle. Sync icon fix.",
  "minSupportedVersion": "1.0.0",
  "force": false
}
```

Usually change `version` and `releaseNotes`. `releaseNotes` is short copy for the in-app dialog; full changelog lives in `RELEASE-NOTES.md` (optional).

### Step 2 — Run one command

```powershell
# Windows build (recommended)
npm run release:win

# Version bump only (e.g. CI builds elsewhere)
npm run release
```

The script:

1. Validates `version.json` (semver, greater than current `package.json`).
2. Ensures a clean working tree (except `version.json` edits).
3. Copies `version.json.version` → `package.json`.
4. With `:win`, runs `npm run build:win` (ZIP + NSIS).
5. `git add`, `commit`, `tag vX.Y.Z`, `push --follow-tags`.
6. On Windows: opens `release\` and the GitHub “New release” URL.

### Step 2.5 — Manual (about one minute)

Upload `release/` artifacts on GitHub Releases and publish.

> Skipping this still lets the app **see** the new version via `version.json`, but users who click “Download” expect files on the Releases page — publish them.

### Errors

The script aborts on failure; fix and re-run. Typical messages:

- Version unchanged — edit `version.json` to a higher semver.
- Dirty tree — commit unrelated work first.

---

## 4. Updater (user experience)

### 4.1 Design

| | Choice |
|---|--------|
| Auto-download | No |
| Silent install | No |
| Dialog | Yes |
| “Download” opens browser | Yes |
| “Skip this version” | Yes |
| Forced upgrade | Yes (for emergencies) |

Portable ZIP and NSIS builds use the **same** logic.

### 4.2 Normal update

About **5 seconds** after launch, the main process fetches `version.json`. If:

- `version.json.version` > `app.getVersion()`, and  
- the user has not skipped this version,

show:

```
+------------------------------------------+
|  Update available                        |
|                                          |
|  1TXT 1.1.0 is out                       |
|                                          |
|  Current: 1.0.0                          |
|  Latest:  1.1.0                          |
|                                          |
|  Folder groups and offline mode...       |
|                                          |
|  "Download" opens the download page      |
|  in your browser.                        |
|                                          |
|  [Download]  [Skip this version]  [Later]|
+------------------------------------------+
```

| Button | Behavior |
|--------|----------|
| Download | `shell.openExternal(downloadPageUrl)` |
| Skip this version | Writes version to `userData/skipped-versions.json`; no prompt for that version again |
| Later | Close; prompt again next launch |

**Help → Check for Updates…** triggers the same check manually.

### 4.3 Forced upgrade

If **`force: true`** or **`minSupportedVersion`** rules apply, show a blocking dialog (no skip):

```
+------------------------------------------+
|  Upgrade required                        |
|                                          |
|  This version is no longer supported.    |
|                                          |
|  Current: 1.0.0                        |
|  Latest:  2.0.0                        |
|                                          |
|  Sync protocol or data format changed.   |
|  Please upgrade to continue.            |
|                                          |
|  [Upgrade desktop]  [Use web app]  [Quit]|
+------------------------------------------+
```

| Button | Behavior |
|--------|----------|
| Upgrade desktop | Open download page, **quit app** |
| Use web app | Open `webAppUrl`, **quit app** |
| Quit | Exit |

### 4.4 Client config (`desktop/config-updater.json`)

```json
{
  "updater": {
    "metadataUrl": "https://raw.githubusercontent.com/airdropdogs/1txt/main/version.json",
    "downloadPageUrl": "https://github.com/airdropdogs/1txt/releases/latest",
    "webAppUrl": "https://your-web-app.example",
    "delay": 5000
  }
}
```

Set `metadataUrl` to `""` to disable checks (no error).

You may point `metadataUrl` at your own HTTPS host if you self-host the same JSON shape — no app code change required.

---

## 5. Migration strategy

### 5.1 PATCH (`1.0.0` → `1.0.1`)

Low risk: schema unchanged; install over the previous build.

### 5.2 MINOR (`1.0.0` → `1.1.0`)

Backward compatible: add nullable columns first; default new features off; avoid renames/removals without a bridge.

### 5.3 MAJOR (`1.x` → `2.0.0`)

1. Ship a SQL migration (e.g. `docs/migrations/v1-to-v2.sql`) for Supabase.
2. Handle IndexedDB upgrades in `lib/state/persistence.ts` (`onupgradeneeded`).
3. Set `version.json`, e.g.:

```json
{
  "version": "2.0.0",
  "minSupportedVersion": "2.0.0",
  "force": true,
  "releaseNotes": "Major upgrade: run the database migration from the release notes."
}
```

4. Document backup, steps, and rollback on the download page.

---

## 6. Testing a build

```powershell
npm run build:win
# Run release\1TXT-Setup-1.1.0-x64.exe
# Or unzip release\1TXT-1.1.0-win-x64.zip to a temp folder
```

Optional beta channel: host another `version.json` on a `beta` branch and point `metadataUrl` at its raw URL — no second installer required.

---

## 7. FAQ

### 7.1 Data after uninstall?

- **NSIS**: `deleteAppDataOnUninstall: false` — `%APPDATA%/1TXT` is kept.
- **Portable**: data lives in `1txt-data/` next to the EXE; deleting the folder removes it.
- Cloud: sign in again to pull from Supabase.

### 7.2 Portable ZIP upgrade path

1. Dialog → Download → get new ZIP.  
2. Extract to a **new** folder.  
3. **Move** the old `1txt-data/` into the new folder (settings + session).  
4. Remove the old folder; launch the new EXE.

Document this on the download page.

### 7.3 NSIS upgrade path

Download new `Setup.exe` and run it over the old install; `%APPDATA%/1TXT` is preserved.

### 7.4 Force old clients to upgrade

Raise `minSupportedVersion` in `version.json` (and optionally `force`). No client code change.

### 7.5 No server deployed?

If `metadataUrl` fails, the error is swallowed for automatic checks; manual **Check for updates** may show a connection message.

### 7.6 Disable updates entirely

Set `metadataUrl` to `""` in `desktop/config-updater.json`.

---

## 8. Hosting notes

### 8.1 No dedicated server required

- Metadata: GitHub raw `version.json`
- Binaries: GitHub Releases

### 8.2 GitHub raw cache

Expect ~5–10 minutes before all users see a newly pushed `version.json`. Normal for releases.

### 8.3 Custom domain (optional)

Host the same JSON at `https://your-domain.example/version.json` and set `metadataUrl` accordingly. `webAppUrl` is used by the forced-upgrade “Use web app” action.

---

## 9. Files involved

| File | Role |
|------|------|
| **`version.json`** | Source of truth + remote metadata |
| `package.json` | Synced version; do not edit for releases |
| `scripts/release.js` | Release automation |
| `desktop/updater/index.js` | Updater client |
| `desktop/config-updater.json` | URLs + delay |
| `desktop/menus/menu-items.js` | Help → Check for updates |
| `desktop/app.js` | Calls updater after launch |
| `electron-builder.json` | Versioned artifact names |
| `RELEASE-NOTES.md` | Human-readable changelog |
| `docs/windows-packaging.md` (中文: `安装版和解压版的生成.md`) | Windows ZIP + NSIS details |
