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

/**
 * 1TXT Auth — Minimal OTP-only login
 *
 * Flow:
 * 1. Enter email → click "Send Code"
 * 2. Receive 6-digit OTP in email
 * 3. Enter code → click "Log In"
 */
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
    // Don't render this component when running on the web
    if (config.is_app_engine) {
      return null;
    }

    const mainClasses = classNames('login', {
      'is-electron': isElectron,
    });

    const { passwordErrorMessage } = this.state;

    // --- Screen 2: Code entry ---
    if (
      this.props.loginRequested ||
      this.props.isCompletingLogin ||
      this.props.hasCodeError
    ) {
      return (
        <div className={mainClasses}>
          {isElectron && isMac && <div className="login__draggable-area" />}
          <div className="account-requested">
            <form className="login__form" onSubmit={this.onSubmitCode}>
              <SimplenoteLogo />
              <h1>Enter Code</h1>
              <p className="account-requested__message">
                We&apos;ve sent a code to{' '}
                <strong>{this.props.emailSentTo}</strong>. The code will be
                valid for a few minutes.
              </p>
              {(passwordErrorMessage || this.props.hasCodeError) && (
                <p className="login__auth-message is-error">
                  {passwordErrorMessage
                    ? passwordErrorMessage
                    : 'Could not log in. Check the code and try again.'}
                </p>
              )}
              <input
                type="text"
                className="account-requested__code"
                placeholder="6-digit code"
                maxLength={6}
                autoFocus
                ref={(ref) => (this.codeInput = ref)}
              />
              <button className="button button-primary" type="submit">
                {this.props.isCompletingLogin ? (
                  <Spinner isWhite={true} size={20} thickness={5} />
                ) : (
                  'Log In'
                )}
              </button>
              <button
                onClick={() => this.props.resetErrors()}
                className="button-borderless"
                type="button"
              >
                Go Back
              </button>
            </form>
          </div>
        </div>
      );
    }

    // --- Screen 1: Email entry ---
    return (
      <div className={mainClasses}>
        {isElectron && isMac && <div className="login__draggable-area" />}
        <SimplenoteLogo />
        <form className="login__form" onSubmit={this.onSubmitEmail}>
          <h1>1TXT</h1>
          {!this.state.onLine && (
            <p className="login__auth-message is-error">Offline</p>
          )}
          {(this.props.hasInvalidCredentials || this.props.hasLoginError) && (
            <p className="login__auth-message is-error">
              Could not send login code. Please try again.
            </p>
          )}
          {passwordErrorMessage && (
            <p className="login__auth-message is-error">
              {passwordErrorMessage}
            </p>
          )}
          <label className="login__field" htmlFor="login__field-username">
            Email
          </label>
          <input
            id="login__field-username"
            placeholder="Email"
            ref={(ref) => (this.usernameInput = ref)}
            spellCheck={false}
            type="email"
            required
            autoFocus
          />
          <button
            id="login__login-button"
            className={classNames('button', 'button-primary', {
              pending: this.props.authPending,
            })}
            disabled={!this.state.onLine}
            type="submit"
          >
            {this.props.authPending ? (
              <Spinner isWhite={true} size={20} thickness={5} />
            ) : (
              'Send Code'
            )}
          </button>
          <div className="terms">
            We&rsquo;ll email you a one-time code to log in.
            <br />
            No password needed.
          </div>
        </form>
      </div>
    );
  }
}

export default Auth;
