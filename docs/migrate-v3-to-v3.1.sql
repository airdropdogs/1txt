-- =============================================================================
-- 1TXT Supabase migration: v3  →  v3.1
--
-- What v3.1 adds:
--   1. note_revisions table          (independent snapshot history)
--   2. cleanup_old_revisions()       (today / daily / weekly / >30d delete)
--   3. Quota enforcement on the new note_ghosts table
--      (the equivalent v2 triggers were dropped during the v3 migration and
--       never reattached — user_profiles.used_bytes was sitting at 0 forever)
--
-- This script is fully idempotent — safe to run on a project that already
-- has v3.1 installed; no data is destroyed.
--
-- HOW TO RUN
--   Supabase Dashboard → SQL Editor → New query → paste this file → Run.
--   No downtime; total runtime is sub-second on a small project, ~seconds
--   for backfill on tens of thousands of notes.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. note_revisions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS note_revisions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id    TEXT NOT NULL,
  version    INTEGER NOT NULL,
  content    JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, note_id, version)
);

CREATE INDEX IF NOT EXISTS idx_revisions_note    ON note_revisions(user_id, note_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_revisions_created ON note_revisions(user_id, created_at);

ALTER TABLE note_revisions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'note_revisions'
      AND policyname = 'Users own revisions'
  ) THEN
    CREATE POLICY "Users own revisions"
      ON note_revisions FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 2. cleanup_old_revisions()
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION cleanup_old_revisions()
RETURNS void AS $$
BEGIN
  DELETE FROM note_revisions
  WHERE created_at < NOW() - INTERVAL '30 days';

  DELETE FROM note_revisions
  WHERE id NOT IN (
    SELECT DISTINCT ON (user_id, note_id, created_at::date) id
    FROM note_revisions
    WHERE created_at >= NOW() - INTERVAL '7 days'
      AND created_at < NOW() - INTERVAL '1 day'
    ORDER BY user_id, note_id, created_at::date, created_at DESC
  )
  AND created_at >= NOW() - INTERVAL '7 days'
  AND created_at < NOW() - INTERVAL '1 day';

  DELETE FROM note_revisions
  WHERE id NOT IN (
    SELECT DISTINCT ON (user_id, note_id, date_trunc('week', created_at)) id
    FROM note_revisions
    WHERE created_at >= NOW() - INTERVAL '30 days'
      AND created_at < NOW() - INTERVAL '7 days'
    ORDER BY user_id, note_id, date_trunc('week', created_at), created_at DESC
  )
  AND created_at >= NOW() - INTERVAL '30 days'
  AND created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 3. Quota enforcement on note_ghosts
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_ghost_quota()
RETURNS TRIGGER AS $$
DECLARE
  delta BIGINT;
  used  BIGINT;
  cap   BIGINT;
BEGIN
  delta := COALESCE(octet_length(NEW.data ->> 'content'), 0)
         - COALESCE(octet_length(OLD.data ->> 'content'), 0);

  IF delta <= 0 THEN
    RETURN NEW;
  END IF;

  SELECT used_bytes, quota_bytes INTO used, cap
  FROM user_profiles
  WHERE id = NEW.user_id;

  IF used IS NULL THEN
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

-- -----------------------------------------------------------------------------
-- 4. Backfill user_profiles.used_bytes for existing users
--
-- After v3 migration the field has been stuck at 0. Recompute from the
-- actual ghost content currently held by each user.
-- -----------------------------------------------------------------------------
UPDATE user_profiles up
SET used_bytes = COALESCE((
  SELECT SUM(octet_length(g.data ->> 'content'))
  FROM note_ghosts g
  WHERE g.user_id = up.id
), 0);

COMMIT;

-- -----------------------------------------------------------------------------
-- Optional: schedule daily cleanup of revisions (mirrors the changes cleanup).
-- pg_cron must be enabled in your Supabase project.
-- -----------------------------------------------------------------------------
-- SELECT cron.schedule('cleanup-revisions', '15 3 * * *', 'SELECT cleanup_old_revisions()');
-- SELECT cron.schedule('cleanup-changes',   '0  3 * * *', 'SELECT cleanup_old_changes()');

-- Sanity check (run after migration):
-- SELECT email, used_bytes, quota_bytes
--   FROM user_profiles up JOIN auth.users au ON up.id = au.id
--  ORDER BY used_bytes DESC LIMIT 20;
