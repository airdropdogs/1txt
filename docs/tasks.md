# 1TXT 进度排期与任务看板

## 📌 状态总览

| 阶段                  | 状态        | 说明                     |
| --------------------- | ----------- | ------------------------ |
| Phase 0 废墟重建      | ✅          | clone 原版、跑通         |
| Phase 1 切断云脐带    | ✅          | Mock Token、断网秒开     |
| Phase 2 落盘行动      | ✅          | 便携 Vault、fs 读写      |
| Phase 3 Supabase 认证 | ✅          | OTP 无密码登录           |
| **Phase 4 碎片同步**  | **✅ 完成** | 核心同步 + 版本历史 + UI |

> 技术分析: [碎片同步分析.md](./碎片同步分析.md)
> 产品需求: [prd.md](./prd.md)
> 技术方案: [tech-design.md](./tech-design.md)
> 数据库: [schema.sql](./schema.sql)

---

## Phase 4: 碎片同步 — 完成清单

### 4.1 基础设施 ✅

- [x] Supabase Schema: `note_ghosts`, `note_changes`, `sync_cursors` + RLS + Realtime
- [x] `lib/sync/index.ts` — 复用 Simperium jsondiff/change/operation

### 4.2 Ghost Store ✅

- [x] `lib/sync/ghost-store.ts` — localStorage L1 + Supabase L2
- [x] `.maybeSingle()` 修复 406

### 4.3 同步引擎 ✅

- [x] `lib/sync/sync-channel.ts` — 全量索引 / 增量同步 / Realtime / OT
- [x] `lib/sync/local-queue.ts` — 自然压缩 + ACK
- [x] `lib/sync/middleware.ts` — 2 秒防抖 + Redux 桥接

### 4.4 版本历史 ✅

- [x] `getRevisions()` — 从 note_changes 补丁链重建历史版本 (最多30个)
- [x] 接入现有 OPEN_NOTE / REVISIONS_TOGGLE 加载逻辑

### 4.5 UI + 清理 ✅

- [x] 同步状态图标: Synced / Offline / Connecting
- [x] 笔记同步标记: 编辑时显示 🔄，ACK 后消失
- [x] `CHANGE_CONNECTION_STATUS` 修复 (action type 匹配)
- [x] `noteHasPendingChanges` selector 接入 Supabase 同步状态
- [x] 初始 connectionStatus 改为 `'green'` (不再默认 red)
- [x] 移除废弃方法 + 无用 import + 旧 supabase-worker

---

### ⬜ 最终测试 (可选)

#### 测试矩阵

- [ ] 单设备: 编辑 → 同步 → 重启 → 数据恢复
- [ ] 新设备: 登录 → 全量索引 → 数据完整
- [ ] 多设备: A 编辑 → B 同步 → B 编辑 → A 同步
- [ ] 离线: 断网编辑 → 恢复 → 自动同步
- [ ] 冲突: A+B 同时编辑 → OT 合并
- [ ] 版本历史: 点击 History → 查看历史版本

---

## 📁 文件结构

```
lib/sync/
├── index.ts               ← 入口: 复用 Simperium 算法 + 类型定义
├── ghost-store.ts         ← SupabaseGhostStore (localStorage + Supabase)
├── sync-channel.ts        ← SupabaseSyncChannel (REST + Realtime + Revisions)
├── local-queue.ts         ← LocalQueue (自然压缩 + ACK)
└── middleware.ts          ← Redux 中间件 (2秒防抖 + 事件桥接 + 版本历史)
```
