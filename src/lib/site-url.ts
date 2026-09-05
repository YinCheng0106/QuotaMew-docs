function getSiteOrigin() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return 'http://localhost:3000';
}

export const siteOrigin = getSiteOrigin();

export function absoluteUrl(pathname: string) {
  return new URL(pathname, siteOrigin + '/').toString();
}

export function localizedAlternates(pathname: string) {
  const normalizedPath = pathname.startsWith('/')
    ? pathname
    : '/' + pathname;
  const englishPath = normalizedPath.replace(
    /^\/zh-TW(?=\/|$)/,
    '',
  ) || '/';

  return {
    en: absoluteUrl(englishPath),
    'zh-TW': absoluteUrl(
      englishPath === '/'
        ? '/zh-TW'
        : '/zh-TW' + englishPath,
    ),
    'x-default': absoluteUrl(englishPath),
  };
}
