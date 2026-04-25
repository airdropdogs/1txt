# 1TXT 技术方案设计 (Tech Design & Architecture)

## 核心设计理念

- **UI 主线程隔离**：同步操作绝不阻塞编辑体验
- **碎片 diff 传输**：只传最小差异补丁，不传完整文件
- **Ghost 一致性模型**：复用 Simperium 的影子副本同步架构

---

## 1. Auth 绕过与会话注入 (Phase 1) ✅ 已完成

- `boot.ts` 不引入 AuthComponent，写入 Mock Token
- 所有验证 UI 检测到 Token 后绿灯放行

## 2. Redux 剥离与 IO 劫持 (Phase 2) ✅ 已完成

- 剔除 Simperium 网络中间件
- `NOTE_UPDATE` → `fs.writeFile` 实时落盘
- 启动时 `fs.readdir` 扫描加载 .md

## 3. Supabase 认证 (Phase 3) ✅ 已完成

- OTP 无密码登录 (`signInWithOtp` + `verifyOtp`)
- 自定义 SMTP (Resend)
- Session 持久化 (localStorage)

---

## 4. 碎片同步架构 (Phase 4) — 当前阶段

### 4.1 整体架构

```
┌──────────────────────────────────────────────────────┐
│                      客户端                           │
│                                                      │
│  [编辑器] → NOTE_UPDATE → [VaultMiddleware]          │
│                              │                       │
│                    ┌─────────┴─────────┐             │
│                    │                   │             │
│              [fs.writeFile]    [SyncChannel]         │
│              (本地落盘)        │                     │
│                         ┌──────┴──────┐              │
│                   [LocalQueue]   [GhostStore]        │
│                         │             │              │
│                  diff(ghost, new)     │              │
│                         │             │              │
│                    ┌────┴────┐        │              │
│                    │  patch  │   [localStorage]      │
│                    └────┬────┘   (Ghost 缓存)        │
│                         │                            │
└─────────────────────────┼────────────────────────────┘
                          │
                    ┌─────┴─────┐
                    │  Supabase │
                    │  ┌───────┐│
                    │  │ REST  ││ ← 上行: insert patch
                    │  ├───────┤│
                    │  │Realtime││ ← 下行: 订阅新 patch
                    │  ├───────┤│
                    │  │  DB   ││ ← note_ghosts + note_changes
                    │  └───────┘│
                    └───────────┘
```

### 4.2 核心模块 (lib/sync/)

```
lib/sync/
├── jsondiff.ts            ← Simperium jsondiff (100% 复用)
│                            支持: 字符串 diff (d), 对象 diff (O),
│                            列表 diff (L), 添加 (+), 删除 (-), 替换 (r)
│
├── diff-match-patch.ts    ← Google diff-match-patch (100% 复用)
│                            字符串级别最小差异算法
│
├── change.ts              ← Simperium change utils (100% 复用)
│                            buildChange(), diff(), apply(), transform()
│                            仅改输出字段名映射 (5行)
│
├── operation.ts           ← Simperium operation (100% 复用)
│
├── ghost-store.ts         ← 新写: SupabaseGhostStore
│                            接口: get/put/remove/getChangeVersion/setChangeVersion
│                            实现: localStorage (一级缓存) + Supabase (持久化)
│
├── sync-channel.ts        ← 新写: SupabaseSyncChannel
│                            替代 Simperium channel.js 的传输层
│                            上行: supabase.from('note_changes').insert(patch)
│                            下行: supabase.channel('sync').on('INSERT', ...)
│
├── local-queue.ts         ← Simperium LocalQueue (100% 复用)
│                            自然压缩: 等 ACK 期间的编辑自动合并
│                            仅改 emit('send') → supabase.insert() (3行)
│
└── index.ts               ← 入口
                             startSync(userId) / stopSync() / getSyncStatus()
```

### 4.3 同步流程

#### 上行 (本地 → 服务器)

```
1. 用户编辑 → NOTE_UPDATE 触发
2. SyncChannel.update(noteId, newData) 被调用
3. GhostStore.get(noteId) 获取 ghost (上次同步时的快照)
4. jsondiff.diff(ghost.data, newData) = patch (最小差异)
5. 如果 patch 为空 (isEmptyChange) → 跳过
6. patch 入 LocalQueue
7. LocalQueue 检查:
   - 如果有正在等待 ACK 的同笔记变更 → 排队等待
   - 否则 → 基于当前 ghost 重新计算最终 diff → 发送
8. supabase.from('note_changes').insert({ patch, sv, ev, ccid })
9. 收到 ACK → GhostStore.put(noteId, newVersion, newData)
10. 处理队列中的下一个变更
```

#### 下行 (服务器 → 本地)

```
1. Supabase Realtime 订阅 note_changes 表的 INSERT 事件
2. 收到远端补丁 (来自其他设备)
3. GhostStore.get(noteId) 获取本地 ghost
4. 版本检查:
   - ghost.version === patch.sv → 正常 apply
   - ghost.version !== patch.sv → 请求正确版本的 ghost
5. 检查本地是否有未同步的修改:
   - 没有 → 直接 apply patch → 更新 ghost → 更新 UI
   - 有 → OT Transform:
     a. localDiff = diff(ghost.data, localData)
     b. transformed = transform(localDiff, remotePatch, ghost.data)
     c. 先 apply remotePatch → 更新 ghost
     d. 如果 transformed 非空 → 重新排队发送
6. emit('update', noteId, newData) → UI 更新
```

#### 首次同步 (新设备)

```
1. 检查本地是否有 Change Version (CV)
2. 没有 CV → 全量索引:
   a. 拉取 note_ghosts 表所有该用户的 ghost
   b. 逐个写入本地 GhostStore + Vault 文件
   c. 索引完成 → 保存 CV → 开始增量同步
3. 有 CV → 增量同步:
   a. 拉取 note_changes 中 created_at > CV 的补丁
   b. 逐个 apply → 更新 ghost
   c. 如果 CV 无效 (服务器返回错误) → 重新全量索引
```

### 4.4 数据库设计

详见 → [schema.sql](./schema.sql)

核心 3 张表:

- `note_ghosts`: 每个笔记的完整 JSON 快照 (最新版本)
- `note_changes`: 碎片补丁链 (JSONDiff 输出)
- `sync_cursors`: 每个用户的同步游标

### 4.5 冲突解决

采用 Simperium 的 OT (Operational Transform) 策略，100% 复用其实现:

```
场景: 设备 A 和设备 B 同时编辑同一篇笔记

Ghost v3: "Hello World"

设备 A 修改为: "Hello Beautiful World" → patchA
设备 B 修改为: "Hello World!" → patchB

patchB 先到达服务器 → Ghost 更新为 v4: "Hello World!"

设备 A 收到 patchB:
1. apply(ghost_v3, patchB) = "Hello World!"  → 更新 ghost 到 v4
2. transform(patchA, patchB, ghost_v3) = transformedPatchA
3. apply("Hello World!", transformedPatchA) = "Hello Beautiful World!"
4. 发送 transformedPatchA → Ghost 更新为 v5

最终结果: "Hello Beautiful World!" (两个修改都保留)
```

### 4.6 版本历史

复用 Simperium 的版本管理策略:

- 最近 60 个精确版本 (每次变更都记录)
- 每 10 个版本 1 个归档快照，最多 100 个归档
- 总覆盖: 最近 1,060 次变更
- 数据库定期清理超出范围的旧 diff
