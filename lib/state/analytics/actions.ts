/**
 * No-op analytics action creators. See state/analytics/middleware.ts
 * for the rationale. These two helpers are kept exported so existing
 * `actions.analytics.recordEvent(...)` and `withEvent(...)` call sites
 * still compile, but the resulting actions are not handled anywhere.
 */
import * as A from '../action-types';
import * as T from '../../types';

export const withEvent =
  (_eventName: string, _eventProperties?: T.JSONSerializable) =>
  <Action>(action: Action): Action =>
    action;

export const recordEvent: A.ActionCreator<A.RecordEvent> = (
  eventName: string,
  eventProperties?: T.JSONSerializable
) => ({
  type: 'RECORD_EVENT',
  eventName,
  eventProperties,
});
