'use strict';

/**
 * External dependencies
 */
const { Menu } = require('electron');

const { editorCommandSender } = require('../menus/utils');
const { t } = require('../i18n');

module.exports = function (mainWindow) {
  mainWindow.webContents.on('context-menu', (event, params) => {
    const { editFlags } = params;
    Menu.buildFromTemplate([
      {
        id: 'selectAll',
        label: t('menu.edit.selectAll'),
        click: editorCommandSender({ action: 'selectAll' }),
        enabled: editFlags.canSelectAll,
      },
      {
        id: 'cut',
        label: t('menu.edit.cut'),
        role: 'cut',
        enabled: editFlags.canCut,
      },
      {
        id: 'copy',
        label: t('menu.edit.copy'),
        role: 'copy',
        enabled: editFlags.canCopy,
      },
      {
        id: 'paste',
        label: t('menu.edit.paste'),
        role: 'paste',
        enabled: editFlags.canPaste,
      },
      {
        type: 'separator',
      },
    ]).popup({});
  });
};
