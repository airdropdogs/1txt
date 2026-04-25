# 1TXT 产品需求与重构计划 (PRD)

## 0. 当前状态

Phase 0-3 已全部完成。1TXT 已经是一个可以离线使用、本地实时落盘、Supabase OTP 无密码认证的 Markdown 编辑器。
当前进入 **Phase 4: 碎片同步 (Diff-Patch Cloud Sync)**。

### 重构原则

1. **1:1 原味还原**：拉取 Simplenote 官方源码，保证丝滑度。
2. **渐进式脱敏**：切断 Simperium 云同步，变为纯本地编辑器。
3. **插件式云端重构**：以 Supabase 替代 Simperium，复用其碎片同步核心算法。

---

## 1. 实施阶段

### Phase 0: 废墟重建 ✅

- 清空旧目录，`git clone` 官方源码，`npm install & npm run dev` 跑通。

### Phase 1: 切断云脐带 ✅

- 拦截 `boot.ts`，Mock Token，封堵 Simperium 请求，实现单机秒开。

### Phase 2: 落盘行动 ✅

- 便携式 Vault 目录，`fs.writeFileSync` 实时落盘，`.md` 扫描加载。

### Phase 3: Supabase 认证 ✅

- OTP 无密码登录（邮箱→验证码→登入）
- 自定义 SMTP (Resend)
- Session 持久化（登录后永久免登录）
- 多账号数据隔离（每用户独立 Vault）

### Phase 4: Supabase 碎片同步 ⬜ 当前阶段

> 详细技术分析见 → [碎片同步分析.md](./碎片同步分析.md)

#### 4.1 核心需求

**同步机制：**

- 复用 Simperium 的 JSONDiff + Ghost + OT 架构
- 传输层从 Simperium WebSocket 替换为 Supabase REST + Realtime
- 保存即同步（与官方一致，无人为防抖）
- LocalQueue 自然压缩（同一笔记的连续编辑自动合并）

**一致性保证：**

- 新设备登录 → 全量索引（从服务器拉取所有 Ghost 快照）
- 已有设备 → 增量同步（只拉取 CV 之后的变更补丁）
- CV 无效/不一致 → 自动重新全量索引
- 同时编辑冲突 → OT Transform 自动合并 + rebase

**版本历史：**

- 100% 复用 Simperium 的版本管理策略
- 保留最近 60 个精确版本
- 每 10 版 1 个归档快照，最多 100 个归档
- 总覆盖范围：最近 1,060 次变更
- UI：历史版本时间线 + 预览 + 一键还原

**离线支持：**

- 断网时所有变更缓存到 LocalQueue
- 恢复后自动重发未同步的变更 (`resendSentChanges`)
- 对用户完全无感

**资源与费用估算：**

- Supabase Pro ($25/月) 可支持 ~5,000 活跃用户
- 碎片 diff 比整文件同步节省出站流量 253 倍
- 定期压缩旧 diff 防止数据库膨胀

#### 4.2 用户体验

**同步状态图标 (左侧列表)：**

- 🔄 同步中：正在发送/接收 diff
- ✅ 已同步：所有变更已上传
- ⚠️ 离线：断网，变更已缓存

**历史版本 UI：**

- 侧边栏时间线展示修改历史
- 点击版本预览内容
- 一键还原到选定版本

#### 4.3 不做的事情（明确排除）

- ❌ 不做实时协作编辑（1TXT 是单用户多设备场景）
- ❌ 不做客户端管理后台（用 Supabase Dashboard）
- ❌ 不做人为防抖（保持与 Simperium 一致的即时同步）
- ❌ 不做整文件上传（碎片 diff 方案已确定）

---

## 2. 设计与体验基准

- 保持 Simplenote "界面极其干净、纯白、左侧单列表" 的核心体验。
- 同步对用户完全透明，零配置零感知。
- 修改必须谨小慎微，一次完成一个 Commit，改坏了立刻回滚。
