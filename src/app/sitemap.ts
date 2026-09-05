import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { i18n } from '@/lib/i18n';
import { absoluteUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set<string>();

  for (const lang of i18n.languages) {
    const prefix = lang === i18n.defaultLanguage ? '' : '/' + lang;
    paths.add(prefix || '/');
    paths.add(prefix + '/download');

    for (const page of source.getPages(lang)) {
      paths.add(page.url);
    }
  }

  return [...paths].map((path) => ({
    url: absoluteUrl(path),
  }));
}
