import * as A from '../action-types';

/**
 * Per-user storage quota.
 *
 *   used      bytes currently counted against the cap
 *   total     the cap itself (typically 1 MiB on the free tier)
 *   exceeded  the most recent ACK was rejected by the server with
 *             SQLSTATE 53100 (`quota_exceeded`). Stays true until the
 *             next successful ACK proves we're back under cap.
 *
 * Counting matches the server-side trigger on `note_ghosts`:
 *   only `octet_length(data->>'content')` of LIVE notes.
 *   Tags / metadata / version history are NOT counted.
 *
 * Server is the source of truth; this slice is a passive cache so the
 * footer indicator and "over quota" UX have something to render between
 * round-trips.
 */
export type QuotaState = {
  used: number;
  total: number;
  exceeded: boolean;
};

const DEFAULT_TOTAL = 1024 * 1024; // 1 MiB

const initialState: QuotaState = {
  used: 0,
  total: DEFAULT_TOTAL,
  exceeded: false,
};

const reducer: A.Reducer<QuotaState> = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_QUOTA':
      return {
        ...state,
        used: action.used,
        total: action.total,
      };
    case 'SET_QUOTA_EXCEEDED':
      return state.exceeded ? state : { ...state, exceeded: true };
    case 'ACKNOWLEDGE_PENDING_CHANGE':
      // A successful ACK after `exceeded` means the user freed up space
      // (probably via a delete / trim) and the backlog is draining
      // again — clear the warning so the indicator stops complaining.
      return state.exceeded ? { ...state, exceeded: false } : state;
    default:
      return state;
  }
};

export default reducer;
