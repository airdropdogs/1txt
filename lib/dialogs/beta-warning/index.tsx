import React, { Component } from 'react';
import { connect } from 'react-redux';
import SimplenoteLogo from '../../icons/simplenote';
import CrossIcon from '../../icons/cross';
import Dialog from '../../dialog';
import { closeDialog } from '../../state/ui/actions';

import * as S from '../../state';

type DispatchProps = {
  closeDialog: () => any;
};

type Props = DispatchProps;

export class BetaWarning extends Component<Props> {
  render() {
    const { closeDialog } = this.props;

    return (
      <div className="about">
        <Dialog hideTitleBar onDone={closeDialog} title="Beta Release">
          <div className="about-top">
            <SimplenoteLogo />

            <h1>1TXT</h1>
          </div>

          <p style={{ textAlign: 'center' }}>This is a beta release of 1TXT.</p>

          <p style={{ textAlign: 'center' }}>
            Sync, account and migration paths may still change between
            releases. Please keep regular backups of important notes.
          </p>

          <p style={{ textAlign: 'center' }}>
            Bugs &amp; feedback welcome on{' '}
            <a
              href="https://github.com/airdropdogs/1txt/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Issues
            </a>
            .
          </p>

          <button
            type="button"
            aria-label="Close dialog"
            className="about-done button"
            onClick={closeDialog}
          >
            <CrossIcon />
          </button>
        </Dialog>
      </div>
    );
  }
}

const mapDispatchToProps: S.MapDispatch<DispatchProps> = {
  closeDialog,
};

export default connect(null, mapDispatchToProps)(BetaWarning);
