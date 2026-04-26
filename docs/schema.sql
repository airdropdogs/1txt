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

DROP FUNCTION IF EXISTS compute_content_size();
DROP FUNCTION IF EXISTS check_note_size_limit();
DROP FUNCTION IF EXISTS check_user_quota();
DROP FUNCTION IF EXISTS update_used_bytes();
DROP FUNCTION IF EXISTS update_modified_at();
DROP FUNCTION IF EXISTS create_note_version();
DROP FUNCTION IF EXISTS increment_note_version();

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
-- - 1–7 days ago: keep last per (user_id, note_id, day)
-- - 7–30 days ago: keep last per (user_id, note_id, ISO week)
-- - Older than 30 days: delete
-- ==========================================

CREATE OR REPLACE FUNCTION cleanup_old_changes()
RETURNS void AS $$
BEGIN
  DELETE FROM note_changes
  WHERE created_at < NOW() - INTERVAL '30 days';

  DELETE FROM note_changes
  WHERE id NOT IN (
    SELECT DISTINCT ON (user_id, note_id, created_at::date) id
    FROM note_changes
    WHERE created_at >= NOW() - INTERVAL '7 days'
      AND created_at < NOW() - INTERVAL '1 day'
    ORDER BY user_id, note_id, created_at::date, created_at DESC
  )
  AND created_at >= NOW() - INTERVAL '7 days'
  AND created_at < NOW() - INTERVAL '1 day';

  DELETE FROM note_changes
  WHERE id NOT IN (
    SELECT DISTINCT ON (user_id, note_id, date_trunc('week', created_at)) id
    FROM note_changes
    WHERE created_at >= NOW() - INTERVAL '30 days'
      AND created_at < NOW() - INTERVAL '7 days'
    ORDER BY user_id, note_id, date_trunc('week', created_at), created_at DESC
  )
  AND created_at >= NOW() - INTERVAL '30 days'
  AND created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- pg_cron example (daily 03:00 UTC):
-- SELECT cron.schedule('cleanup-changes', '0 3 * * *', 'SELECT cleanup_old_changes()');
-- Manual: SELECT cleanup_old_changes();
