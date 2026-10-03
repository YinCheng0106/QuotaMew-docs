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

// Static English pages render under /en, while the proxy exposes them without
// that prefix. Fumadocs must compare page URLs against the same public path
// during SSR and hydration. Keep other locales and segment boundaries intact.
export function getPublicPathname(pathname: string) {
  const prefix = `/${i18n.defaultLanguage}`;
  if (pathname === prefix || pathname === `${prefix}/`) return '/';
  return pathname.startsWith(`${prefix}/`)
    ? pathname.slice(prefix.length)
    : pathname;
}

export function localizePath(locale: string, path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const prefix = getLocalePrefix(locale);

  if (normalizedPath === '/') {
    return prefix || '/';
  }

  return `${prefix}${normalizedPath}`;
}
