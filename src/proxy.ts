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

function preserveRequestOrigin(request: NextRequest, response: NextResponse) {
  // NextURL normalizes loopback IPs to localhost. Keep internal routing on
  // the original origin so Next.js does not proxy it as an external request.
  const origin = new URL(request.url).origin;

  for (const header of ['x-middleware-rewrite', 'location']) {
    const destination = response.headers.get(header);
    if (!destination) continue;
    const url = new URL(destination);
    response.headers.set(header, `${origin}${url.pathname}${url.search}${url.hash}`);
  }

  return response;
}

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

export default async function proxy(
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
        new URL(result, request.url),
      );
    }
  }

  // Handle content negotiation for Markdown clients.
  if (isMarkdownPreferred(request)) {
    for (const { rewriteDocs } of localizedRewrites) {
      const result = rewriteDocs(pathname);

      if (result) {
        return NextResponse.rewrite(
          new URL(result, request.url),
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
  const response = await handleI18n(request, event);
  return response instanceof NextResponse
    ? preserveRequestOrigin(request, response)
    : response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.png|icon.png|apple-icon.png|branding/|images/screenshot).*)',
  ],
};
