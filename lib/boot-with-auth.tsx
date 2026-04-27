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
import { seedWelcomeNoteIfNeeded } from './welcome-note';

import '../scss/style.scss';

import isDevConfig from './utils/is-dev-config';

/**
 * After sync, the search middleware debounces FILTER_NOTES (~30ms) so `openedNote`
 * is often not set until slightly after `initSupabaseSync` resolves. We wait until
 * the first note is opened (or there are zero notes), then give the WYSIWYG shell
 * a frame + short delay so content can paint before the loading screen is replaced.
 *
 * Important: with workspace persistence, `ui.openedNote` may already be set on the
 * very first frame (preloaded from IndexedDB). We must additionally require
 * `data.notes.has(openedNote)` before treating that as "ready" — otherwise we
 * would unmask the editor pointing at a noteId that hasn't been hydrated yet
 * (or that was remotely deleted between sessions).
 */
function waitForInitialNotesReady(store: any): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    let unsub: (() => void) | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      try {
        unsub?.();
      } catch {
        /* noop */
      }
    };

    const finish = (needsEditorWarmup: boolean) => {
      if (done) return;
      done = true;
      cleanup();
      if (needsEditorWarmup) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(resolve, 150);
          });
        });
      } else {
        resolve();
      }
    };

    const tryCheck = (): boolean => {
      const s = store.getState();
      if (s.data.notes.size === 0) {
        finish(false);
        return true;
      }
      const openedNote = s.ui.openedNote;
      if (openedNote != null && s.data.notes.has(openedNote)) {
        finish(true);
        return true;
      }
      return false;
    };

    if (tryCheck()) {
      return;
    }

    unsub = store.subscribe(() => {
      tryCheck();
    });

    timeoutId = setTimeout(() => {
      if (done) return;
      done = true;
      cleanup();
      resolve();
    }, 8000);
  });
}

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

  let awaitInitialSync = false;
  if (typeof sessionStorage !== 'undefined') {
    awaitInitialSync =
      sessionStorage.getItem('1txt_pending_initial_sync') === '1';
    if (awaitInitialSync) {
      sessionStorage.removeItem('1txt_pending_initial_sync');
    }
  }

  makeStore(username, supabaseSyncMiddleware).then(async (store) => {
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

    if (userId && token) {
      try {
        if (awaitInitialSync) {
          await initSupabaseSync(store, userId, token, refreshToken, logout);
          await waitForInitialNotesReady(store);
          // Only attempt to seed the welcome note on a *fresh* login path,
          // because that is the only moment we can be confident that:
          //   (a) initial sync has completed (so notes.size === 0 means
          //       the cloud is genuinely empty, not "still loading"), and
          //   (b) it is the user's very first session on this device.
          // The seed itself is also idempotent via a localStorage flag.
          try {
            seedWelcomeNoteIfNeeded(store, { forceWysiwyg: true });
          } catch (e) {
            console.warn('[Welcome] Failed to seed welcome note:', e);
          }
        } else {
          void initSupabaseSync(
            store,
            userId,
            token,
            refreshToken,
            logout
          ).catch((e) => console.error('[Sync] Init failed:', e));
        }
      } catch (e) {
        console.error('[Sync] Init failed:', e);
      }
    } else {
      console.warn(
        '[Sync] Missing userId/token, cloud sync disabled for this session'
      );
    }

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
  });
};
