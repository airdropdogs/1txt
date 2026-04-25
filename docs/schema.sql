-- ============================================
-- 1TXT Supabase Schema v3
-- 碎片同步 (Diff-Patch Sync) 版本
-- 可直接在 Supabase Dashboard → SQL Editor 执行
-- ============================================

-- ==========================================
-- 0. 清理旧 Schema v2 的表和触发器 (如果存在)
--    user_profiles 保留不动，结构兼容
-- ==========================================

-- 删除旧触发器 (必须先删触发器再删函数)
DROP TRIGGER IF EXISTS trigger_compute_content_size ON notes;
DROP TRIGGER IF EXISTS trigger_check_note_size ON notes;
DROP TRIGGER IF EXISTS trigger_check_user_quota ON notes;
DROP TRIGGER IF EXISTS trigger_update_used_bytes ON notes;
DROP TRIGGER IF EXISTS trigger_notes_modified_at ON notes;
DROP TRIGGER IF EXISTS trigger_create_note_version ON notes;
DROP TRIGGER IF EXISTS trigger_increment_note_version ON notes;

-- 删除旧函数
DROP FUNCTION IF EXISTS compute_content_size();
DROP FUNCTION IF EXISTS check_note_size_limit();
DROP FUNCTION IF EXISTS check_user_quota();
DROP FUNCTION IF EXISTS update_used_bytes();
DROP FUNCTION IF EXISTS update_modified_at();
DROP FUNCTION IF EXISTS create_note_version();
DROP FUNCTION IF EXISTS increment_note_version();

-- 从 Realtime 移除旧表 (忽略不存在的错误)
-- ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS notes;

-- 删除旧表 (note_versions 依赖 notes，先删)
DROP TABLE IF EXISTS note_versions CASCADE;
DROP TABLE IF EXISTS notes CASCADE;

-- ==========================================
-- 1. 笔记 Ghost 快照表 (最新完整版本)
-- 每个笔记在服务端保存一份完整的数据快照
-- 客户端基于 ghost 计算 diff，只传送差异补丁
-- ==========================================
CREATE TABLE IF NOT EXISTS note_ghosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id TEXT NOT NULL,              -- 笔记的唯一标识 (对应本地文件名)
  version INTEGER NOT NULL DEFAULT 1, -- Ghost 版本号，每次 apply 补丁后递增
  data JSONB NOT NULL DEFAULT '{}',   -- 完整的笔记 JSON 数据
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, note_id)
);

-- ==========================================
-- 2. 笔记变更补丁链表
-- 存储 JSONDiff 生成的最小差异补丁
-- 这是碎片同步的核心：只传补丁，不传完整文件
-- ==========================================
CREATE TABLE IF NOT EXISTS note_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id TEXT NOT NULL,              -- 笔记 ID
  ccid TEXT NOT NULL,                 -- 客户端变更 ID (Client Change ID, 用于幂等和 ACK)
  sv INTEGER NOT NULL,                -- 源版本 (Source Version: 基于哪个 ghost 版本计算的 diff)
  ev INTEGER NOT NULL,                -- 目标版本 (End Version: apply 补丁后的版本)
  operation TEXT NOT NULL DEFAULT 'modify', -- 操作类型: 'modify' | 'remove'
  patch JSONB NOT NULL DEFAULT '{}',  -- JSONDiff 生成的补丁数据
  client_id TEXT,                     -- 客户端设备 ID (用于区分变更来源)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, note_id, ccid)      -- 同一客户端变更不重复
);

-- ==========================================
-- 3. 同步游标表
-- 每个用户最后同步到的位置 (Change Version)
-- 增量同步时只拉取 CV 之后的变更
-- ==========================================
CREATE TABLE IF NOT EXISTS sync_cursors (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  change_version TEXT,                -- 最后同步的变更版本标识
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 4. 用户配置表（配额、方案、封禁）
-- ==========================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  quota_bytes BIGINT NOT NULL DEFAULT 1048576,  -- 默认 1MB
  used_bytes BIGINT NOT NULL DEFAULT 0,
  plan TEXT NOT NULL DEFAULT 'free',
  is_banned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 5. 索引
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_ghosts_user_note ON note_ghosts(user_id, note_id);
CREATE INDEX IF NOT EXISTS idx_changes_user_note ON note_changes(user_id, note_id);
CREATE INDEX IF NOT EXISTS idx_changes_created ON note_changes(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_changes_sv ON note_changes(user_id, note_id, sv);

-- ==========================================
-- 6. RLS（Row Level Security）
-- ==========================================
ALTER TABLE note_ghosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_cursors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Ghost: 用户只能访问自己的
CREATE POLICY "Users own ghosts"
  ON note_ghosts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Changes: 用户只能访问自己的
CREATE POLICY "Users own changes"
  ON note_changes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Cursors: 用户只能访问自己的
CREATE POLICY "Users own cursors"
  ON sync_cursors FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Profile: 只读
CREATE POLICY "Users read own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- ==========================================
-- 7. 自动更新 updated_at
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
-- 8. 定期清理旧 diff (数据库维护)
-- 每个笔记只保留最近 60 个 diff
-- 可手动执行或设置 pg_cron 定时任务
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
-- 9. 新用户自动创建 profile
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
-- 10. 启用 Realtime (用于下行推送补丁)
-- ==========================================
ALTER PUBLICATION supabase_realtime ADD TABLE note_changes;

-- ==========================================
-- 管理员常用 SQL
-- ==========================================

-- 查看所有用户:
-- SELECT up.id, au.email, up.used_bytes, up.quota_bytes, up.plan
-- FROM user_profiles up JOIN auth.users au ON up.id = au.id;

-- 查看某用户的同步状态:
-- SELECT * FROM sync_cursors WHERE user_id = '<user_id>';

-- 查看某笔记的补丁链:
-- SELECT ccid, sv, ev, operation, created_at
-- FROM note_changes
-- WHERE user_id = '<user_id>' AND note_id = '<note_id>'
-- ORDER BY created_at;

-- ==========================================
-- 11. 智能历史清理函数 (时间分桶策略)
--
-- 保留规则:
-- - 今天: 全部保留
-- - 1-7 天前: 每天保留最后 1 个
-- - 7-30 天前: 每周保留最后 1 个
-- - 30 天以上: 删除
-- ==========================================

CREATE OR REPLACE FUNCTION cleanup_old_changes()
RETURNS void AS $$
BEGIN
  -- Step 1: 删除 30 天以上的补丁
  DELETE FROM note_changes
  WHERE created_at < NOW() - INTERVAL '30 days';

  -- Step 2: 1-7 天前，每个 (user_id, note_id, 日期) 只保留最后一个
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

  -- Step 3: 7-30 天前，每个 (user_id, note_id, ISO 周) 只保留最后一个
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

-- 可用 pg_cron 每天凌晨执行:
-- SELECT cron.schedule('cleanup-changes', '0 3 * * *', 'SELECT cleanup_old_changes()');
-- 或手动执行: SELECT cleanup_old_changes();
