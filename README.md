# 1TXT

> **Open-source minimalist Markdown notes with live preview (Typora-style) and free multi-device sync.**
> A modern, Supabase-powered rewrite of Simplenote — a lightweight open-source alternative to Notion, Evernote, and Bear.

[![License: GPL v2](https://img.shields.io/badge/License-GPLv2-blue.svg)](LICENSE.md)
[![Built on Simplenote](https://img.shields.io/badge/forked%20from-Automattic%2Fsimplenote--electron-orange)](https://github.com/Automattic/simplenote-electron)
[![Editor: Vditor](https://img.shields.io/badge/editor-Vditor-green)](https://github.com/Vanessa219/vditor)
[![Backend: Supabase](https://img.shields.io/badge/sync-Supabase-3ECF8E)](https://supabase.com)

1TXT keeps the polished UX of Simplenote and replaces the proprietary Simperium backend with a **Supabase** (PostgreSQL + Realtime) sync layer that you control. Notes still sync between devices in real time, but the data stays in your own project.

## Built on top of two great open-source projects

1TXT would not exist without:

- **[Simplenote for Electron](https://github.com/Automattic/simplenote-electron)** by Automattic — the entire desktop shell, note-list UI, search, tagging, settings, dialogs, theming, packaging pipeline, and most of the Redux state graph come from here. Licensed under **GPL-2.0**, which 1TXT inherits.
- **[Vditor](https://github.com/Vanessa219/vditor)** by Vanessa219 — the Markdown WYSIWYG / split / IR editor that replaces Simplenote's plain textarea. Licensed under **MIT**.

The diff-patch sync algorithm also reuses `jsondiff` / `change` utilities from [`node-simperium`](https://github.com/Simperium/node-simperium) (Simperium client SDK, MIT-licensed).

> ⚖️ **License**: Because Simplenote is GPL-2.0, this fork is also distributed under **GPL-2.0** — see [`LICENSE.md`](LICENSE.md). MIT-licensed dependencies (Vditor, node-simperium) are compatible and re-distributed under the project's GPL-2.0 umbrella.

## What's different from upstream Simplenote?

| Area              | Upstream Simplenote                  | 1TXT                                                                |
| ----------------- | ------------------------------------ | ------------------------------------------------------------------- |
| Auth              | Simperium accounts (email + WP.com)  | Supabase email OTP (one-time code)                                  |
| Sync backend      | Simperium                            | Supabase Postgres + Realtime (diff-patch protocol, see docs)        |
| Editor            | Plain `<textarea>` + Markdown toggle | [Vditor](https://github.com/Vanessa219/vditor) WYSIWYG / split / IR |
| Sidebar           | Fixed width                          | Drag-to-resize, width persisted to `localStorage`                   |
| Per-note status   | None                                 | "syncing" indicator on the active note + offline warning icon       |
| Default new notes | Inherit from current note            | Markdown enabled by default for brand-new accounts                  |

The diff-patch sync layer reuses the proven `jsondiff` / `change` algorithms from [`node-simperium`](https://github.com/Simperium/node-simperium) but pipes them through Supabase tables (`note_ghosts`, `note_changes`, `sync_cursors`). See [`docs/碎片同步分析.md`](docs/碎片同步分析.md) for the design write-up.

---

## Quick start

### 1. Prerequisites

- Node.js 18+ and npm
- A free Supabase project — sign up at <https://supabase.com>

### 2. Set up the Supabase backend

1. In your Supabase project, open **SQL Editor → New query**.
2. Paste the contents of [`docs/schema.sql`](docs/schema.sql) and **Run**. This creates the three tables (`note_ghosts`, `note_changes`, `sync_cursors`), enables row-level security, and sets up a `pg_notify` trigger that powers Supabase Realtime.
3. Open **Authentication → Providers → Email** and make sure **Email OTP** is enabled (it is on by default).
4. Open **Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon / public key** → `SUPABASE_KEY`

> The anon key is meant to be embedded in client apps; row-level security in `docs/schema.sql` ensures one user can never read another user's notes.

### 3. Configure the app

Pick **one** of the following:

**Option A — `.env` file (recommended)**

```bash
cp .env.example .env
# edit .env and paste your SUPABASE_URL / SUPABASE_KEY
```

`webpack.config.js` reads `.env` at build time and overrides the matching keys in `config.json`. The `.env` file is gitignored.

**Option B — local `config.json`**

```bash
cp config.sample.json config.json
# edit config.json and fill in supabase_url / supabase_key
```

`config.json` is gitignored, so your credentials never get committed. (`config.sample.json` is the tracked template.)

### 4. Run

```bash
npm install --legacy-peer-deps
npm run dev
```

The dev server starts on <http://localhost:4000> and Electron launches automatically. Sign in with your email — Supabase will mail you a 6-digit code.

> The `--legacy-peer-deps` flag is required because `react-monaco-editor` pins a specific `monaco-editor` version that npm 7+ otherwise rejects.

---

## Building distributable packages

```bash
make package-win32   # Windows
make package-osx     # macOS
make package-linux   # Linux (requires rpm: brew install rpm on macOS)
```

---

## Project layout (sync-related)

```
lib/sync/
  middleware.ts        # Redux middleware: queues local edits, debounces (300ms),
                       # dispatches SUBMIT/ACKNOWLEDGE_PENDING_CHANGE
  sync-channel.ts      # Diff-patch engine: full index, incremental sync,
                       # Realtime subscription, conflict resolution
  supabase-client.ts   # Singleton Supabase client (avoids GoTrueClient warnings)

lib/state/simperium/reducer.ts
                       # `pendingChanges: Set<EntityId>` slice powering the
                       # per-note "syncing" indicator

docs/
  schema.sql                       # Run this in Supabase SQL Editor
  碎片同步分析.md                  # Design doc for the diff-patch protocol
  diagnose-sync.sql                # Quick health check (uses auth.uid())
  问题与解决.md                    # Changelog of fixed issues
```

---

## Troubleshooting

- **"Multiple GoTrueClient instances detected"** — should not happen anymore; both the auth flow and sync layer share `lib/sync/supabase-client.ts`. If you still see it, you've added a fresh `createClient()` call somewhere.
- **No notes after login** — open Supabase SQL Editor and run [`docs/diagnose-sync.sql`](docs/diagnose-sync.sql). It will show ghost / change / cursor counts for the currently logged-in user.
- **`Skipping corrupted patch: TypeError`** — harmless; happens during historical revision reconstruction when forward-replaying an empty base. Logged at `debug` level only in development.
- **Build fails with "Could not load the required configuration file"** — you skipped step 3. Either create `.env` or copy `config.sample.json` to `config.json`.

---

## Coding guidelines

Please follow the [wp-calypso coding guidelines](https://github.com/Automattic/wp-calypso/blob/master/docs/coding-guidelines.md) (inherited from the Simplenote codebase). See [`CONTRIBUTING.md`](CONTRIBUTING.md) for more.

## License

**GPL-2.0**, inherited from upstream Simplenote. See [`LICENSE.md`](LICENSE.md).

The full attribution to upstream projects is at the top of this README.
