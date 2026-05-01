import './utils/ensure-platform-support';
import 'setimmediate';

import { parse } from 'cookie';

import { boot as bootWithoutAuth } from './boot-without-auth';
import { boot as bootLoggingOut } from './logging-out';
import { isElectron } from './utils/platform';
import bootPublicNotePage from './public-note-page.tsx';

const clearStorage = (): Promise<void> =>
  new Promise((resolveStorage) => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('lastSyncedTime');
    localStorage.removeItem('localQueue:note');
    localStorage.removeItem('localQueue:preferences');
    localStorage.removeItem('localQueue:tag');
    localStorage.removeItem('simpleNote');
    localStorage.removeItem('stored_user');
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

const loadAccount = () => {
  const storedUserData = localStorage.getItem('stored_user');
  if (!storedUserData) {
    return [null, null];
  }

  try {
    const storedUser = JSON.parse(storedUserData);
    return [storedUser.accessToken, storedUser.username];
  } catch (e) {
    return [null, null];
  }
};

const saveAccount = (accessToken: string, username: string): void => {
  localStorage.setItem(
    'stored_user',
    JSON.stringify({ accessToken, username })
  );
};

const getStoredAccount = () => {
  const [storedToken, storedUsername] = loadAccount();

  const cookie = parse(document.cookie);
  if (config.is_app_engine && cookie?.token && cookie?.email) {
    if (cookie.email !== storedUsername) {
      clearStorage();
      saveAccount(cookie.token, cookie.email);
    }
    return [cookie.token, cookie.email];
  }

  if (storedToken) {
    return [storedToken, storedUsername];
  }

  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    return [accessToken, null];
  }

  return [null, null];
};

const [storedToken, storedUsername] = getStoredAccount();
const pathname = window.location.pathname;

if (/^\/p\/[^/]+/.test(pathname)) {
  const noteId = pathname.split('/').pop() || '';
  bootPublicNotePage(noteId);
} else if (config.is_app_engine && !storedToken) {
  window.webConfig?.signout?.(() => {
    window.location = `${config.app_engine_url}/`;
  });
} else if (storedToken) {
  Promise.all([
    !('normalize' in String.prototype)
      ? import(/* webpackChunkName: 'unorm' */ 'unorm')
      : Promise.resolve(),
    import(/* webpackChunkName: 'boot-with-auth' */ './boot-with-auth'),
  ]).then(([unormPolyfillLoaded, { bootWithToken }]) => {
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
      storedToken,
      storedUsername
    );
  });
} else {
  window.addEventListener('storage', (event) => {
    if (event.key === 'stored_user') {
      forceReload();
    }
  });
  bootWithoutAuth((token: string, username: string) => {
    saveAccount(token, username);
    window.location.pathname = '/';
  });
}
