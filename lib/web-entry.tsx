import './utils/ensure-platform-support';
import 'setimmediate';

import { parse } from 'cookie';

import { boot as bootWithoutAuth } from './boot-without-auth';
import { boot as bootLoggingOut } from './logging-out';
import { isElectron } from './utils/platform';
import bootPublicNotePage from './public-note-page.tsx';
import { getSupabaseClient } from './sync/supabase-client';

const clearStorage = (): Promise<void> =>
  new Promise((resolveStorage) => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('lastSyncedTime');
    localStorage.removeItem('localQueue:note');
    localStorage.removeItem('localQueue:preferences');
    localStorage.removeItem('localQueue:tag');
    localStorage.removeItem('simpleNote');
    localStorage.removeItem('stored_user');
    localStorage.removeItem('1txt_refresh_token');
    localStorage.removeItem('1txt_user_id');
    sessionStorage.clear();
    window.electron?.send('appStateUpdate', {});

    Promise.all([
      new Promise((resolve) => {
        const r = indexedDB.deleteDatabase('ghost');
        r.onupgradeneeded = resolve;
        r.onblocked = resolve;
        r.onsuccess = resolve;
        r.onerror = resolve;
      }),
      new Promise((resolve) => {
        const r = indexedDB.deleteDatabase('simplenote');
        r.onupgradeneeded = resolve;
        r.onblocked = resolve;
        r.onsuccess = resolve;
        r.onerror = resolve;
      }),
      new Promise((resolve) => {
        const r = indexedDB.deleteDatabase('simplenote_v2');
        r.onupgradeneeded = resolve;
        r.onblocked = resolve;
        r.onsuccess = resolve;
        r.onerror = resolve;
      }),
    ])
      .then(() => {
        window.electron?.send('clearCookies');
        resolveStorage();
      })
      .catch(() => resolveStorage());
  });

const forceReload = () => {
  if (isElectron) {
    window.electron?.send('reload');
  } else {
    window.history.go();
  }
};

type StoredAccount = {
  accessToken: string | null;
  username: string | null;
  refreshToken: string | null;
  userId: string | null;
};

const readStoredAccount = (): StoredAccount => {
  const storedUserData = localStorage.getItem('stored_user');
  let storedUser: { accessToken?: string; username?: string } | null = null;

  if (storedUserData) {
    try {
      storedUser = JSON.parse(storedUserData);
    } catch (e) {
      storedUser = null;
    }
  }

  return {
    accessToken:
      storedUser?.accessToken || localStorage.getItem('access_token'),
    username: storedUser?.username || null,
    refreshToken: localStorage.getItem('1txt_refresh_token'),
    userId: localStorage.getItem('1txt_user_id'),
  };
};

const saveAccount = (accessToken: string, username: string): void => {
  localStorage.setItem(
    'stored_user',
    JSON.stringify({ accessToken, username })
  );
  localStorage.setItem('access_token', accessToken);
};

const restoreSessionIfNeeded = async (): Promise<StoredAccount> => {
  const account = readStoredAccount();
  if (!account.accessToken || !account.refreshToken) {
    return account;
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return account;
  }

  try {
    const { error } = await supabase.auth.setSession({
      access_token: account.accessToken,
      refresh_token: account.refreshToken,
    });

    if (error) {
      throw error;
    }

    return account;
  } catch (e) {
    console.warn('[Auth] Failed to restore session from storage:', e);
    await clearStorage();
    return {
      accessToken: null,
      username: null,
      refreshToken: null,
      userId: null,
    };
  }
};

const start = async () => {
  const pathname = window.location.pathname;

  if (/^\/p\/[^/]+/.test(pathname)) {
    const noteId = pathname.split('/').pop() || '';
    bootPublicNotePage(noteId);
    return;
  }

  const restoredAccount = await restoreSessionIfNeeded();
  const cookie = parse(document.cookie);

  if (config.is_app_engine && cookie?.token && cookie?.email) {
    if (cookie.email !== restoredAccount.username) {
      await clearStorage();
      saveAccount(cookie.token, cookie.email);
    }
    const { bootWithToken } = await import(
      /* webpackChunkName: 'boot-with-auth' */ './boot-with-auth'
    );
    bootWithToken(
      () => {
        bootLoggingOut();
        clearStorage().then(() => {
          if (window.webConfig?.signout) {
            window.webConfig.signout(forceReload);
          } else {
            forceReload();
          }
        });
      },
      cookie.token,
      cookie.email
    );
    return;
  }

  if (restoredAccount.accessToken) {
    const { bootWithToken } = await import(
      /* webpackChunkName: 'boot-with-auth' */ './boot-with-auth'
    );
    bootWithToken(
      () => {
        bootLoggingOut();
        clearStorage().then(() => {
          if (window.webConfig?.signout) {
            window.webConfig.signout(forceReload);
          } else {
            forceReload();
          }
        });
      },
      restoredAccount.accessToken,
      restoredAccount.username
    );
    return;
  }

  window.addEventListener('storage', (event) => {
    if (
      event.key === 'stored_user' ||
      event.key === 'access_token' ||
      event.key === '1txt_refresh_token' ||
      event.key === '1txt_user_id'
    ) {
      forceReload();
    }
  });

  bootWithoutAuth((token: string, username: string) => {
    saveAccount(token, username);
    window.location.pathname = '/';
  });
};

void start();
