const { editorCommandSender } = require('./utils');
const { t } = require('../i18n');

const buildFormatMenu = (isAuthenticated, editMode) => {
  isAuthenticated = isAuthenticated || false;
  editMode = editMode || false;
  const submenu = [
    {
      label: t('menu.format.insertChecklist'),
      accelerator: 'CommandOrControl+Shift+C',
      click: editorCommandSender({ action: 'insertChecklist' }),
      enabled: editMode,
    },
  ];

  const formatMenu = {
    label: t('menu.format.title'),
    submenu,
  };

  // we have nothing to show in this menu if not logged in
  return isAuthenticated ? formatMenu : null;
};

module.exports = buildFormatMenu;
