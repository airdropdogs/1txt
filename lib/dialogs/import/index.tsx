import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';

import Dialog from '../../dialog';
import { isElectron } from '../../utils/platform';
import SourceImporter from './source-importer';
import { closeDialog } from '../../state/ui/actions';
import { t } from '../../i18n';

import * as S from '../../state';

type DispatchProps = {
  closeDialog: () => any;
};

type Props = DispatchProps;

class ImportDialog extends Component<Props> {
  state = {
    importStarted: false,
  };

  render() {
    const { closeDialog } = this.props;
    const { importStarted } = this.state;
    const source = {
      acceptedTypes: isElectron
        ? '.txt,.md,.json,.zip,.enex'
        : '.txt,.md,.zip,.json',
      title: t('import.selectNotes'),
      instructions: isElectron
        ? t('import.formatsElectron')
        : t('import.formatsBrowser'),
      multiple: true,
    };

    return (
      <Dialog
        className="import"
        closeBtnLabel={importStarted ? '' : t('import.cancel')}
        onDone={importStarted ? undefined : closeDialog}
        title={t('import.title')}
      >
        <div className="import__inner">
          <SourceImporter
            locked={importStarted}
            onClose={closeDialog}
            onStart={() => this.setState({ importStarted: true })}
            source={source}
          />
        </div>
      </Dialog>
    );
  }
}

const mapDispatchToProps: S.MapDispatch<DispatchProps> = {
  closeDialog,
};

export default connect(null, mapDispatchToProps)(ImportDialog);
