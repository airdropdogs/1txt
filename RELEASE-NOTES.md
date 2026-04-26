# 1TXT — Release notes

> Versions follow [Semantic Versioning 2.0](https://semver.org/) (`MAJOR.MINOR.PATCH`).  
> Release checklist & updater: [`docs/versioning-and-updates.md`](docs/versioning-and-updates.md).

---

## [1.0.0] — 2026-04-26

First public release.

### Highlights

- **Forked from Simplenote Electron** — keeps the fast list/search/settings UX and local caching model.
- **WYSIWYG Markdown** — [Vditor](https://github.com/Vanessa219/vditor) replaces the old plain editor for Typora-style editing.
- **Supabase sync** — replaces Simperium with PostgreSQL + Realtime:
  - `note_ghosts`, `note_changes`, `sync_cursors` (+ `user_profiles`)
  - Character-level diffs via `simperium`/`jsondiff`; small patches over the network
  - Realtime delivery for multi-device edits
- **Email OTP** — passwordless 6-digit codes via Supabase Auth.
- **Resizable sidebar** with persisted width.
- **Per-note sync indicator** — shows while edits are in flight (~300 ms debounce).
- **Offline warning** when the network drops; catches up when back online.
- **“Unsynced” cues** in the note list.
- **Markdown on by default** for new accounts.
- **~1 MB per note** — on the order of a million characters (enough for *The Count of Monte Cristo* and *A Tale of Two Cities* in plain text); not a media vault.

### Desktop / packaging

- Windows: **portable ZIP** and **NSIS installer** in one `npm run build:win`.
- Portable: user data next to the EXE in `1txt-data/`.
- Installed: user data under `%APPDATA%\1TXT\`.
- Updates: app fetches `version.json`, offers **Download / Skip / Later**; optional forced upgrade path. Same logic for ZIP and NSIS.

### Thanks

Built on:

- [Simplenote Electron](https://github.com/Automattic/simplenote-electron) (Automattic) — GPL-2.0. Upstream changelog: [RELEASE-NOTES.md](https://github.com/Automattic/simplenote-electron/blob/trunk/RELEASE-NOTES.md).
- [Vditor](https://github.com/Vanessa219/vditor) (Vanessa219) — MIT.

---

<!--
Template for future entries:

## [x.y.z] — YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Removed
- ...

### Security
- ...
-->
