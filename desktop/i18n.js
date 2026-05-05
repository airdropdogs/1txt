'use strict';

const { app } = require('electron');
const path = require('path');

// Load all locale bundles at startup.
const bundles = {
  en: require(path.join(__dirname, 'i18n', 'locales', 'en.json')),
  'zh-CN': require(path.join(__dirname, 'i18n', 'locales', 'zh-CN.json')),
};

let currentLocale = 'en';

function resolveLocale(locale) {
  if (locale === 'system') {
    const raw = app ? app.getLocale() : 'en';
    if (bundles[raw]) return raw;
    const prefix = raw.split('-')[0];
    if (bundles[prefix]) return prefix;
    return 'en';
  }
  if (bundles[locale]) return locale;
  return 'en';
}

function setLocale(locale) {
  currentLocale = resolveLocale(locale);
}

function t(key) {
  return bundles[currentLocale]?.[key] || bundles['en']?.[key] || key;
}

module.exports = { setLocale, t };
