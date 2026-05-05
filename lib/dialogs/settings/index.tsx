import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import Dialog from '../../dialog';
import TabPanels from '../../components/tab-panels';

import AccountPanel from './panels/account';
import DisplayPanel from './panels/display';
import ToolsPanel from './panels/tools';

import { closeDialog } from '../../state/ui/actions';
import { t } from '../../i18n';

type DispatchProps = {
  closeDialog: () => any;
};

type Props = DispatchProps;

export const SettingsDialog: FunctionComponent<Props> = ({ closeDialog }) => (
  <Dialog className="settings" title={t('settings.title')} onDone={closeDialog}>
    <TabPanels
      tabNames={[
        t('settings.tabAccount'),
        t('settings.tabDisplay'),
        t('settings.tabTools'),
      ]}
    >
      <AccountPanel />
      <DisplayPanel />
      <ToolsPanel />
    </TabPanels>
  </Dialog>
);

export default connect(null, { closeDialog })(SettingsDialog);
