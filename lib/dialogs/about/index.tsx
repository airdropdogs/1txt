import React, { Component } from 'react';
import { connect } from 'react-redux';
import SimplenoteLogo from '../../icons/simplenote';
import CrossIcon from '../../icons/cross';
import TopRightArrowIcon from '../../icons/arrow-top-right';
import Dialog from '../../dialog';

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
        <Dialog hideTitleBar onDone={closeDialog} title="About">
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
                <span className="about-links-title">Source Code</span>
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
                <span className="about-links-title">Issues &amp; Feedback</span>
                <br />
                Report a bug or request a feature
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
                  Built on Simplenote (GPL-2.0)
                </span>
                <br />
                Original project by Automattic, Inc.
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
                  Editor powered by Vditor (MIT)
                </span>
                <br />
                Markdown WYSIWYG by Vanessa219
              </a>
              <TopRightArrowIcon />
            </li>
          </ul>

          <div className="about-bottom">
            <p>
              Open-source minimalist Markdown notes with live preview and
              free multi-device sync, powered by Supabase.
            </p>
            <p>
              &copy; {thisYear} airdropdogs · Released under the GNU
              General Public License v2.0.
            </p>
          </div>

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

export default AboutDialog;
