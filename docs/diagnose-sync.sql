-- ============================================================
-- 1TXT 同步诊断 SQL（合并成一条 SELECT，可直接 Run）
-- 在 Supabase Dashboard > SQL Editor 执行
--
-- 用法：默认使用 auth.uid() 取当前登录用户。如果你在 Dashboard 里
-- 没有有效的 JWT 会话，把下面 me CTE 里的 auth.uid() 改成你的
-- user_id 字面量，例如：
--   SELECT 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid AS user_id
-- 你的 user_id 可以在浏览器 DevTools 控制台里找到，1TXT 启动后
-- 会打印：[Sync] Supabase sync initialized for user: <uuid>
-- ============================================================

WITH
  me AS (
    SELECT auth.uid() AS user_id
  ),
  ghosts AS (
    SELECT
      COUNT(*)                               AS total_ghosts,
      COALESCE(SUM(length(data::text)), 0)   AS total_bytes,
      MIN(updated_at)                        AS oldest,
      MAX(updated_at)                        AS newest
    FROM note_ghosts WHERE user_id = (SELECT user_id FROM me)
  ),
  changes AS (
    SELECT
      COUNT(*)                               AS total_changes,
      COUNT(DISTINCT note_id)                AS unique_notes,
      MIN(created_at)                        AS oldest_change,
      MAX(created_at)                        AS newest_change
    FROM note_changes WHERE user_id = (SELECT user_id FROM me)
  ),
  cursor AS (
    SELECT change_version, updated_at
    FROM sync_cursors WHERE user_id = (SELECT user_id FROM me)
  ),
  changes_after_cv AS (
    SELECT COUNT(*) AS n
    FROM note_changes
    WHERE user_id = (SELECT user_id FROM me)
      AND created_at > COALESCE(
        (SELECT change_version::timestamptz FROM cursor),
        '1970-01-01'::timestamptz
      )
  )
SELECT
  (SELECT total_ghosts  FROM ghosts)             AS ghost_rows,
  (SELECT total_bytes   FROM ghosts)             AS ghost_total_bytes,
  (SELECT oldest        FROM ghosts)             AS ghost_oldest,
  (SELECT newest        FROM ghosts)             AS ghost_newest,
  (SELECT total_changes FROM changes)            AS change_rows,
  (SELECT unique_notes  FROM changes)            AS change_unique_notes,
  (SELECT oldest_change FROM changes)            AS change_oldest,
  (SELECT newest_change FROM changes)            AS change_newest,
  (SELECT change_version FROM cursor)            AS cv_value,
  (SELECT updated_at    FROM cursor)             AS cv_updated_at,
  (SELECT n FROM changes_after_cv)               AS changes_after_cv;

-- ── 想看具体每条 ghost，单独跑下面这个（也是单条 SQL）──
-- SELECT
--   note_id,
--   version,
--   data->>'content' IS NOT NULL                 AS has_content,
--   COALESCE((data->>'deleted')::boolean, false) AS is_deleted,
--   length(data->>'content')                     AS content_len,
--   substring(data->>'content', 1, 60)           AS preview,
--   updated_at
-- FROM note_ghosts
-- WHERE user_id = auth.uid()
-- ORDER BY updated_at DESC;
