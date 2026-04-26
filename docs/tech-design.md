# 1TXT — Technical design & architecture

## Design principles

- **Never block the UI thread** on sync work.
- **Diff-patch transport** — send minimal patches, not whole documents.
- **Ghost consistency** — same mental model as Simperium’s ghost snapshot.

---

## 1. Auth bypass & session injection (Phase 1) — done

- `boot.ts` skips `AuthComponent`, injects a mock token.
- Auth UI treats the token as signed-in.

## 2. Redux IO & local vault (Phase 2) — done

- Simperium network middleware removed.
- `NOTE_UPDATE` → `fs.writeFile` (immediate disk write).
- Startup: `fs.readdir` loads `.md` files.

## 3. Supabase auth (Phase 3) — done

- Email OTP (`signInWithOtp` + `verifyOtp`).
- Custom SMTP (e.g. Resend).
- Session in `localStorage`.

---

## 4. Diff-patch sync (Phase 4) — current

### 4.1 Architecture

```
┌──────────────────────────────────────────────────────┐
│                     Client                           │
│                                                      │
│  [Editor] → NOTE_UPDATE → [VaultMiddleware]          │
│                              │                       │
│                    ┌─────────┴─────────┐             │
│                    │                   │             │
│              [fs.writeFile]    [SyncChannel]         │
│              (local disk)      │                     │
│                         ┌──────┴──────┐              │
│                   [LocalQueue]   [GhostStore]        │
│                         │             │              │
│                  diff(ghost, new)     │              │
│                         │             │              │
│                    ┌────┴────┐        │              │
│                    │  patch  │   [localStorage]      │
│                    └────┬────┘   (ghost cache)       │
│                         │                            │
└─────────────────────────┼────────────────────────────┘
                          │
                    ┌─────┴─────┐
                    │  Supabase │
                    │  ┌───────┐│
                    │  │ REST  ││ ← uplink: insert patch
                    │  ├───────┤│
                    │  │Realtime││ ← downlink: subscribe
                    │  ├───────┤│
                    │  │  DB   ││ ← note_ghosts + note_changes
                    │  └───────┘│
                    └───────────┘
```

### 4.2 Modules (`lib/sync/`)

```
lib/sync/
├── jsondiff.ts            ← Simperium jsondiff (reused)
│                            string diff (d), object (O),
│                            list (L), add (+), remove (-), replace (r)
├── diff-match-patch.ts    ← Google diff-match-patch (reused)
├── change.ts              ← Simperium change utils (reused)
│                            buildChange(), diff(), apply(), transform()
├── operation.ts           ← Simperium operation (reused)
├── ghost-store.ts         ← SupabaseGhostStore
│                            get/put/remove/getChangeVersion/setChangeVersion
│                            localStorage cache + Supabase persistence
├── sync-channel.ts        ← SupabaseSyncChannel
│                            uplink: insert into note_changes
│                            downlink: Realtime INSERT subscription
├── local-queue.ts         ← Simperium LocalQueue (reused)
│                            coalesces edits while waiting for ACK
└── index.ts               ← startSync(userId) / stopSync() / getSyncStatus()
```

### 4.3 Flow

#### Uplink (client → server)

```
1. Edit → NOTE_UPDATE
2. SyncChannel.update(noteId, newData)
3. GhostStore.get(noteId) → ghost snapshot
4. jsondiff.diff(ghost.data, newData) → patch
5. If empty → skip
6. Enqueue in LocalQueue
7. If another change is in flight for same note → wait; else send
8. supabase.from('note_changes').insert({ patch, sv, ev, ccid })
9. On ACK → GhostStore.put(noteId, newVersion, newData)
10. Drain queue
```

#### Downlink (server → client)

```
1. Realtime: INSERT on note_changes
2. Remote patch from another device
3. GhostStore.get(noteId)
4. Version check:
   - ghost.version === patch.sv → apply
   - else → fetch correct ghost
5. If no local pending edits → apply patch → update ghost → UI
6. If local pending → OT:
   a. localDiff = diff(ghost.data, localData)
   b. transformed = transform(localDiff, remotePatch, ghost.data)
   c. apply remotePatch → update ghost
   d. if transformed non-empty → re-queue uplink
7. emit('update', noteId, newData)
```

#### First sync (new device)

```
1. Read change version (CV) from local store
2. No CV → full index:
   a. Load all note_ghosts for user
   b. Write ghosts + vault files
   c. Save CV → incremental mode
3. Has CV → incremental:
   a. Fetch note_changes with created_at > CV
   b. Apply each; refresh ghost
   c. If CV invalid → full index again
```

### 4.4 Database

See [`schema.sql`](./schema.sql).

Core tables:

- `note_ghosts` — latest full JSON per note.
- `note_changes` — patch chain (JSONDiff output).
- `sync_cursors` — per-user sync cursor.

### 4.5 Conflicts

Operational transform as in Simperium (reused implementation):

```
Ghost v3: "Hello World"

Device A: "Hello Beautiful World" → patchA
Device B: "Hello World!" → patchB

patchB lands first → ghost v4: "Hello World!"

Device A receives patchB:
1. apply(ghost_v3, patchB) → "Hello World!" (ghost v4)
2. transform(patchA, patchB, ghost_v3) → transformedPatchA
3. apply("Hello World!", transformedPatchA) → "Hello Beautiful World!"
4. Send transformedPatchA → ghost v5

Result: both edits preserved → "Hello Beautiful World!"
```

### 4.6 Revision history

Same policy as Simperium’s client:

- ~60 precise revisions per note.
- Archived snapshot every 10 revisions, up to ~100 archives.
- ~1,060 changes covered before older diffs are pruned server-side.
