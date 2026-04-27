# Cloud Quota and Revision History

This document describes the 1TXT storage model: how per-user quota is calculated, how revision history is stored and cleaned up, and how these two parts work together. Updated for the v3 → v3.1 schema migration.

## Summary

- **Quota:** 1 MiB per user, counted only by the **byte length** of the **current** note body.
- **Snapshots:** After every successful sync ACK, a **full** snapshot is written to an independent `note_revisions` table. Snapshots are **not counted** toward the quota above.
- **Cleanup:** Time-bucket retention close to Simplenote—same day: keep all; 1–7 days: keep one per day; 7–30 days: keep one per week; >30 days: delete.

## What Counts Toward the 1 MiB Limit

Specifically, `octet_length(content)` of each **active** note in `note_ghosts`.

| Source                              | Counted?                             |
| ----------------------------------- | ------------------------------------ |
| Current note body (`content` field) | Yes                                  |
| Note tags / metadata                | No                                   |
| Snapshot rows in `note_revisions`   | No                                   |
| Patch rows in `note_changes`        | No                                   |
| Notes in Trash                      | Yes (still present in `note_ghosts`) |

Emptying Trash releases those bytes.

## Where the Limit Is Enforced

```
client edit
   │
   ▼
note_ghosts upsert ── BEFORE INSERT/UPDATE ──► check_ghost_quota()
                                                 │
                                                 │  used + delta > cap?
                                                 ├── yes ► RAISE EXCEPTION
                                                 │         SQLSTATE 53100
                                                 ▼
                                              allow
                                                 │
                                       AFTER INSERT/UPDATE/DELETE
                                                 │
                                                 ▼
                                       update_ghost_used_bytes()
                                                 │
                                                 ▼
                                user_profiles.used_bytes += delta
```

These two functions are defined in section 14 of [`docs/schema.sql`](schema.sql); for existing projects see [`migrate-v3-to-v3.1.sql`](migrate-v3-to-v3.1.sql).

On the client side, [`lib/sync/sync-channel.ts`](../lib/sync/sync-channel.ts) detects SQLSTATE `53100` (`disk_full`), drops the offending change from the queue, and emits `quota-exceeded`. Middleware maps this to `SET_QUOTA_EXCEEDED`, and `<QuotaIndicator>` shows a dialog. Editing still writes to IndexedDB until the user frees up space.

## How It Is Displayed in the UI

- Settings → Account: `0.3 / 1.0 MiB` with a thin bar; amber above 80%, red when over limit.
- A one-time popup when the server first rejects an upload.
- Tooltip explains: only **current** note body is counted; revision history is **not** counted.

## How Revision History Is Stored

A dedicated table, **not** reconstructed by replaying patch chains.

```sql
CREATE TABLE note_revisions (
  id, user_id, note_id, version, content, created_at,
  UNIQUE (user_id, note_id, version)
);
```

Each time ACK succeeds in [`SupabaseSyncChannel.sendChange`](../lib/sync/sync-channel.ts), `recordRevision()` inserts the post-ACK ghost snapshot **as-is**. Failure to insert here must **never** fail the overall sync ACK—the user-visible “saved” state must always remain valid.

Reading history requires only one query:

`SELECT version, content FROM note_revisions WHERE user_id = ? AND note_id = ? ORDER BY version`

No replay required, and no dependency on fragile initial state.

## Cleanup Tiers

`cleanup_old_revisions()` is idempotent and safe to run repeatedly. Policy:

| Time Window | Policy                           |
| ----------- | -------------------------------- |
| < 1 day     | Keep all snapshots               |
| 1 – 7 days  | Keep latest per (note, day)      |
| 7 – 30 days | Keep latest per (note, ISO week) |
| > 30 days   | Delete                           |

You can schedule it daily with pg_cron (commented example in `schema.sql`):

```sql
SELECT cron.schedule('cleanup-revisions', '15 3 * * *',
                     'SELECT cleanup_old_revisions()');
```

The patch table also has `cleanup_old_changes()` with similar bucketing; the two are independent.

## Why Use a Separate Table?

The v3 sync protocol stores deltas in `note_changes`. Reconstructing historical snapshots from deltas requires replaying the entire chain from a known baseline. The old implementation tried replaying from `{}`, but jsondiff string patches require an **exact** baseline—most `change.apply()` calls failed silently and were skipped, so users often saw only the latest ghost.

Decoupling history into a dedicated table fully avoids this issue:

- Delta flow can be aggressively cleaned up (retain only enough for offline catch-up).
- Snapshot cleanup can follow user-visible retention policy (table above).
- History reads become one indexed `SELECT` instead of O(chain length) replay.

This is a common pattern in cloud note products (Simplenote, Notion, Google Keep, etc.).

## Free vs Paid (Placeholder)

`user_profiles` has a `plan` column (default `free`), but plan-based branching is not implemented yet. When paid tiers are added, the main change should be increasing `quota_bytes` for eligible users.

## Related Files

- [`docs/schema.sql`](schema.sql) — current schema (sections 12–14).
- [`docs/migrate-v3-to-v3.1.sql`](migrate-v3-to-v3.1.sql) — migration script for existing v3 projects.
- [`lib/sync/sync-channel.ts`](../lib/sync/sync-channel.ts) — client quota and revision recording.
- [`lib/sync/middleware.ts`](../lib/sync/middleware.ts) — Redux integration.
- [`lib/quota-indicator/`](../lib/quota-indicator/) — quota UI.
- [`lib/state/quota/reducer.ts`](../lib/state/quota/reducer.ts) — Redux slice.
