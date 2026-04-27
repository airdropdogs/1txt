import React, { Component } from 'react';
import { render } from 'react-dom';
import { Auth as AuthApp } from './auth';
import { getSupabaseClient } from './sync/supabase-client';
import { recordEvent } from './state/analytics/middleware';
import Modal from 'react-modal';
import classNames from 'classnames';
import AboutDialog from './dialogs/about';
import ErrorBoundary from './error-boundary';
import Spinner from './components/spinner';
import { isElectron, isMac } from './utils/platform';

import '../scss/style.scss';

type Props = {
  onAuth: (token: string, username: string) => any;
};

type State = {
  authStatus:
    | 'account-creation-requested'
    | 'compromised-password'
    | 'insecure-password'
    | 'invalid-credentials'
    | 'login-requested'
    | 'submitting'
    | 'too-many-requests'
    | 'unknown-error'
    | 'unsubmitted'
    | 'verification-required'
    | 'completing-login'
    | 'code-error'
    | 'loading-workspace';
  emailSentTo: string;
  showAbout: boolean;
};

// Reuse the singleton client so we don't trigger
// "Multiple GoTrueClient instances detected" with the sync layer.
const supabase = getSupabaseClient();

class AppWithoutAuth extends Component<Props, State> {
  state: State = {
    authStatus: 'unsubmitted',
    emailSentTo: '',
    showAbout: false,
  };

  systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  componentDidMount() {
    window.electron?.receive('appCommand', this.onAppCommand);
    document.body.dataset.theme = this.systemTheme;
  }

  login(token: string, username: string) {
    window.electron?.removeListener('appCommand');
    this.props.onAuth(token, username);
  }

  /** Defer handoff until the loading screen has painted (two rAFs). */
  scheduleEnterApp = (token: string, username: string) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.login(token, username);
      });
    });
  };

  onAppCommand = (event: any) => {
    if ('showDialog' === event.action && 'ABOUT' === event.dialog) {
      this.setState({ showAbout: true });
    }
  };

  onDismissDialog = () => {
    this.setState({ showAbout: false });
  };

  authenticate = (usernameArg: string, password: string) => {
    // Password login — not used in 1TXT OTP flow, but kept for interface compatibility
    const username = usernameArg.trim().toLowerCase();
    if (!(username && password)) return;

    this.setState({ authStatus: 'submitting' }, async () => {
      try {
        if (!supabase) throw new Error('No Supabase config');
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username,
          password: password,
        });
        if (error) throw error;
        const session = data.session;
        if (!session) throw new Error('No session');
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('1txt_pending_initial_sync', '1');
        }
        this.setState({ authStatus: 'loading-workspace' }, () =>
          this.scheduleEnterApp(session.access_token, username)
        );
      } catch {
        this.setState({ authStatus: 'invalid-credentials' });
      }
    });
  };

  /**
   * Step 1: Send OTP code to the user's email via Supabase
   */
  requestLogin = (email: string) => {
    const username = email.trim().toLowerCase();
    if (!username) return;

    this.setState({ authStatus: 'submitting' }, async () => {
      try {
        if (!supabase) throw new Error('No Supabase config');
        const { error } = await supabase.auth.signInWithOtp({
          email: username,
        });
        if (error) throw error;
        recordEvent('user_requested_login_link');
        this.setState({
          authStatus: 'login-requested',
          emailSentTo: username,
        });
      } catch (e: any) {
        console.error('[Auth] OTP request failed:', e);
        this.setState({ authStatus: 'unknown-error' });
      }
    });
  };

  /**
   * Step 2: Verify the OTP code and get a session
   */
  completeLogin = (email: string, code: string) => {
    const username = email.trim().toLowerCase();
    if (!username) return;
    const trimmedCode = code.trim();
    if (!trimmedCode) return;

    this.setState({ authStatus: 'completing-login' }, async () => {
      try {
        if (!supabase) throw new Error('No Supabase config');
        const { data, error } = await supabase.auth.verifyOtp({
          email: username,
          token: trimmedCode,
          type: 'email',
        });
        if (error) throw error;
        const session = data.session;
        if (!session) throw new Error('No session returned');

        // Store refresh token for sync middleware to use
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('1txt_refresh_token', session.refresh_token);
          localStorage.setItem('1txt_user_id', session.user.id);
        }
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('1txt_pending_initial_sync', '1');
        }

        this.setState({ authStatus: 'loading-workspace' }, () =>
          this.scheduleEnterApp(session.access_token, username)
        );
      } catch (e: any) {
        console.error('[Auth] OTP verify failed:', e);
        this.setState({ authStatus: 'code-error' });
      }
    });
  };

  /**
   * Signup is the same as login for OTP — Supabase auto-creates users
   */
  requestSignup = (email: string) => {
    this.requestLogin(email);
  };

  tokenLogin = (username: string, token: string) => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('1txt_pending_initial_sync', '1');
    }
    this.setState({ authStatus: 'loading-workspace' }, () =>
      this.scheduleEnterApp(token, username)
    );
  };

  render() {
    if (this.state.authStatus === 'loading-workspace') {
      return (
        <div className="app">
          <div
            className={classNames('login', 'loading-workspace', {
              'is-electron': isElectron,
            })}
          >
            {isElectron && isMac && <div className="login__draggable-area" />}
            <Spinner size={48} thickness={4} />
            <p className="loading-workspace__message">Loading your notes…</p>
          </div>
        </div>
      );
    }

    return (
      <div className="app">
        <ErrorBoundary>
          <AuthApp
            accountCreationRequested={
              this.state.authStatus === 'account-creation-requested'
            }
            authPending={this.state.authStatus === 'submitting'}
            emailSentTo={this.state.emailSentTo}
            hasInsecurePassword={this.state.authStatus === 'insecure-password'}
            hasCompromisedPassword={
              this.state.authStatus === 'compromised-password'
            }
            hasInvalidCredentials={
              this.state.authStatus === 'invalid-credentials'
            }
            hasUnverifiedAccount={
              this.state.authStatus === 'verification-required'
            }
            hasTooManyRequests={this.state.authStatus === 'too-many-requests'}
            hasLoginError={this.state.authStatus === 'unknown-error'}
            login={this.authenticate}
            loginRequested={this.state.authStatus === 'login-requested'}
            isCompletingLogin={this.state.authStatus === 'completing-login'}
            hasCodeError={this.state.authStatus === 'code-error'}
            tokenLogin={this.tokenLogin}
            resetErrors={() =>
              this.setState({ authStatus: 'unsubmitted', emailSentTo: '' })
            }
            requestLogin={this.requestLogin}
            completeLogin={this.completeLogin}
            requestSignup={this.requestSignup}
          />
          {this.state.showAbout && (
            <Modal
              key="aboutDialogModal"
              className="dialog-renderer__content"
              contentLabel=""
              isOpen
              onRequestClose={this.onDismissDialog}
              overlayClassName="dialog-renderer__overlay"
              portalClassName={classNames('dialog-renderer__portal')}
            >
              <AboutDialog key="about" closeDialog={this.onDismissDialog} />
            </Modal>
          )}
        </ErrorBoundary>
      </div>
    );
  }
}

export const boot = (onAuth: (token: string, username: string) => any) => {
  Modal.setAppElement('#root');
  render(<AppWithoutAuth onAuth={onAuth} />, document.getElementById('root'));
};
