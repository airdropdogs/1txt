# 1TXT 改造指南

> 基于 Simplenote Electron (`Automattic/simplenote-electron`) 的完整改造步骤。
> 从干净的原版克隆开始，按顺序执行以下操作即可复现 1TXT 所有功能。
> 最后更新：2026-04-25

---

## 目录

1. [环境准备](#1-环境准备)
2. [package.json 改造](#2-packagejson-改造)
3. [配置文件改造](#3-配置文件改造)
4. [认证系统：Supabase OTP](#4-认证系统supabase-otp)
5. [WYSIWYG 编辑器：Vditor](#5-wysiwyg-编辑器vditor)
6. [Redux State 扩展](#6-redux-state-扩展)
7. [工具栏模式切换](#7-工具栏模式切换)
8. [桌面进程兼容修复](#8-桌面进程兼容修复)
9. [已知问题与注意事项](#9-已知问题与注意事项)

---

## 1. 环境准备

```bash
# 1. 克隆原版
git clone https://github.com/Automattic/simplenote-electron.git 1txt
cd 1txt

# 2. 创建 config.json（原版需要，且不include在 git 中）
# 内容见下方"配置文件改造"

# 3. 安装依赖
npm install --legacy-peer-deps

# 4. 安装额外依赖
npm install vditor @supabase/supabase-js cross-env concurrently wait-on --legacy-peer-deps
```

**重要**：原版 `make dev` 需要 Unix make 工具，Windows 下不可用。我们需要改 npm scripts（见下方）。

---

## 2. package.json 改造

### 2.1 添加 npm scripts（替代 Makefile）

在 `scripts` 中添加/修改：

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development DEV_SERVER=true concurrently -c gray.dim \"npm run dev-server\" \"wait-on http://localhost:4000 && npm run start\"",
    "dev-server": "cross-env NODE_ENV=development webpack serve --config ./webpack.config.js --static dist --host 0.0.0.0 --port 4000 --hot",
    "start": "cross-env NODE_ENV=development DEV_SERVER=true electron . --inspect --watchDir=./desktop"
  }
}
```

### 2.2 添加依赖

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.104.1",
    "vditor": "^3.11.2"
  },
  "devDependencies": {
    "concurrently": "^9.1.2",
    "cross-env": "^10.1.0",
    "wait-on": "^8.0.2"
  }
}
```

---

## 3. 配置文件改造

### 3.1 `config.json`（项目根目录）

```json
{
  "app_id": "history-analyst-dad",
  "app_key": "be606bcfa3db4377bf488900281aa1cc",
  "development": true,
  "wpcc_client_id": "0",
  "wpcc_redirect_url": "https://simplenote.com",
  "supabase_url": "https://YOUR_PROJECT.supabase.co",
  "supabase_key": "YOUR_ANON_KEY"
}
```

### 3.2 `lib/global.d.ts` — 添加类型声明

在 `config` 类型中添加：

```diff
  const config: {
    app_engine_url: string;
    app_id: string;
    app_key: string;
    development: boolean;
    is_app_engine: string;
    version: string;
    wpcc_client_id: string;
    wpcc_redirect_url: string;
+   supabase_url?: string;
+   supabase_key?: string;
  };
```

---

## 4. 认证系统：Supabase OTP

### 4.1 `lib/auth/index.tsx` — 完全重写

**删除原版所有内容**，替换为极简 OTP 登录组件。

核心逻辑：
- **Screen 1**：输入邮箱 → 点击 "Send Code"
- **Screen 2**：输入 6 位验证码 → 点击 "Log In"
- 没有密码字段、没有 WordPress 登录、没有注册/登录切换

```tsx
import React, { Component } from 'react';
import classNames from 'classnames';
import SimplenoteLogo from '../icons/simplenote';
import Spinner from '../components/spinner';
import { isElectron, isMac } from '../utils/platform';

type OwnProps = {
  accountCreationRequested: boolean;
  authPending: boolean;
  emailSentTo: string;
  hasCompromisedPassword: boolean;
  hasInsecurePassword: boolean;
  hasInvalidCredentials: boolean;
  hasLoginError: boolean;
  hasTooManyRequests: boolean;
  hasUnverifiedAccount: boolean;
  login: (username: string, password: string) => any;
  loginRequested: boolean;
  isCompletingLogin: boolean;
  hasCodeError: boolean;
  requestLogin: (username: string) => any;
  completeLogin: (username: string, code: string) => any;
  requestSignup: (username: string) => any;
  resetErrors: () => any;
  tokenLogin: (username: string, token: string) => any;
};

type Props = OwnProps;

export class Auth extends Component<Props> {
  usernameInput: any;
  codeInput: any;

  state = {
    passwordErrorMessage: '',
    onLine: window.navigator.onLine,
  };

  componentDidMount() {
    window.addEventListener('online', this.setConnectivity, false);
    window.addEventListener('offline', this.setConnectivity, false);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.setConnectivity, false);
    window.removeEventListener('offline', this.setConnectivity, false);
  }

  setConnectivity = () => this.setState({ onLine: window.navigator.onLine });

  onSubmitEmail = (event: React.FormEvent) => {
    event.preventDefault();
    this.props.resetErrors();
    this.setState({ passwordErrorMessage: '' });
    const email = this.usernameInput?.value?.trim();
    if (!email) {
      this.setState({ passwordErrorMessage: 'Please enter your email.' });
      return;
    }
    this.props.requestLogin(email);
  };

  onSubmitCode = (event: React.FormEvent) => {
    event.preventDefault();
    this.setState({ passwordErrorMessage: '' });
    const code = this.codeInput?.value?.trim();
    if (!code || code.length !== 6) {
      this.setState({ passwordErrorMessage: 'Code must be 6 characters.' });
      return;
    }
    this.props.completeLogin(this.props.emailSentTo, code);
  };

  render() {
    if (config.is_app_engine) return null;
    const mainClasses = classNames('login', { 'is-electron': isElectron });
    const { passwordErrorMessage } = this.state;

    // Screen 2: Code entry
    if (this.props.loginRequested || this.props.isCompletingLogin || this.props.hasCodeError) {
      return (
        <div className={mainClasses}>
          {isElectron && isMac && <div className="login__draggable-area" />}
          <div className="account-requested">
            <form className="login__form" onSubmit={this.onSubmitCode}>
              <SimplenoteLogo />
              <h1>Enter Code</h1>
              <p className="account-requested__message">
                We&apos;ve sent a code to <strong>{this.props.emailSentTo}</strong>.
              </p>
              {(passwordErrorMessage || this.props.hasCodeError) && (
                <p className="login__auth-message is-error">
                  {passwordErrorMessage || 'Could not log in. Check the code and try again.'}
                </p>
              )}
              <input type="text" className="account-requested__code" placeholder="6-digit code"
                maxLength={6} autoFocus ref={(ref) => (this.codeInput = ref)} />
              <button className="button button-primary" type="submit">
                {this.props.isCompletingLogin ? <Spinner isWhite={true} size={20} thickness={5} /> : 'Log In'}
              </button>
              <button onClick={() => this.props.resetErrors()} className="button-borderless" type="button">
                Go Back
              </button>
            </form>
          </div>
        </div>
      );
    }

    // Screen 1: Email entry
    return (
      <div className={mainClasses}>
        {isElectron && isMac && <div className="login__draggable-area" />}
        <SimplenoteLogo />
        <form className="login__form" onSubmit={this.onSubmitEmail}>
          <h1>1TXT</h1>
          {!this.state.onLine && <p className="login__auth-message is-error">Offline</p>}
          {(this.props.hasInvalidCredentials || this.props.hasLoginError) && (
            <p className="login__auth-message is-error">Could not send login code.</p>
          )}
          {passwordErrorMessage && <p className="login__auth-message is-error">{passwordErrorMessage}</p>}
          <label className="login__field" htmlFor="login__field-username">Email</label>
          <input id="login__field-username" placeholder="Email" ref={(ref) => (this.usernameInput = ref)}
            spellCheck={false} type="email" required autoFocus />
          <button id="login__login-button"
            className={classNames('button', 'button-primary', { pending: this.props.authPending })}
            disabled={!this.state.onLine} type="submit">
            {this.props.authPending ? <Spinner isWhite={true} size={20} thickness={5} /> : 'Send Code'}
          </button>
          <div className="terms">We&rsquo;ll email you a one-time code to log in.<br/>No password needed.</div>
        </form>
      </div>
    );
  }
}

export default Auth;
```

### 4.2 `lib/boot-without-auth.tsx` — Supabase 后端

关键改动（在原版基础上）：

**导入部分**：
```diff
+import { createClient, SupabaseClient } from '@supabase/supabase-js';
```

**Supabase 初始化**（在 class 之前）：
```typescript
const supabase: SupabaseClient | null =
  config.supabase_url && config.supabase_key
    ? createClient(config.supabase_url, config.supabase_key)
    : null;
```

**State 类型添加**：
```diff
  type State = {
    authStatus:
      // ... 原有状态
+     | 'completing-login'
+     | 'code-error';
    emailSentTo: string;
    showAbout: boolean;
  };
```

**添加 3 个新方法到 AppWithoutAuth 类**：

```typescript
// Step 1: Send OTP
requestLogin = (email: string) => {
  const username = email.trim().toLowerCase();
  if (!username) return;
  this.setState({ authStatus: 'submitting' }, async () => {
    try {
      if (!supabase) throw new Error('No Supabase config');
      const { error } = await supabase.auth.signInWithOtp({ email: username });
      if (error) throw error;
      this.setState({ authStatus: 'login-requested', emailSentTo: username });
    } catch (e: any) {
      console.error('[Auth] OTP request failed:', e);
      this.setState({ authStatus: 'unknown-error' });
    }
  });
};

// Step 2: Verify OTP
completeLogin = (email: string, code: string) => {
  const username = email.trim().toLowerCase();
  const trimmedCode = code.trim();
  if (!username || !trimmedCode) return;
  this.setState({ authStatus: 'completing-login' }, async () => {
    try {
      if (!supabase) throw new Error('No Supabase config');
      const { data, error } = await supabase.auth.verifyOtp({
        email: username, token: trimmedCode, type: 'email',
      });
      if (error) throw error;
      const session = data.session;
      if (!session) throw new Error('No session returned');
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('1txt_refresh_token', session.refresh_token);
        localStorage.setItem('1txt_user_id', session.user.id);
      }
      this.login(session.access_token, username);
    } catch (e: any) {
      console.error('[Auth] OTP verify failed:', e);
      this.setState({ authStatus: 'code-error' });
    }
  });
};

// Signup = Login for OTP
requestSignup = (email: string) => { this.requestLogin(email); };
```

**修改 render 方法中 `<AuthApp>` 的 props**：
```diff
  <AuthApp
    ...原有 props...
+   loginRequested={this.state.authStatus === 'login-requested'}
+   isCompletingLogin={this.state.authStatus === 'completing-login'}
+   hasCodeError={this.state.authStatus === 'code-error'}
+   requestLogin={this.requestLogin}
+   completeLogin={this.completeLogin}
+   requestSignup={this.requestSignup}
+   resetErrors={() => this.setState({ authStatus: 'unsubmitted', emailSentTo: '' })}
  />
```

**修复类型**：
```diff
- onAppCommand = (event: Electron.IpcRendererEvent) => {
+ onAppCommand = (event: any) => {

- onDismissDialog = (event: React.MouseEvent) => {
+ onDismissDialog = () => {
```

---

## 5. WYSIWYG 编辑器：Vditor

### 5.1 新建 `lib/components/wysiwyg-editor/index.tsx`

这是一个全新文件，使用 Vditor 库实现所见即所得编辑。

关键特性：
- 接收 Redux 的 `note` 和 `noteId`
- 初始化 Vditor 实例，隐藏 toolbar/panel
- `input` 回调 → `editNote` 分发 Redux action
- 注入 CSS 覆盖样式，支持 Narrow/Full 宽度模式
- 响应式 padding：
  - Narrow: `calc((100% - 768px) / 2)`
  - Full (`.is-line-length-full`): `25px`

完整代码见仓库中 `lib/components/wysiwyg-editor/index.tsx`。

### 5.2 新建 `lib/components/wysiwyg-editor/style.scss`

```scss
/* All Vditor overrides have been moved to injected CSS in lib/components/wysiwyg-editor/index.tsx */
```

### 5.3 注册样式到 `scss/_components.scss`

```diff
+@import '../lib/components/wysiwyg-editor/style';
```

---

## 6. Redux State 扩展

### 6.1 `lib/state/action-types.ts`

在 ActionType union 中添加：

```typescript
export type SetEditorViewMode = Action<
  'SET_EDITOR_VIEW_MODE',
  { mode: 'source' | 'wysiwyg' | 'preview' }
>;
```

并在 `ActionType` union 里加入 `| SetEditorViewMode`。

### 6.2 `lib/state/ui/reducer.ts`

添加新 reducer：

```typescript
const editorViewMode: A.Reducer<'source' | 'wysiwyg' | 'preview'> = (
  state = 'source',
  action
) => {
  switch (action.type) {
    case 'SET_EDITOR_VIEW_MODE':
      return action.mode;
    default:
      return state;
  }
};
```

修改 `editMode` reducer 以响应 view mode 切换：

```diff
  const editMode: A.Reducer<boolean> = (state = true, action) => {
    switch (action.type) {
+     case 'SET_EDITOR_VIEW_MODE':
+       return action.mode === 'source';
      case 'TOGGLE_EDIT_MODE': {
```

在 `combineReducers` 中注册 `editorViewMode`。

---

## 7. 工具栏模式切换

### 7.1 `lib/note-toolbar/index.tsx`

**添加到 StateProps**：
```diff
  type StateProps = {
    editMode: boolean;
+   editorViewMode: 'source' | 'wysiwyg' | 'preview';
    isOffline: boolean;
    markdownEnabled: boolean;
    note: T.Note | null;
  };
```

**添加到 DispatchProps**：
```diff
  type DispatchProps = {
    ...
+   setViewMode: (mode: string) => any;
  };
```

**在 `renderNormal()` 中添加按钮组**（preview 按钮前面）：
```tsx
{this.props.markdownEnabled && (
  <div className="note-toolbar__mode-switcher">
    <button className={classNames('mode-btn', { active: editorViewMode === 'source' })}
      onClick={() => this.props.setViewMode('source')}>Source</button>
    <button className={classNames('mode-btn', { active: editorViewMode === 'wysiwyg' })}
      onClick={() => this.props.setViewMode('wysiwyg')}>WYSIWYG</button>
    <button className={classNames('mode-btn', { active: editorViewMode === 'preview' })}
      onClick={() => this.props.setViewMode('preview')}>Preview</button>
  </div>
)}
```

**mapDispatchToProps**：
```typescript
setViewMode: (mode: string) => ({
  type: 'SET_EDITOR_VIEW_MODE' as const,
  mode: mode as 'source' | 'wysiwyg' | 'preview'
}),
```

**connect 修复**（TypeScript 类型兼容问题）：
```diff
- export default connect(mapStateToProps, mapDispatchToProps)(NoteToolbar);
+ export default connect(mapStateToProps, mapDispatchToProps)(NoteToolbar as any);
```

### 7.2 `lib/note-toolbar/style.scss`

在末尾添加：

```scss
/* 3-button mode switcher (Source / WYSIWYG / Preview) */
.note-toolbar__mode-switcher {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border-color, #d1d5da);
  border-radius: 4px;
  overflow: hidden;
  margin-right: 4px;

  .mode-btn {
    background: transparent;
    border: none;
    padding: 4px 10px;
    font-size: 13px;
    cursor: pointer;
    color: var(--secondary-color, #586069);
    line-height: 1;
    transition: background 0.15s, color 0.15s;
    &:not(:last-child) { border-right: 1px solid var(--border-color, #d1d5da); }
    &:hover { background: var(--hover-bg, rgba(0,0,0,0.05)); }
    &.active { background: var(--accent-color, #3361cc); color: #fff; }
  }
}
```

---

## 8. 桌面进程兼容修复

### 8.1 `desktop/updater/auto-updater/index.js`

`electron-updater@4.x` 与 `electron@34+` 不兼容，dev 模式下会崩溃。修复：

```javascript
'use strict';

const Updater = require('../lib/Updater');

// Skip auto-updater in dev mode
const isDev = process.env.NODE_ENV === 'development';
let autoUpdater;
if (!isDev) {
  try {
    autoUpdater = require('electron-updater').autoUpdater;
  } catch (e) {
    console.warn('[AutoUpdater] Failed to load:', e.message);
  }
}

class AutoUpdater extends Updater {
  constructor({ changelogUrl, options = {} }) {
    super(changelogUrl, options);
    if (!autoUpdater) return;
    autoUpdater.on('error', this.onError.bind(this));
    autoUpdater.on('update-not-available', this.onNotAvailable.bind(this));
    autoUpdater.on('update-downloaded', this.onDownloaded.bind(this));
    autoUpdater.autoInstallOnAppQuit = false;
  }
  ping() { if (autoUpdater) autoUpdater.checkForUpdates(); }
  pingAndShowProgress() {
    if (!autoUpdater) return;
    const setupProgressUpdates = require('../lib/setup-progress-updates');
    setupProgressUpdates({ updater: autoUpdater, willAutoDownload: true });
    autoUpdater.checkForUpdates();
  }
  onConfirm() {
    if (!autoUpdater) return;
    const AppQuit = require('../../app-quit');
    AppQuit.allowQuit();
    autoUpdater.quitAndInstall();
  }
}

module.exports = AutoUpdater;
```

### 8.2 `desktop/menus/menu-items.js`

同样需要保护 `electron-updater` 的引用：

```diff
-const { autoUpdater } = require('electron-updater');
+let autoUpdater;
+if (process.env.NODE_ENV !== 'development') {
+  try {
+    autoUpdater = require('electron-updater').autoUpdater;
+  } catch (e) {
+    console.warn('[MenuItems] electron-updater not available:', e.message);
+  }
+}

 const checkForUpdates = {
   label: '&Check for Updates…',
-  enabled: autoUpdater.isUpdaterActive(),
-  click: updater.pingAndShowProgress.bind(updater),
+  enabled: autoUpdater ? autoUpdater.isUpdaterActive() : false,
+  click: updater && updater.pingAndShowProgress ? updater.pingAndShowProgress.bind(updater) : () => {},
 };
```

### 8.3 Electron 模块覆盖问题（⚠️ 重要）

**问题**：`node_modules/electron/index.js`（npm helper 包）会覆盖 Electron 内建的 `require('electron')` API，在 Electron 34+ 中导致 `app` 为 `undefined`。

**解决方案**：需要修改 `node_modules/electron/index.js`，在 Electron 进程内检测并返回内建模块。具体修复方法见仓库中的文件。

**注意**：因为这是 `node_modules` 下的文件，每次 `npm install` 会被重置。可以写一个 `postinstall` 脚本来自动应用修复。

---

## 9. 已知问题与注意事项

### 9.1 Electron 模块覆盖（高优先级）
- `node_modules/electron/index.js` 在 Electron v34+ 中覆盖内建 `electron` 模块
- 每次 `npm install` 后需要重新 patch
- 建议：降级到 `electron@28.x` 或使用 `patch-package` 自动修复

### 9.2 Supabase 配置
- `supabase_url` 和 `supabase_key` 存在 `config.json` 中
- `supabase_key` 是 anon/publishable key，可以安全暴露在前端

### 9.3 文件改动清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `config.json` | 修改 | 添加 supabase_url, supabase_key |
| `package.json` | 修改 | scripts + dependencies |
| `lib/global.d.ts` | 修改 | config 类型声明 |
| `lib/auth/index.tsx` | 重写 | OTP-only 登录 |
| `lib/boot-without-auth.tsx` | 修改 | Supabase OTP 后端 |
| `lib/components/wysiwyg-editor/index.tsx` | 新建 | Vditor WYSIWYG |
| `lib/components/wysiwyg-editor/style.scss` | 新建 | 样式占位 |
| `scss/_components.scss` | 修改 | 注册 wysiwyg 样式 |
| `lib/note-toolbar/index.tsx` | 修改 | 模式切换按钮 |
| `lib/note-toolbar/style.scss` | 修改 | 按钮样式 |
| `lib/state/action-types.ts` | 修改 | SET_EDITOR_VIEW_MODE |
| `lib/state/ui/reducer.ts` | 修改 | editorViewMode reducer |
| `desktop/updater/auto-updater/index.js` | 修改 | dev 模式跳过 |
| `desktop/menus/menu-items.js` | 修改 | dev 模式兼容 |

### 9.4 Supabase 后端配置

需要在 Supabase Dashboard 中：
1. 启用 Email OTP 认证方式
2. 配置邮件模板（可选）
3. 如需同步功能，还需要创建 `notes` 表和 RLS 策略
