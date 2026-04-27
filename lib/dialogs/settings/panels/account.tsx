import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import PanelTitle from '../../../components/panel-title';
import QuotaIndicator from '../../../quota-indicator';
import actions from '../../../state/actions';

import * as S from '../../../state';

type StateProps = {
  accountName: string;
};

type DispatchProps = {
  logout: () => any;
};

type Props = StateProps & DispatchProps;

const AccountPanel: FunctionComponent<Props> = ({ accountName, logout }) => (
  <div className="settings-account">
    <PanelTitle headingLevel={3}>Account</PanelTitle>

    <div className="settings-items">
      <div className="settings-item">
        <span className="settings-account-name">{accountName}</span>
      </div>
    </div>

    <ul className="dialog-actions">
      <li>
        <QuotaIndicator />
      </li>
      <li>
        <button
          type="button"
          className="button button-primary"
          onClick={logout}
        >
          Log Out
        </button>
      </li>
    </ul>
  </div>
);

const mapStateToProps: S.MapState<StateProps> = (state) => ({
  accountName: state.settings.accountName,
});

const mapDispatchToProps: S.MapDispatch<DispatchProps> = {
  logout: actions.ui.logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountPanel);
