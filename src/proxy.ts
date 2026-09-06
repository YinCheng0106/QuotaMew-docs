import { NextRequest, NextResponse } from 'next/server';
import type { NextFetchEvent } from 'next/server';
import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import {
  isMarkdownPreferred,
  rewritePath,
} from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute } from '@/lib/shared';
import { i18n } from '@/lib/i18n';

const handleI18n = createI18nMiddleware(i18n);

const localizedRewrites = i18n.languages.map((locale) => {
  const publicPrefix =
    locale === i18n.defaultLanguage ? '' : `/${locale}`;

  const internalPrefix = `/${locale}`;

  const { rewrite: rewriteDocs } = rewritePath(
    `${publicPrefix}${docsRoute}{/*path}`,
    `${internalPrefix}${docsContentRoute}{/*path}/content.md`,
  );

  const { rewrite: rewriteSuffix } = rewritePath(
    `${publicPrefix}${docsRoute}{/*path}.md`,
    `${internalPrefix}${docsContentRoute}{/*path}/content.md`,
  );

  return {
    rewriteDocs,
    rewriteSuffix,
  };
});

export default function proxy(
  request: NextRequest,
  event: NextFetchEvent,
) {
  const pathname = request.nextUrl.pathname;

  // These routes are currently global rather than locale-specific.
  if (
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  // Handle explicit Markdown URLs:
  // /docs/example.md
  // /zh-TW/docs/example.md
  for (const { rewriteSuffix } of localizedRewrites) {
    const result = rewriteSuffix(pathname);

    if (result) {
      return NextResponse.rewrite(
        new URL(result, request.nextUrl),
      );
    }
  }

  // Handle content negotiation for Markdown clients.
  if (isMarkdownPreferred(request)) {
    for (const { rewriteDocs } of localizedRewrites) {
      const result = rewriteDocs(pathname);

      if (result) {
        return NextResponse.rewrite(
          new URL(result, request.nextUrl),
          {
            headers: {
              Vary: 'Accept',
            },
          },
        );
      }
    }
  }

  // Normal HTML navigation uses Fumadocs i18n routing.
  return handleI18n(request, event);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.png|icon.png|apple-icon.png|branding/).*)',
  ],
};
