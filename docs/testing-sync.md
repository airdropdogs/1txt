# Sync — Manual Test Plan

This is the smoke / regression test plan for the Supabase diff-patch sync
that lives in `lib/sync/`. Sync is the most important subsystem in 1TXT:
**no test pass on this list = no release**.

The plan deliberately uses only what a normal user can do (toggling Wi-Fi,
opening DevTools, running `localStorage.clear()`). No test infrastructure
is required.

> Tip: keep the DevTools **Network** tab open with the _Offline_ toggle, and
> the **Console** filtered to `[Sync]` / `[SyncChannel]` so you can see the
> internal events in real time.

---

## 0. Setup

1. Two devices (or two profiles): we'll call them **A** and **B**.
   - A separate browser profile / Electron window counts as a second
     device because each gets its own `clientId`.
2. Both signed into the same account, both fully synced (verify by
   creating a "ping" note on A and seeing it appear on B).
3. Open DevTools on at least A.

---

## 1. Connection-status indicator

The per-note sync indicator is a single spinning icon. It's visible
whenever the note has unsynced edits, regardless of online/offline. The
network-state nuance lives in the tooltip you get on hover.

| Step                                  | Expected                                                                                                                                                                    |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Toggle DevTools → Network → _Offline_ | Within ~1s, navigation footer shows the disconnected icon. Tooltip: _"You're offline. Edits are saved locally..."_                                                          |
| Type into a note while offline        | A spinner appears in the sidebar next to the note's title and **stays put** while you type. Hover: _"Offline — your edits are saved locally… Last successful sync: N ago."_ |
| Toggle network back on                | Footer returns to the connected state. Spinner disappears as soon as the server ACK arrives.                                                                                |
| Quit and re-launch while offline      | Local notes load; the footer shows offline; previously-edited notes still show the spinner (because they haven't been ACK'd).                                               |

Pass criteria:

- The spinner **never flashes** off during a typing burst.
- It disappears only after a real server ACK (or a handled 23505 duplicate).
- Hover tooltip always tells you the last successful sync time so a long-running spinner is never a mystery.

---

## 2. Offline edits survive going back online

1. With network on, type "online text" into a note. Wait until the icon
   clears.
2. Network → _Offline_.
3. Append "[OFFLINE]" to the same note.
4. Append "[OFFLINE 2]" to a different note.
5. Network → _Online_.

Expected:

- Both notes' offline edits remain in the editor.
- Within ~5s the per-note exclamation icons disappear (ACK).
- On device B, the edits arrive automatically.
- Console shows at most a `409 (Conflict)` for the very first resend —
  this is expected (see §6).

Fail signals:

- Edits silently disappear when the network returns.
- Console shows repeated 409s for the same note over and over.

---

## 3. Conflict resolution (concurrent edits)

This is the case the OT logic in `applyRemoteChange()` is supposed to
handle.

1. Open the same note on A and B.
2. Network → _Offline_ on A only.
3. On A, prepend "AAA " to the title.
4. On B, append " BBB" to the title.
5. Wait until B's edit is acknowledged (icon clears on B).
6. Re-enable network on A.

Expected:

- A's title ends up as `AAA <original> BBB` (or the equivalent merged
  result — both edits preserved).
- B sees the same final value within a few seconds.
- No `[SyncChannel] Version mismatch` warnings; no notes lost.

Fail signals:

- Either edit is lost.
- The note bounces between values for several seconds.

---

## 4. Tags survive a re-login / fresh boot

This guards against the regression where remote notes arrived but the
sidebar tag list stayed empty.

1. Add tag `#test-sync-tag` to a note on A. Wait for ACK.
2. Verify the tag appears in the navigation bar's tag list.
3. Sign out → sign in again on A.
4. **Or**: clear `localStorage` and reload — this forces a full re-index.

Expected:

- After the loading screen disappears, the tag list contains
  `test-sync-tag` with the correct note count.
- Clicking the tag filters down to the tagged note(s).

Fail signals:

- Tag list is empty or missing entries.
- Notes show their tags inline but the sidebar shows nothing.

