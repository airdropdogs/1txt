import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from '@mui/material';
import ConnectionIcon from '../icons/connection';
import NoConnectionIcon from '../icons/no-connection';

import * as S from '../state';
import * as T from '../types';

import './style';

type StateProps = {
  connectionStatus: T.ConnectionState;
};

type Props = StateProps;

export const ConnectionStatus: FunctionComponent<Props> = ({
  connectionStatus,
}) => (
  <div className="navigation-bar__footer-item">
    <Tooltip
      enterDelay={200}
      classes={{ tooltip: 'icon-button__tooltip' }}
      title={
        connectionStatus === 'green'
          ? '1TXT is connected and syncing with the server.'
          : connectionStatus === 'offline'
            ? "You're offline. Edits are saved locally and will upload automatically once the network is back."
            : "1TXT hasn't reached the server in a while. Your edits are safe locally and will sync as soon as the connection recovers."
      }
    >
      <p>
        {connectionStatus === 'green' ? (
          <ConnectionIcon />
        ) : (
          <NoConnectionIcon />
        )}
        <span className="server-connection__label">Server connection</span>
      </p>
    </Tooltip>
  </div>
);

const mapStateToProps: S.MapState<StateProps> = (state) => ({
  connectionStatus: state.simperium.connectionStatus,
});

export default connect(mapStateToProps)(ConnectionStatus);
