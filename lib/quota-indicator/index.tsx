/**
 * QuotaIndicator
 *
 * Footer badge showing how much of the per-user 1 MiB cloud quota the
 * live note text is currently using. Mirrors the placement and shape of
 * <ConnectionStatus> so the two read as one "system status" cluster.
 *
 * Color tiers:
 *   <80%  : neutral (current foreground)
 *   80-99%: amber  (#d68f00)
 *   ≥100% : red    (#d63638)  ← also shows the over-quota dialog once
 *
 * The dialog (<QuotaExceededDialog>) is triggered by a 53100 from the
 * server-side trigger on note_ghosts. While it's open, edits keep
 * landing in IndexedDB; the upload simply pauses until used_bytes
 * drops below cap.
 */
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from '@mui/material';

import * as S from '../state';

import './style';

type StateProps = {
  used: number;
  total: number;
  exceeded: boolean;
};

type Props = StateProps;

const formatMiB = (bytes: number): string => {
  const mib = bytes / (1024 * 1024);
  if (mib >= 1) return `${mib.toFixed(1)} MiB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KiB`;
  return `${bytes} B`;
};

export const QuotaIndicator: FunctionComponent<Props> = ({
  used,
  total,
  exceeded,
}) => {
  const ratio = total > 0 ? Math.min(used / total, 1.5) : 0;
  const pct = Math.min(ratio * 100, 100);
  const tier = exceeded || ratio >= 1 ? 'over' : ratio >= 0.8 ? 'warn' : 'ok';

  // One-shot dismissible toast. We track the latest `exceeded` value so
  // the dialog only opens on the rising edge — re-opening it on every
  // render after the user dismissed it would be obnoxious.
  const [showDialog, setShowDialog] = useState(false);
  const wasExceeded = useRef(false);
  useEffect(() => {
    if (exceeded && !wasExceeded.current) {
      setShowDialog(true);
    }
    if (!exceeded && wasExceeded.current) {
      setShowDialog(false);
    }
    wasExceeded.current = exceeded;
  }, [exceeded]);

  const tooltip =
    tier === 'over'
      ? 'Your 1 MiB cloud quota is full. Recent edits stay local until you free up space.'
      : tier === 'warn'
        ? `You've used ${formatMiB(used)} of your ${formatMiB(total)} cloud quota. Live note text only — version history doesn't count.`
        : `Cloud quota: ${formatMiB(used)} of ${formatMiB(total)} used. Live note text only — version history doesn't count.`;

  return (
    <>
      <div className={`quota-indicator quota-indicator--${tier}`}>
        <Tooltip
          enterDelay={200}
          classes={{ tooltip: 'icon-button__tooltip' }}
          title={tooltip}
        >
          <div className="quota-indicator__row">
            <span className="quota-indicator__label">
              {formatMiB(used)} / {formatMiB(total)}
            </span>
            <div className="quota-indicator__bar">
              <div
                className="quota-indicator__bar-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </Tooltip>
      </div>
      {showDialog && (
        <QuotaExceededDialog onClose={() => setShowDialog(false)} />
      )}
    </>
  );
};

const QuotaExceededDialog: FunctionComponent<{ onClose: () => void }> = ({
  onClose,
}) => (
  <div
    className="quota-indicator__dialog-backdrop"
    role="presentation"
    onClick={onClose}
  >
    <div
      className="quota-indicator__dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quota-dialog-title"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 id="quota-dialog-title">Cloud quota full</h3>
      <p>
        You&rsquo;ve hit the 1 MiB per-user limit on cloud storage. Your recent
        edits are safe in your local cache and will upload as soon as you free
        up space.
      </p>
      <ul>
        <li>Delete old or large notes you no longer need.</li>
        <li>Empty the Trash to release the bytes.</li>
        <li>Live note text counts against the cap; version history is free.</li>
      </ul>
      <div className="quota-indicator__dialog-buttons">
        <button type="button" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  </div>
);

const mapStateToProps: S.MapState<StateProps> = (state) => ({
  used: state.quota.used,
  total: state.quota.total,
  exceeded: state.quota.exceeded,
});

export default connect(mapStateToProps)(QuotaIndicator);