---

## 5. Crash / kill recovery

1. Type a few sentences into a note.
2. **Immediately** kill the process — Task Manager → End Task — _before_
   the icon clears.
3. Relaunch.

Expected:

- The note shows the typed content (it lives in the LocalQueue + ghost
  cache in `localStorage`).
- The pending icon is still showing (we never got an ACK).
- Once the network is up, the change goes out and the icon clears.

Fail signals:

- Last few seconds of typing are lost.
- App boots but never finishes syncing.

---

## 6. The "expected" 409 conflict

When you toggle from offline → online, you may see one or two of these
in the console:

```
POST .../note_changes 409 (Conflict)
```

This is **normal** and is the same scenario Simperium handles internally:

1. While offline, the request was queued in `LocalQueue.sent[]`.
2. The OS dropped the network _after_ the server received the insert
   but _before_ we got the response.
3. On reconnect, `flushPending()` resends the same `Change` (same
   `ccid`).
4. The DB unique constraint on `(user_id, note_id, ccid)` returns
   23505 → PostgREST translates it to HTTP 409.
5. Our handler treats this as an ACK, refreshes the ghost from the
   server (so subsequent `sv` aligns), and continues.

Pass criteria:

- The 409 appears **once per affected note**, not on every keystroke.
- After it, the note keeps syncing normally (try editing again — should
  go through cleanly with no further 409).

If you see 409 on every send: something is wrong with `sv`/`ev`
bookkeeping; check `note_ghosts.version` vs the latest `note_changes.ev`
in Supabase.

---

## 7. Multi-device convergence

1. Create note on A → wait for ACK.
2. On B, edit the note.
3. On A, immediately edit the same note (different sentence).
4. Repeat alternating edits 5–6 times rapidly.

Expected:

- Both devices converge to the same final content within ~5s of the last
  edit.
- The merged result preserves _all_ edits (no silent drops).

---

## 8. Quick CV / index sanity check

Run in the Supabase SQL editor (or via `docs/diagnose-sync.sql`):

```sql
-- Latest change per note vs. ghost version — should be in lockstep
select g.note_id, g.version as ghost_v, c.ev as latest_ev
from note_ghosts g
left join lateral (
  select ev from note_changes
  where note_changes.note_id = g.note_id
  order by ev desc limit 1
) c on true
where g.user_id = '<your-user-id>'
order by g.note_id;
```

Pass criteria:

- For every row, `ghost_v = latest_ev` (modulo a brief race during a
  send-in-progress).
- No NULLs unless the note has been deleted.

---

## What "broken" looks like in the console

| Symptom                                                               | Likely cause                                                                                                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `Version mismatch for <id>: ghost=A, sv=B` repeating                  | Local ghost out of sync; `refreshGhostFromServer` should auto-recover. If it doesn't, clear `localStorage` to force a full re-index. |
| Repeated `409 (Conflict)` for the same note                           | A change is being re-emitted in a loop; verify `acknowledge` is firing in `LocalQueue`.                                              |
| `REMOTE_NOTE_UPDATE` arriving but tag list empty                      | The `tags` / `noteTags` reducers don't handle the action (regression).                                                               |
| Per-note spinner blips off mid-typing or immediately after a debounce | `clearPendingSyncIcon` is being called outside the ACK path (regression).                                                            |

---

## Files involved

- `lib/sync/sync-channel.ts` — diff/patch transport, OT, ghost store
- `lib/sync/local-queue.ts` — per-note send queue, natural compression
- `lib/sync/middleware.ts` — Redux ↔ SyncChannel bridge, online/offline
  listeners, per-note pending-flag bookkeeping
- `lib/state/data/reducer.ts` — `notes`, `tags`, `noteTags` reducers (must
  all stay aware of `REMOTE_NOTE_UPDATE`)
- `lib/connection-status/index.tsx` — global footer indicator
- `lib/note-list/note-cell.tsx` — per-note icon

If a bug straddles more than one of these files, prefer adding the test
case here over fixing in isolation.
