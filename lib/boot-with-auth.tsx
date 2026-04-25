if (__TEST__) {
  window.testEvents = [];
}

import React from 'react';
import App from './app';
import { ErrorBoundaryWithAnalytics } from './error-boundary';
import Modal from 'react-modal';
import { makeStore } from './state';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { supabaseSyncMiddleware, initSupabaseSync } from './sync/middleware';

import '../scss/style.scss';

import isDevConfig from './utils/is-dev-config';

export const bootWithToken = (
  logout: () => any,
  token: string,
  username: string | null
) => {
  Modal.setAppElement('#root');

  // Tokens stashed by the OTP flow in lib/boot-without-auth.tsx
  const userId =
    (typeof localStorage !== 'undefined' &&
      localStorage.getItem('1txt_user_id')) ||
    '';
  const refreshToken =
    (typeof localStorage !== 'undefined' &&
      localStorage.getItem('1txt_refresh_token')) ||
    '';

  makeStore(username, supabaseSyncMiddleware).then((store) => {
    Object.defineProperties(window, {
      dispatch: {
        get() {
          return store.dispatch;
        },
      },
      state: {
        get() {
          return store.getState();
        },
      },
    });

    window.electron?.send('appStateUpdate', {
      settings: store.getState().settings,
      editMode: store.getState().ui.editMode,
    });

    render(
      <Provider store={store}>
        <ErrorBoundaryWithAnalytics
          isDevConfig={isDevConfig(config?.development)}
        >
          <App isDevConfig={isDevConfig(config?.development)} />
        </ErrorBoundaryWithAnalytics>
      </Provider>,
      document.getElementById('root')
    );

    // Bring up Supabase sync after the app shell is mounted so the user
    // sees the UI immediately, then notes stream in via REMOTE_NOTE_UPDATE.
    if (userId && token) {
      initSupabaseSync(store, userId, token, refreshToken, logout).catch((e) =>
        console.error('[Sync] Init failed:', e)
      );
    } else {
      console.warn(
        '[Sync] Missing userId/token, cloud sync disabled for this session'
      );
    }
  });
};
