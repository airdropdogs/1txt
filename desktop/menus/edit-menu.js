const { appCommandSender, editorCommandSender } = require('./utils');
const { t } = require('../i18n');

const buildEditMenu = (settings, isAuthenticated, editMode) => {
  settings = settings || {};
  isAuthenticated = isAuthenticated || false;
  editMode = editMode || false;

  let undo = {
    label: t('menu.edit.undo'),
    click: editorCommandSender({ action: 'undo' }),
    accelerator: 'CommandOrControl+Z',
    visible: editMode,
  };
  let redo = {
    label: t('menu.edit.redo'),
    click: editorCommandSender({ action: 'redo' }),
    accelerator: 'CommandOrControl+Shift+Z',
    visible: editMode,
  };
  let selectAll = {
    label: t('menu.edit.selectAll'),
    click: editorCommandSender({ action: 'selectAll' }),
    accelerator: 'CommandOrControl+A',
  };

  const editModeMenuOptions = editMode
    ? [
        undo,
        redo,
        {
          type: 'separator',
        },
      ]
    : [];

  // menu items with roles don't respect visibility, so we have to do this the hard way
  if (!editMode) {
    selectAll['role'] = 'selectAll';
  }

  let authenticatedMenuOptions = [];

  if (isAuthenticated) {
    authenticatedMenuOptions = [
      { type: 'separator' },
      {
        label: t('menu.edit.trashNote'),
        click: appCommandSender({ action: 'trashNote' }),
      },
      { type: 'separator' },
      {
        label: t('menu.edit.searchNotes'),
        click: appCommandSender({ action: 'focusSearchField' }),
        accelerator: 'CommandOrControl+Shift+S',
      },
      {
        label: t('menu.edit.findInNote'),
        click: appCommandSender({ action: 'focusSearchField' }),
        accelerator: 'CommandOrControl+F',
      },
      {
        label: t('menu.edit.findAgain'),
        click: editorCommandSender({ action: 'findAgain' }),
        accelerator: 'CommandOrControl+G',
      },
    ];
  }

  const defaultSubmenuAdditions = [
    {
      label: t('menu.edit.cut'),
      role: 'cut',
    },
    {
      label: t('menu.edit.copy'),
      role: 'copy',
    },
    {
      label: t('menu.edit.paste'),
      role: 'paste',
    },
    selectAll,
    { type: 'separator' },
  ];

  const submenu = editModeMenuOptions
    .concat(defaultSubmenuAdditions)
    .concat(authenticatedMenuOptions);

  const fileMenu = {
    label: t('menu.edit.title'),
    submenu,
  };

  return fileMenu;
};

module.exports = buildEditMenu;
