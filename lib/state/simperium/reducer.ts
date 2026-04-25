import { combineReducers } from 'redux';

import type { ChangeVersion, EntityId, Ghost } from 'simperium';
import * as A from '../action-types';
import * as T from '../../types';

const emptyMap = new Map<unknown, unknown>();

const connectionStatus: A.Reducer<T.ConnectionState> = (
  state = navigator.onLine ? 'red' : 'offline',
  action
) => (action.type === 'CHANGE_CONNECTION_STATUS' ? action.status : state);

const ghosts: A.Reducer<
  [Map<string, ChangeVersion>, Map<string, Map<EntityId, Ghost<unknown>>>]
> = (state = [new Map(), new Map()], action) => {
  switch (action.type) {
    case 'GHOST_REMOVE_ENTITY': {
      const [cvs, buckets] = state;
      const bucket = buckets.get(action.bucketName) ?? new Map();
      const nextBucket = new Map(bucket);
      nextBucket.delete(action.entityId);

      return [cvs, new Map(buckets).set(action.bucketName, nextBucket)];
    }

    case 'GHOST_SET_CHANGE_VERSION': {
      const [cvs, buckets] = state;
      const nextCvs = new Map(cvs).set(action.bucketName, action.version);

      return [nextCvs, buckets];
    }

    case 'GHOST_SET_ENTITY': {
      const [cvs, buckets] = state;
      const bucket = buckets.get(action.bucketName) ?? new Map();
      const nextBucket = new Map(bucket).set(action.entityId, action.ghost);

      return [cvs, new Map(buckets).set(action.bucketName, nextBucket)];
    }

    default:
      return state;
  }
};

const lastSync: A.Reducer<Map<T.EntityId, number>> = (
  state = emptyMap as Map<T.EntityId, number>,
  action
) => {
  switch (action.type) {
    case 'ACKNOWLEDGE_PENDING_CHANGE':
      return new Map(state).set(action.entityId, Date.now());

    case 'REMOTE_NOTE_UPDATE':
      return new Map(state).set(action.noteId, Date.now());

    default:
      return state;
  }
};

const lastRemoteUpdate: A.Reducer<Map<T.EntityId, number>> = (
  state = emptyMap as Map<T.EntityId, number>,
  action
) => {
  switch (action.type) {
    case 'REMOTE_NOTE_UPDATE':
      return action.remoteInfo
        ? new Map(state).set(action.noteId, Date.now())
        : state;

    default:
      return state;
  }
};

const emptySet = new Set<T.EntityId>();

// Notes that have local edits queued for the cloud but not yet acked.
// Populated by the Supabase sync middleware; read by `noteHasPendingChanges`
// so the per-note sync icon only lights up for notes actually being synced.
const pendingChanges: A.Reducer<Set<T.EntityId>> = (
  state = emptySet,
  action
) => {
  switch (action.type) {
    case 'SUBMIT_PENDING_CHANGE': {
      if (state.has(action.entityId)) return state;
      const next = new Set(state);
      next.add(action.entityId);
      return next;
    }

    case 'ACKNOWLEDGE_PENDING_CHANGE': {
      if (!state.has(action.entityId)) return state;
      const next = new Set(state);
      next.delete(action.entityId);
      return next;
    }

    default:
      return state;
  }
};

export default combineReducers({
  connectionStatus,
  ghosts,
  lastSync,
  lastRemoteUpdate,
  pendingChanges,
});
