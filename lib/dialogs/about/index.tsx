import React, { Component } from 'react';
import { connect } from 'react-redux';
import SimplenoteLogo from '../../icons/simplenote';
import CrossIcon from '../../icons/cross';
import TopRightArrowIcon from '../../icons/arrow-top-right';
import Dialog from '../../dialog';
import { t } from '../../i18n';

const appVersion = config.version;

type OwnProps = {
  closeDialog: () => void;
};

type Props = OwnProps;

export class AboutDialog extends Component<Props> {
  render() {
    const { closeDialog } = this.props;
    const thisYear = new Date().getFullYear();

    return (
      <div className="about">
        <Dialog hideTitleBar onDone={closeDialog} title={t('about.title')}>
          <div className="about-top">
            <SimplenoteLogo />

            <h1>1TXT</h1>
            <small>Version {appVersion}</small>
          </div>

          <ul className="about-links">
            <li>
              <a
                target="_blank"
                href="https://github.com/airdropdogs/1txt"
                rel="noopener noreferrer"
              >
                <span className="about-links-title">
                  {t('about.sourceCode')}
                </span>
                <br />
                github.com/airdropdogs/1txt
              </a>
              <TopRightArrowIcon />
            </li>
            <li>
              <a
                target="_blank"
                href="https://github.com/airdropdogs/1txt/issues"
                rel="noopener noreferrer"
              >
                <span className="about-links-title">
                  {t('about.issuesFeedback')}
                </span>
                <br />
                {t('about.reportBug')}
              </a>
              <TopRightArrowIcon />
            </li>
            <li>
              <a
                target="_blank"
                href="https://github.com/Automattic/simplenote-electron"
                rel="noopener noreferrer"
              >
                <span className="about-links-title">
                  {t('about.builtOnSimplenote')}
                </span>
                <br />
                {t('about.originalByAutomattic')}
              </a>
              <TopRightArrowIcon />
            </li>
            <li>
              <a
                target="_blank"
                href="https://github.com/Vanessa219/vditor"
                rel="noopener noreferrer"
              >
                <span className="about-links-title">
                  {t('about.editorPoweredBy')}
                </span>
                <br />
                {t('about.markdownWysiwyg')}
              </a>
              <TopRightArrowIcon />
            </li>
          </ul>

          <div className="about-bottom">
            <p>{t('about.description')}</p>
            <p>{t('about.copyright').replace('{year}', String(thisYear))}</p>
          </div>

          <button
            type="button"
            aria-label={t('about.closeDialog')}
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

export default AboutDialog;
