/**
 * 1TXT does not collect analytics. This file used to wire up Tracks
 * (Automattic's analytics SDK) and Sentry; it now exists only as a
 * no-op shim so the many `recordEvent('foo')` call sites scattered
 * across the codebase keep compiling without a sweeping refactor.
 *
 * - `recordEvent()` accepts and discards the call.
 * - The middleware is a pure pass-through.
 *
 * If you ever decide to (re-)introduce telemetry, make it opt-in,
 * self-hosted, and rebuild this module — don't add anything Cloud-side
 * here without an explicit, separate UI consent flow.
 */
import type * as S from '../';
import type * as T from '../../types';

export const recordEvent = (
  _name: string,
  _properties?: T.JSONSerializable
): void => {
  // intentional no-op
};

export const middleware: S.Middleware = () => (next) => (action) =>
  next(action);

export default middleware;
