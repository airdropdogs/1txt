import en from './locales/en.json';
import zhCN from './locales/zh-CN.json';

const bundles: Record<string, Record<string, string>> = {
  en: en as Record<string, string>,
  'zh-CN': zhCN as Record<string, string>,
};

export const SUPPORTED_LOCALES = [
  { value: 'system', labelKey: 'settings.display.languageSystem' },
  { value: 'en', labelKey: 'settings.display.languageEn' },
  { value: 'zh-CN', labelKey: 'settings.display.languageZhCN' },
];

function getSystemLocale(): string {
  const raw = typeof navigator !== 'undefined' ? navigator.language : 'en';

  if (bundles[raw]) return raw;
  const prefix = raw.split('-')[0];
  if (bundles[prefix]) return prefix;
  return 'en';
}

let currentLocale = 'en';

export function setLocale(locale: string) {
  currentLocale = locale === 'system' ? getSystemLocale() : locale;
  if (!bundles[currentLocale]) currentLocale = 'en';
}

export function getLocale(): string {
  return currentLocale;
}

export function t(key: string): string {
  return bundles[currentLocale]?.[key] || bundles['en']?.[key] || key;
}
