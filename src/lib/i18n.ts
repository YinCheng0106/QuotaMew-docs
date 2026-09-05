import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'zh-TW'],
  hideLocale: 'default-locale',
  fallbackLanguage: 'en',
});

export function getLocalePrefix(locale?: string) {
  if (!locale || locale === i18n.defaultLanguage) {
    return '';
  }

  return `/${locale}`;
}

export function localizePath(locale: string, path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const prefix = getLocalePrefix(locale);

  if (normalizedPath === '/') {
    return prefix || '/';
  }

  return `${prefix}${normalizedPath}`;
}