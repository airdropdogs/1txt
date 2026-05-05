/**
 * Top-level of app state tree
 *
 * All data should flow through here
 */

import {
  Dispatch as ReduxDispatch,
  Middleware as ReduxMiddleware,
  compose,
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';
import persistState from 'redux-localstorage';
import { omit, pick } from 'lodash';
import { isElectron } from '../utils/platform';

// Whitelist of keys the `settings` reducer currently knows about. Anything else
// found in the persisted localStorage blob (e.g. legacy `localSyncDir` from the
// abandoned 1TXT_Vault local-folder experiment) is dropped on load to avoid the
// noisy "Unexpected key ... found in preloadedState" warning from redux.
const KNOWN_SETTINGS_KEYS = [
  'accountName',
  'autoHideMenuBar',
  'focusModeEnabled',
  'keyboardShortcuts',
  'bossKeyShortcut',
  'lineLength',
  'markdownEnabled',
  'noteDisplay',
  'sendNotifications',
  'sortReversed',
  'sortTagsAlpha',
  'sortType',
  'showPreviewButton',
  'spellCheckEnabled',
  'theme',
  'locale',
] as const;

import * as persistence from './persistence';
import { middleware as analyticsMiddleware } from './analytics/middleware';
import dataMiddleware from './data/middleware';
import electronMiddleware from './electron/middleware';
import { middleware as searchMiddleware } from '../search';
import uiMiddleware from './ui/middleware';
import searchFieldMiddleware from './ui/search-field-middleware';

import { reducer as browser, middleware as browserMiddleware } from './browser';
import data from './data/reducer';
import quota from './quota/reducer';
import settings from './settings/reducer';
import simperium from './simperium/reducer';
import ui from './ui/reducer';

import * as A from './action-types';

const reducers = combineReducers<State, A.ActionType>({
  browser,
  data,
  quota,
  settings,
  simperium,
  ui,
});

export type State = {
  browser: ReturnType<typeof browser>;
  data: ReturnType<typeof data>;
  quota: ReturnType<typeof quota>;
  settings: ReturnType<typeof settings>;
  simperium: ReturnType<typeof simperium>;
  ui: ReturnType<typeof ui>;
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const makeStore = (
  accountName: string | null,
  ...middlewares: Middleware[]
) =>
  persistence
    .loadState(accountName)
    .then(([initialData, persistenceMiddleware]) =>
      createStore<State, A.ActionType, {}, {}>(
        reducers,
        {
          // `initialData` already carries `data` / `simperium` / `settings`,
          // and as of the workspace-restore feature it may also carry a
          // partial `ui` slice (`collection` + `openedNote`) so the user
          // lands back in their last selected tag/note after a restart.
          // Other `ui` sub-reducers receive `undefined` and fall back to
          // their built-in initial state — that's the intended behavior.
          ...initialData,
          settings: {
            ...pick(initialData.settings, KNOWN_SETTINGS_KEYS),
            accountName: initialData.settings?.accountName ?? accountName,
          },
        },
        composeEnhancers(
          persistState('settings', {
            key: 'simpleNote',
            slicer: (path) => (state) => ({
              // Omit property from persisting
              [path]: omit(state[path], [
                'allowNotifications',
                'focusModeEnabled',
              ]),
            }),
          }),
          applyMiddleware(
            dataMiddleware,
            analyticsMiddleware,
            browserMiddleware,
            searchMiddleware,
            searchFieldMiddleware,
            uiMiddleware,
            ...(isElectron ? [electronMiddleware] : []),
            ...middlewares,
            ...(persistenceMiddleware ? [persistenceMiddleware] : [])
          )
        )
      )
    );

export type Store = {
  dispatch: Dispatch;
  getState(): State;
};

export type MapState<StateProps, OwnProps = {}> = (
  state: State,
  ownProps: OwnProps
) => StateProps;

export type MapDispatchFunction<DispatchProps, OwnProps = {}> = (
  dispatch: <T extends A.ActionType>(action: T) => T,
  ownProps: OwnProps
) => DispatchProps;

export type MapDispatch<
  DispatchProps extends { [name: string]: (...args: any[]) => any },
  OwnProps = {},
> =
  | MapDispatchFunction<DispatchProps, OwnProps>
  | {
      [P in keyof DispatchProps]: (
        ...args: Parameters<DispatchProps[P]>
      ) => A.ActionType;
    };

export type Dispatch = ReduxDispatch<A.ActionType>;
export type Middleware<Extension = {}> = ReduxMiddleware<
  Extension,
  State,
  Dispatch
>;

export type Selector<T> = (state: State, ...args: any[]) => T;
