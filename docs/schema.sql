-- ============================================
-- 1TXT Supabase schema v3
-- Diff-patch sync edition
-- Run in Supabase Dashboard → SQL Editor
-- ============================================

-- ==========================================
-- 0. Drop legacy v2 objects (if present)
--    user_profiles is kept; structure stays compatible
-- ==========================================

-- Drop old triggers first, then functions
DROP TRIGGER IF EXISTS trigger_compute_content_size ON notes;
DROP TRIGGER IF EXISTS trigger_check_note_size ON notes;
DROP TRIGGER IF EXISTS trigger_check_user_quota ON notes;
DROP TRIGGER IF EXISTS trigger_update_used_bytes ON notes;
DROP TRIGGER IF EXISTS trigger_notes_modified_at ON notes;
DROP TRIGGER IF EXISTS trigger_create_note_version ON notes;
DROP TRIGGER IF EXISTS trigger_increment_note_version ON notes;

-- v3.1: drop ghost-quota triggers so re-running this schema doesn't fail
DROP TRIGGER IF EXISTS trigger_ghost_quota_check ON note_ghosts;
DROP TRIGGER IF EXISTS trigger_ghost_used_bytes ON note_ghosts;

DROP FUNCTION IF EXISTS compute_content_size();
DROP FUNCTION IF EXISTS check_note_size_limit();
DROP FUNCTION IF EXISTS check_user_quota();
DROP FUNCTION IF EXISTS update_used_bytes();
DROP FUNCTION IF EXISTS update_modified_at();
DROP FUNCTION IF EXISTS create_note_version();
DROP FUNCTION IF EXISTS increment_note_version();
DROP FUNCTION IF EXISTS check_ghost_quota();
DROP FUNCTION IF EXISTS update_ghost_used_bytes();

-- Remove old tables from Realtime (ignore if missing)
-- ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS notes;

DROP TABLE IF EXISTS note_versions CASCADE;
DROP TABLE IF EXISTS notes CASCADE;

-- ==========================================
-- 1. note_ghosts — latest full snapshot per note
-- Server stores one JSON snapshot per note; client diffs against ghost
-- ==========================================
CREATE TABLE IF NOT EXISTS note_ghosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id TEXT NOT NULL,              -- stable note id (local file name, etc.)
  version INTEGER NOT NULL DEFAULT 1, -- ghost version; increments after each apply
  data JSONB NOT NULL DEFAULT '{}',   -- full note JSON
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, note_id)
);

-- ==========================================
-- 2. note_changes — patch chain
-- JSONDiff output; core of diff-patch (patches only, not full docs)
-- ==========================================
CREATE TABLE IF NOT EXISTS note_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id TEXT NOT NULL,
  ccid TEXT NOT NULL,                 -- client change id (idempotency / ACK)
  sv INTEGER NOT NULL,                -- source version (ghost version patch was built from)
  ev INTEGER NOT NULL,                -- end version after apply
  operation TEXT NOT NULL DEFAULT 'modify', -- 'modify' | 'remove'
  patch JSONB NOT NULL DEFAULT '{}',  -- JSONDiff payload
  client_id TEXT,                     -- optional device id
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, note_id, ccid)
);

