# 1TXT — Release Notes

> 1TXT 沿袭语义化版本（[Semantic Versioning 2.0](https://semver.org/lang/zh-CN/)）：`MAJOR.MINOR.PATCH`。
> 详细的版本号管理与升级流程见 [docs/版本号与升级.md](docs/版本号与升级.md)。

---

## [1.0.0] — 2026-04-26

首个公开发布版本。

### Highlights

- **基于 Simplenote Electron 重构**：保留 Simplenote 简洁的笔记体验与本地缓存机制
- **全新 WYSIWYG 编辑器**：用 [Vditor](https://github.com/Vanessa219/vditor) 替换原 Monaco，实现 Typora 风格的所见即所得 Markdown
- **Supabase 同步层**：抛弃 Simperium 后端，改用 Supabase（PostgreSQL + Realtime）做差量增量同步
  - 自定义 `note_ghosts` / `note_changes` / `sync_cursors` 三表方案
  - 复用 `simperium/jsondiff` 做字符级 diff，单字修改也只传几十字节
  - WebSocket 实时推送多端协同变更
- **OTP 邮箱登录**：去掉密码，6 位验证码登录，由 Supabase Auth 接管
- **侧栏可拖拽调整宽度**，宽度持久化
- **同步状态指示器**：当前编辑笔记右上角小图标，输入时出现，停顿 300ms 后消失
- **离线友好**：网络断开时显示警告徽章，恢复时自动追加变更
- **可见的笔记列表"未同步"提示**，告别"以为没保存"焦虑
- **新用户默认 Markdown 模式开启**

### Desktop / Packaging

- Windows 同时提供 **解压版 ZIP（绿色便携）** 与 **NSIS 安装版**
- 解压版数据写在 EXE 同级 `1txt-data/` 目录，整个文件夹可移动
- 安装版数据走 `%APPDATA%\1TXT\`
- 升级机制：客户端启动后拉 `version.json`，发现新版本弹"去下载/跳过此版本"对话框，跳浏览器到下载页（NSIS 与 ZIP 同样逻辑）；预埋"强制升级"对话框，必要时强制更新桌面版或导向 Web 端

### 致谢

本项目站在两个开源巨人的肩膀上：

- [Simplenote Electron](https://github.com/Automattic/simplenote-electron) by Automattic — GPL-2.0
  Simplenote 的历史 changelog 可见上游仓库的 [RELEASE-NOTES.md](https://github.com/Automattic/simplenote-electron/blob/trunk/RELEASE-NOTES.md)
- [Vditor](https://github.com/Vanessa219/vditor) by Vanessa219 — MIT

---

<!--
未来版本 changelog 模板：

## [x.y.z] — YYYY-MM-DD

### Added
- 新功能描述（可附 PR 链接）

### Changed
- 现有功能改动

### Fixed
- 修复的 bug

### Removed
- 移除的功能

### Security
- 安全相关
-->
