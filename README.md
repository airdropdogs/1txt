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

## 为什么会有 1TXT — 作者的一段话

> *A personal note from the author. English readers can safely skim past — the rest of the README is in English.*

我在三个地方轮换办公：一个工作室、两个家。开工时桌面上一般同时挂着三个文档：一个在线文档、一个桌面笔记、还有一个 TXT。TXT 反而用得最多——它够轻，几百行、几千行扔进去都不卡。

可惜 TXT 没有同步。我试过市面上几乎所有的同步笔记软件，没有一个真正合心意：要么太重，要么按月收费太贵，要么多端经常互踢、登录麻烦，要么干脆没有 Markdown 所见即所得……

我要的其实只是一个**极简云文本**而已。

找不到，那就自己改一个。1TXT 是我从开源的 Simplenote 改出来的，按我自己想要的样子重造：

- **既是 Markdown 所见即所得编辑器，也是一块云端 TXT**——可以严肃做笔记，也可以纯当无限长的便签纸
- **开源免费，承诺不收费**。如果哪天用户多到服务器扛不住，会在角落挂个 Google AdSense 维持——做得够轻，服务器成本本来也不高
- **多端实时同步，不互踢**。三台机器同时挂着没问题，不会强制下线哪一端
- **碎片化即时云同步**——每次输入只传变动的几个字节，不是整篇文档来回搬
- **加密传输 + 双备份**——云端留历史版本，本地也存一份，文档不会丢
- **Web 端全平台**——浏览器打开就能用，无需安装

为这份"轻"，必然有取舍：

- **单文档容量 1 MB**（约一百万字符——够写一部完整的《西游记》）
- **没有文件夹**，扁平化是有意为之，用 tag 替代
- **纯文本**，不内嵌图片、表格组件等富媒体

如果这些痒处正好搔在你的位置上，欢迎试用。

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