-- ==========================================
-- 3. sync_cursors — per-user sync position (change version)
-- Incremental sync pulls changes after CV
-- ==========================================
CREATE TABLE IF NOT EXISTS sync_cursors (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  change_version TEXT,                -- last applied change marker
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 4. user_profiles — quota / plan / ban flag
-- ==========================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  quota_bytes BIGINT NOT NULL DEFAULT 1048576,  -- default 1 MiB
  used_bytes BIGINT NOT NULL DEFAULT 0,
  plan TEXT NOT NULL DEFAULT 'free',
  is_banned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 5. Indexes
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_ghosts_user_note ON note_ghosts(user_id, note_id);
CREATE INDEX IF NOT EXISTS idx_changes_user_note ON note_changes(user_id, note_id);
CREATE INDEX IF NOT EXISTS idx_changes_created ON note_changes(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_changes_sv ON note_changes(user_id, note_id, sv);

-- ==========================================
-- 6. Row Level Security
-- ==========================================
ALTER TABLE note_ghosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_cursors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own ghosts"
  ON note_ghosts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own changes"
  ON note_changes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own cursors"
  ON sync_cursors FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- ==========================================
-- 7. Touch updated_at on ghost updates
-- ==========================================
CREATE OR REPLACE FUNCTION update_ghost_modified_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ghost_modified_at
  BEFORE UPDATE ON note_ghosts
  FOR EACH ROW
  EXECUTE FUNCTION update_ghost_modified_at();

-- ==========================================
-- 8. Optional: prune old diffs (maintenance)
-- Keep last 60 patches per note — run manually or via pg_cron
-- ==========================================
-- DELETE FROM note_changes
-- WHERE id NOT IN (
--   SELECT id FROM (
--     SELECT id, ROW_NUMBER() OVER (
--       PARTITION BY user_id, note_id
--       ORDER BY created_at DESC
--     ) as rn
--     FROM note_changes
--   ) ranked
--   WHERE rn <= 60
-- );

-- ==========================================
-- 9. Auto-create profile for new auth users
-- ==========================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, quota_bytes, used_bytes, plan)
  VALUES (NEW.id, 1048576, 0, 'free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ==========================================
-- 10. Realtime — downlink patches
-- ==========================================
ALTER PUBLICATION supabase_realtime ADD TABLE note_changes;

-- ==========================================
-- Admin snippets (commented)
-- ==========================================

-- All users:
-- SELECT up.id, au.email, up.used_bytes, up.quota_bytes, up.plan
-- FROM user_profiles up JOIN auth.users au ON up.id = au.id;

-- One user’s cursor:
-- SELECT * FROM sync_cursors WHERE user_id = '<user_id>';

-- Patch chain for one note:
-- SELECT ccid, sv, ev, operation, created_at
-- FROM note_changes
-- WHERE user_id = '<user_id>' AND note_id = '<note_id>'
-- ORDER BY created_at;

-- ==========================================
-- 11. Time-bucket cleanup (optional)
--
-- Rules:
-- - Today: keep all
-- - 1–30 days ago: keep last per (user_id, note_id, day)
-- - 30–90 days ago: keep last per (user_id, note_id, ISO week)
-- - Older than 90 days: delete
-- ==========================================

CREATE OR REPLACE FUNCTION cleanup_old_changes()
RETURNS void AS $$
BEGIN
  DELETE FROM note_changes
  WHERE created_at < NOW() - INTERVAL '90 days';

  DELETE FROM note_changes
  WHERE id NOT IN (
    SELECT DISTINCT ON (user_id, note_id, created_at::date) id
    FROM note_changes
    WHERE created_at >= NOW() - INTERVAL '30 days'
      AND created_at < NOW() - INTERVAL '1 day'
    ORDER BY user_id, note_id, created_at::date, created_at DESC
  )
  AND created_at >= NOW() - INTERVAL '30 days'
  AND created_at < NOW() - INTERVAL '1 day';

  DELETE FROM note_changes
  WHERE id NOT IN (
    SELECT DISTINCT ON (user_id, note_id, date_trunc('week', created_at)) id
    FROM note_changes
    WHERE created_at >= NOW() - INTERVAL '90 days'
      AND created_at < NOW() - INTERVAL '30 days'
    ORDER BY user_id, note_id, date_trunc('week', created_at), created_at DESC
  )
  AND created_at >= NOW() - INTERVAL '90 days'
  AND created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- pg_cron example (daily 03:00 UTC):
-- SELECT cron.schedule('cleanup-changes', '0 3 * * *', 'SELECT cleanup_old_changes()');
-- Manual: SELECT cleanup_old_changes();

-- ==========================================
-- 12. note_revisions  -- independent snapshot table
--
-- Why a separate table from note_changes?
--   note_changes stores diff-patches; reconstructing a historical snapshot
--   from them requires forward-replaying the entire chain, which is fragile
--   (string deltas need an exact base) and incompatible with aggressive
--   change-stream cleanup. Standard cloud-notes pattern is to keep an
--   independent revision table that holds full snapshots; reading "what did
--   this note look like at version N" is then a single SELECT.
--
-- This table does NOT count against user_profiles.quota_bytes — version
-- history is a system-managed cost, not user-visible storage.
-- ==========================================
CREATE TABLE IF NOT EXISTS note_revisions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id    TEXT NOT NULL,
  version    INTEGER NOT NULL,           -- = note_ghosts.version after this ACK
  content    JSONB NOT NULL,             -- full note JSON (same shape as ghost.data)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, note_id, version)
);
CREATE INDEX IF NOT EXISTS idx_revisions_note    ON note_revisions(user_id, note_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_revisions_created ON note_revisions(user_id, created_at);

ALTER TABLE note_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own revisions"
  ON note_revisions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 13. cleanup_old_revisions()
--
-- Same time-bucketing rules as cleanup_old_changes(), applied to the
-- snapshot table:
--   - Today:         keep all
--   - 1–30 days ago: keep last per (user_id, note_id, day)
--   - 30–90 days:    keep last per (user_id, note_id, ISO week)
--   - >90 days:      delete
-- ==========================================
CREATE OR REPLACE FUNCTION cleanup_old_revisions()
RETURNS void AS $$
BEGIN
  DELETE FROM note_revisions
  WHERE created_at < NOW() - INTERVAL '90 days';

  DELETE FROM note_revisions
  WHERE id NOT IN (
    SELECT DISTINCT ON (user_id, note_id, created_at::date) id
    FROM note_revisions
    WHERE created_at >= NOW() - INTERVAL '30 days'
      AND created_at < NOW() - INTERVAL '1 day'
    ORDER BY user_id, note_id, created_at::date, created_at DESC
  )
  AND created_at >= NOW() - INTERVAL '30 days'
  AND created_at < NOW() - INTERVAL '1 day';

  DELETE FROM note_revisions
  WHERE id NOT IN (
    SELECT DISTINCT ON (user_id, note_id, date_trunc('week', created_at)) id
    FROM note_revisions
    WHERE created_at >= NOW() - INTERVAL '90 days'
      AND created_at < NOW() - INTERVAL '30 days'
    ORDER BY user_id, note_id, date_trunc('week', created_at), created_at DESC
  )
  AND created_at >= NOW() - INTERVAL '90 days'
  AND created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- pg_cron example (daily 03:15 UTC, 15 minutes after the changes cleanup):
-- SELECT cron.schedule('cleanup-revisions', '15 3 * * *', 'SELECT cleanup_old_revisions()');
-- Manual: SELECT cleanup_old_revisions();

-- ==========================================
-- 14. Quota enforcement on note_ghosts
--
-- v3 dropped the v2 quota infrastructure (it was attached to the now-removed
-- `notes` table). user_profiles.quota_bytes / used_bytes were left dormant.
-- This section reattaches them to the new ghost table.
--
-- Counted bytes:
--   octet_length(data ->> 'content')   -- live note body only.
-- Tags / metadata / version history are NOT counted.
--
-- On overflow:
--   RAISE EXCEPTION with SQLSTATE 53100 (disk_full). The Supabase JS client
--   surfaces this as PostgrestError.code === '53100', which the sync-channel
--   recognises and turns into an in-app "quota exceeded" notice instead of
--   a noisy error loop.
-- ==========================================
CREATE OR REPLACE FUNCTION check_ghost_quota()
RETURNS TRIGGER AS $$
DECLARE
  delta BIGINT;
  used  BIGINT;
  cap   BIGINT;
BEGIN
  delta := COALESCE(octet_length(NEW.data ->> 'content'), 0)
         - COALESCE(octet_length(OLD.data ->> 'content'), 0);

  -- Free space or no change: always allow (so users can keep deleting /
  -- shrinking notes even while they're already over cap).
  IF delta <= 0 THEN
    RETURN NEW;
  END IF;

  SELECT used_bytes, quota_bytes INTO used, cap
  FROM user_profiles
  WHERE id = NEW.user_id;

  IF used IS NULL THEN
    -- Profile row missing for some reason; create a default one and let
    -- the write through.
    INSERT INTO user_profiles (id, quota_bytes, used_bytes, plan)
    VALUES (NEW.user_id, 1048576, 0, 'free')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
  END IF;

  IF (used + delta) > cap THEN
    RAISE EXCEPTION 'quota_exceeded'
      USING ERRCODE = '53100',
            HINT = format('used=%s cap=%s delta=%s', used, cap, delta);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_ghost_used_bytes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_profiles
       SET used_bytes = used_bytes + COALESCE(octet_length(NEW.data ->> 'content'), 0)
     WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_profiles
       SET used_bytes = GREATEST(0, used_bytes
              - COALESCE(octet_length(OLD.data ->> 'content'), 0))
     WHERE id = OLD.user_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE user_profiles
       SET used_bytes = GREATEST(0, used_bytes
              + COALESCE(octet_length(NEW.data ->> 'content'), 0)
              - COALESCE(octet_length(OLD.data ->> 'content'), 0))
     WHERE id = NEW.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_ghost_quota_check ON note_ghosts;
CREATE TRIGGER trigger_ghost_quota_check
  BEFORE INSERT OR UPDATE ON note_ghosts
  FOR EACH ROW
  EXECUTE FUNCTION check_ghost_quota();

DROP TRIGGER IF EXISTS trigger_ghost_used_bytes ON note_ghosts;
CREATE TRIGGER trigger_ghost_used_bytes
  AFTER INSERT OR UPDATE OR DELETE ON note_ghosts
  FOR EACH ROW
  EXECUTE FUNCTION update_ghost_used_bytes();
