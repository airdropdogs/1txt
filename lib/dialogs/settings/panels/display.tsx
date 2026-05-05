import React, { Fragment, FunctionComponent } from 'react';
import { connect } from 'react-redux';

import { isElectron, isLinux, isMac } from '../../../utils/platform';
import RadioGroup from '../../radio-settings-group';
import SettingsGroup, { Item } from '../../settings-group';
import ToggleGroup from '../../toggle-settings-group';
import actions from '../../../state/actions';
import { t, SUPPORTED_LOCALES } from '../../../i18n';

import * as S from '../../../state';
import * as T from '../../../types';

type SortOption = {
  labelKey: string;
  type: T.SortType;
  isReversed: boolean;
};

const sortTypes: SortOption[] = [
  {
    labelKey: 'settings.display.sortNameAZ',
    type: 'alphabetical',
    isReversed: false,
  },
  {
    labelKey: 'settings.display.sortNameZA',
    type: 'alphabetical',
    isReversed: true,
  },
  {
    labelKey: 'settings.display.sortCreatedNewest',
    type: 'creationDate',
    isReversed: false,
  },
  {
    labelKey: 'settings.display.sortCreatedOldest',
    type: 'creationDate',
    isReversed: true,
  },
  {
    labelKey: 'settings.display.sortModifiedNewest',
    type: 'modificationDate',
    isReversed: false,
  },
  {
    labelKey: 'settings.display.sortModifiedOldest',
    type: 'modificationDate',
    isReversed: true,
  },
];

type StateProps = {
  activeTheme: T.Theme;
  autoHideMenuBar: boolean;
  lineLength: T.LineLength;
  locale: string;
  noteDisplay: T.ListDisplayMode;
  sortReversed: boolean;
  sortTagsAlpha: boolean;
  sortType: T.SortType;
};

type DispatchProps = {
  changeLocale: (locale: string) => any;
  setActiveTheme: (theme: T.Theme) => any;
  setLineLength: (lineLength: T.LineLength) => any;
  setNoteDisplay: (displayMode: T.ListDisplayMode) => any;
  setSortType: (sortType: T.SortType, sortReversed: boolean) => any;
  toggleAutoHideMenuBar: () => any;
  toggleSortTagsAlpha: () => any;
};

type Props = StateProps & DispatchProps;

const DisplayPanel: FunctionComponent<Props> = (props) => (
  <Fragment>
    <SettingsGroup
      title={t('settings.display.title')}
      slug="noteDisplay"
      activeSlug={props.noteDisplay}
      onChange={props.setNoteDisplay}
      renderer={RadioGroup}
    >
      <Item title={t('settings.display.comfy')} slug="comfy" />
      <Item title={t('settings.display.condensed')} slug="condensed" />
      <Item title={t('settings.display.expanded')} slug="expanded" />
    </SettingsGroup>

    <SettingsGroup
      title={t('settings.display.lineLength')}
      slug="lineLength"
      activeSlug={props.lineLength}
      onChange={props.setLineLength}
      renderer={RadioGroup}
    >
      <Item title={t('settings.display.narrow')} slug="narrow" />
      <Item title={t('settings.display.full')} slug="full" />
    </SettingsGroup>

    <SettingsGroup
      title={t('settings.display.sortBy')}
      slug="sortType"
      activeSlug={
        props.sortReversed ? props.sortType + '-reversed' : props.sortType
      }
      onChange={(slug) => {
        const isReversed = slug.includes('-reversed');
        const newSortType = slug.split('-');
        props.setSortType(newSortType[0], isReversed);
      }}
      renderer={RadioGroup}
    >
      {sortTypes.map((item) => {
        const slug = item.isReversed ? item.type + '-reversed' : item.type;
        return <Item key={slug} title={t(item.labelKey)} slug={slug} />;
      })}
    </SettingsGroup>

    <SettingsGroup
      title={t('settings.display.tags')}
      slug="sortTagsAlpha"
      activeSlug={props.sortTagsAlpha ? 'alpha' : ''}
      onChange={props.toggleSortTagsAlpha}
      renderer={ToggleGroup}
    >
      <Item title={t('settings.display.sortAlphabetically')} slug="alpha" />
    </SettingsGroup>

    <SettingsGroup
      title={t('settings.display.theme')}
      slug="theme"
      activeSlug={props.activeTheme}
      onChange={props.setActiveTheme}
      renderer={RadioGroup}
    >
      {!isLinux && <Item title={t('settings.display.system')} slug="system" />}
      <Item title={t('settings.display.light')} slug="light" />
      <Item title={t('settings.display.dark')} slug="dark" />
    </SettingsGroup>

    <div className="settings-group">
      <label className="settings-item" htmlFor="settings-field-locale">
        <div className="settings-item-label">
          {t('settings.display.language')}
        </div>
        <div className="settings-item-control">
          <select
            id="settings-field-locale"
            value={props.locale}
            onChange={(e) => props.changeLocale(e.target.value)}
          >
            {SUPPORTED_LOCALES.map(({ value, labelKey }) => (
              <option key={value} value={value}>
                {t(labelKey)}
              </option>
            ))}
          </select>
        </div>
      </label>
    </div>

    {isElectron && !isMac && (
      <SettingsGroup
        title={t('settings.display.menuBar')}
        slug="autoHideMenuBar"
        activeSlug={props.autoHideMenuBar ? 'autoHide' : ''}
        description={t('settings.display.menuBarDescription')}
        onChange={props.toggleAutoHideMenuBar}
        renderer={ToggleGroup}
      >
        <Item title={t('settings.display.hideAutomatically')} slug="autoHide" />
      </SettingsGroup>
    )}
  </Fragment>
);

const mapStateToProps: S.MapState<StateProps> = ({ settings }) => ({
  activeTheme: settings.theme,
  autoHideMenuBar: settings.autoHideMenuBar,
  lineLength: settings.lineLength,
  locale: settings.locale,
  noteDisplay: settings.noteDisplay,
  sortReversed: settings.sortReversed,
  sortTagsAlpha: settings.sortTagsAlpha,
  sortType: settings.sortType,
});

const mapDispatchToProps: S.MapDispatch<DispatchProps> = {
  changeLocale: actions.settings.changeLocale,
  setActiveTheme: actions.settings.activateTheme,
  setLineLength: actions.settings.setLineLength,
  setNoteDisplay: actions.settings.setNoteDisplay,
  setSortType: actions.settings.setSortType,
  toggleAutoHideMenuBar: actions.settings.toggleAutoHideMenuBar,
  toggleSortTagsAlpha: actions.settings.toggleSortTagsAlpha,
};

export default connect(mapStateToProps, mapDispatchToProps)(DisplayPanel);
