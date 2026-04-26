# 1TXT Desktop — Windows NSIS installer vs portable ZIP

> The 1TXT desktop app uses Electron and electron-builder. On Windows we ship **two formats** that can **coexist on the same machine**. The default config builds both in one run.

> **中文:** [安装版和解压版的生成.md](./安装版和解压版的生成.md)

---

## 1. At a glance

| | Portable ZIP | NSIS installer |
|---|--------------|----------------|
| Artifact | `1TXT-1.0.0-win-x64.zip` | `1TXT-Setup-1.0.0-x64.exe` |
| Size (approx.) | ~163 MB | ~95 MB (NSIS uses LZMA; smaller download) |
| Install | Extract and run; no registry / Start Menu | Wizard; registry + shortcuts |
| Startup | **Fast** | **Fast** (both launch the app directly; no per-run extraction) |
| User data | Next to the EXE: `1txt-data\` | `%APPDATA%\1TXT\` |
| Uninstall | Delete the folder | Control Panel → Programs and Features |
| Updates | Re-download ZIP and replace (data preserved) | Run new installer (or use in-app update flow) |
| Best for | Try-out, no admin rights, USB stick | Daily use, shortcuts, tighter OS integration |
| Move to another PC | Copy the whole folder (includes data & session) | Fresh install; sign in again for cloud sync |

---

## 2. One build, two artifacts (recommended)

Both targets are listed under `win.target` in `electron-builder.json`:

```json
  "win": {
    "icon": "resources/images/simplenote.ico",
    "artifactName": "1TXT-${version}-win-${arch}.${ext}",
    "target": [
      {
        "target": "zip",
        "arch": ["x64"]
      },
      {
        "target": "nsis",
        "arch": ["x64"]
      }
    ]
  },
```

Run:

```powershell
npm run build:win
```

After a successful build, `release\` contains:

```
release\
├── 1TXT-1.0.0-win-x64.zip          ← portable
└── 1TXT-Setup-1.0.0-x64.exe        ← installer
```

---

## 3. Only one format?

Scripts in `package.json`:

```bash
# ZIP only
npm run build:win:zip

# NSIS only
npm run build:win:nsis
```

These pass a target filter to `electron-builder`; they do not change `electron-builder.json`.

---

## 4. When `release/` is locked (EBUSY)

Antivirus or IDEs sometimes keep `app.asar` open so the next build cannot clean `release\win-unpacked\`.

Try in order:

1. **Quit any running `1TXT.exe`** (including one started from `release\win-unpacked\`).
2. **Pause real-time AV** for a minute, then run `npm run build:win` again.
3. **Restart Cursor or reboot** — most reliable.
4. **Rename** the old `release\` folder, then build again into a fresh `release\`.

---

## 5. Fast dev iteration (`pack:win`)

To smoke-test without ZIP/NSIS:

```powershell
npm run pack:win
```

Output: `release\win-unpacked\1TXT.exe` — double-click to run.

---

## 6. Coexistence: installer vs portable

> Common question: do they share the same data? **No.**

On startup, `desktop/app.js` detects “portable” vs system install and sets Electron `userData`:

```javascript
// --- Portable / "green" mode: redirect userData next to the EXE ---
// (from desktop/app.js)
const SYSTEM_INSTALL_PATTERNS = [
  /\\Program Files( \(x86\))?\\/i,
  /\\WindowsApps\\/i,
  /\\AppData\\Local\\Programs\\/i,
  /^\/Applications\//,
  /^\/usr\//,
  /^\/opt\//,
];

if (app.isPackaged) {
  const exeDir = path.dirname(app.getPath('exe'));
  const isSystemInstall = SYSTEM_INSTALL_PATTERNS.some((re) => re.test(exeDir));
  if (!isSystemInstall) {
    const portableUserData = path.join(exeDir, '1txt-data');
    app.setPath('userData', portableUserData);
    app.setPath('appData', portableUserData);
    app.setPath('logs', path.join(portableUserData, 'logs'));
  }
}
```

| EXE location | Mode | User data |
|--------------|------|-----------|
| `D:\Tools\1TXT\1TXT.exe` (arbitrary folder) | **Portable** | `D:\Tools\1TXT\1txt-data\` |
| `C:\Users\...\AppData\Local\Programs\1TXT\1TXT.exe` (NSIS default, `perMachine: false`) | **Installed** | `%APPDATA%\1TXT\` |
| `C:\Program Files\1TXT\1TXT.exe` (`perMachine: true`) | **Installed** | `%APPDATA%\1TXT\` |
| `npm run dev` (`app.isPackaged === false`) | **Dev** | `%APPDATA%\1TXT\` |

If a user installs NSIS **and** keeps a portable copy on `D:`:

- Two **separate** profiles (`userData` paths differ).
- Notes do not merge unless both sign in to the **same** Supabase account (cloud sync).

To avoid confusion, pick one format for daily use. Many teams suggest portable first, then installer once users commit.

---

## 7. Optional size wins (reference build `1.0.0`)

| Artifact | Size |
|----------|------|
| ZIP | ~163 MB |
| NSIS EXE | ~95 MB |
| Unpacked on disk | ~280 MB (Electron + Chromium + deps) |

Ideas for later:

1. Trim unused dependencies (e.g. lazy-load `monaco-editor` if still bundled).
2. `"compression": "maximum"` in electron-builder (smaller artifact, slower builds).
3. `electronLanguages: ["en-US"]` (or add locales you ship) to drop unused Chromium locales.

---

## 8. FAQ

**Why is the ZIP so much larger than the NSIS EXE?**  
NSIS uses LZMA; ZIP uses deflate. Unpacked contents are the same.

**Can portable and installer share one local database?**  
Only by removing the portable redirect in `desktop/app.js` (not recommended — you lose true portable behavior). Prefer **Supabase sync** for cross-device consistency.

**Conflict if both are installed?**  
No. They run as separate apps. Two windows, two accounts, or one account with realtime on both.

**What should GitHub Releases ship?**  
**Both.** In the release notes, point users to:
- Installer: `1TXT-Setup-1.0.0-x64.exe` — shortcuts, Start Menu, typical install.
- ZIP: `1TXT-1.0.0-win-x64.zip` — no admin rights, USB, quick try-out.

For release workflow and updater behavior, see [versioning-and-updates.md](./versioning-and-updates.md) (中文: [版本号与升级.md](./版本号与升级.md)).
