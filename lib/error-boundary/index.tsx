import React, { Component, FunctionComponent } from 'react';
import WarningIcon from '../icons/warning';
import { isElectron } from '../utils/platform';

const ErrorMessage: FunctionComponent = () => (
  <div className="error-message">
    <div className="error-message__content">
      <div className="error-message__icon">
        <WarningIcon />
      </div>
      <h1 className="error-message__heading">Oops!</h1>
      <p>Something went wrong. Please refresh the application and try again.</p>
      <div className="error-message__action">
        <button
          className="button button-primary"
          onClick={() => {
            if (isElectron) {
              window.electron?.send('reload');
            } else {
              window.history.go();
            }
          }}
        >
          Refresh application
        </button>
      </div>
    </div>
  </div>
);

class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorMessage />;
    }

    return this.props.children;
  }
}

type ErrorBoundaryWithSentryOwnProps = {
  children: React.ReactNode;
  // kept for backward compatibility with the boot-with-auth call site;
  // analytics/Sentry are no longer wired up in 1TXT, so this flag is unused.
  isDevConfig?: boolean;
};

/**
 * Historically this wrapper conditionally enabled `@sentry/react`'s
 * `<ErrorBoundary>` when the user opted into analytics. 1TXT has no
 * analytics pipeline, so we always render the plain ErrorBoundary —
 * but we keep the export under the same name to avoid touching the
 * boot file, which is the only consumer.
 */
export const ErrorBoundaryWithAnalytics: FunctionComponent<
  ErrorBoundaryWithSentryOwnProps
> = ({ children }) => <ErrorBoundary>{children}</ErrorBoundary>;

export default ErrorBoundary;
