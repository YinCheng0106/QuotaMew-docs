import { after, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import type { NextFetchEvent } from 'next/server';
import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import nextConfig from '../next.config.mjs';
import proxy, { config } from '../src/proxy';

// Next.js sets this from skipProxyUrlNormalize in the running server.
const originalNormalize = process.env.__NEXT_NO_MIDDLEWARE_URL_NORMALIZE;
process.env.__NEXT_NO_MIDDLEWARE_URL_NORMALIZE = '1';
after(() => {
  if (originalNormalize === undefined) delete process.env.__NEXT_NO_MIDDLEWARE_URL_NORMALIZE;
  else process.env.__NEXT_NO_MIDDLEWARE_URL_NORMALIZE = originalNormalize;
});
const event = {} as NextFetchEvent;

describe('locale routing keeps rewrites internal', () => {
  for (const origin of ['http://127.0.0.1:3107', 'http://localhost:3107', 'https://docs.example.com']) {
    for (const [path, finalPath, internalPath, redirects] of [
      ['/', '/', '/en/', 0],
      ['/en', '/', '/en/', 1],
      ['/en/', '/', '/en/', 1],
      ['/download', '/download', '/en/download', 0],
      ['/en/download', '/download', '/en/download', 1],
      ['/docs', '/docs', '/en/docs', 0],
      ['/en/docs', '/docs', '/en/docs', 1],
      ['/docs/installation', '/docs/installation', '/en/docs/installation', 0],
      ['/zh-TW', '/zh-TW', '/zh-TW', 0],
      ['/zh-TW/download', '/zh-TW/download', '/zh-TW/download', 0],
      ['/zh-TW/docs', '/zh-TW/docs', '/zh-TW/docs', 0],
      ['/zh-TW/docs/installation', '/zh-TW/docs/installation', '/zh-TW/docs/installation', 0],
    ] as const) {
      test(`${origin}${path} has a finite canonical chain`, async () => {
        let url = new URL(`${path}?source=smoke&value=a%2Fb`, origin);
        const visited = new Set<string>();
        let count = 0;
        for (;;) {
          assert.ok(!visited.has(url.href), 'redirect cycle');
          visited.add(url.href);
          assert.ok(count <= 2, 'too many redirects');
          const response = await proxy(new NextRequest(url), event);
          assert.ok(response);
          const location = response.headers.get('location');
          if (location) {
            assert.equal(response.status, 307);
            url = new URL(location, url);
            assert.equal(url.origin, origin);
            count++;
            continue;
          }
          assert.equal(url.pathname, finalPath);
          assert.equal(count, redirects);
          const target = new URL(response.headers.get('x-middleware-rewrite') ?? url.href);
          // An origin mismatch makes Next.js issue a new HTTP request to the
          // proxy and re-run locale canonicalization, which caused the loop.
          assert.equal(target.origin, origin);
          assert.equal(target.pathname, internalPath);
          assert.equal(target.search, '?source=smoke&value=a%2Fb');
          assert.doesNotMatch(target.pathname, /\/en\/en(?:\/|$)/);
          break;
        }
      });
    }
  }

  test('Next.js does not normalize the original proxy URL again', () => {
    assert.equal(nextConfig.skipProxyUrlNormalize, true);
    assert.notEqual(nextConfig.skipTrailingSlashRedirect, true);
  });

  test('cookies and language headers do not change the default-locale policy', async () => {
    const response = await proxy(new NextRequest('http://127.0.0.1:3107/', {
      headers: { 'Accept-Language': 'zh-TW', Cookie: 'FD_LOCALE=zh-TW' },
    }), event);
    assert.ok(response);
    assert.equal(response.headers.get('location'), null);
    assert.equal(response.headers.get('x-middleware-rewrite'), 'http://127.0.0.1:3107/en/');
  });

  for (const [path, accept, target] of [
    ['/docs/installation.md', 'text/html', '/en/llms.mdx/docs/installation/content.md'],
    ['/zh-TW/docs/installation.md', 'text/html', '/zh-TW/llms.mdx/docs/installation/content.md'],
    ['/docs/installation', 'text/markdown', '/en/llms.mdx/docs/installation/content.md'],
    ['/zh-TW/docs/installation', 'text/markdown', '/zh-TW/llms.mdx/docs/installation/content.md'],
  ]) {
    test(`Markdown rewrite stays internal: ${path} (${accept})`, async () => {
      const response = await proxy(new NextRequest(`http://127.0.0.1:3107${path}`, {
        headers: { Accept: accept },
      }), event);
      assert.ok(response);
      assert.equal(response.headers.get('location'), null);
      assert.equal(response.headers.get('x-middleware-rewrite'), `http://127.0.0.1:3107${target}`);
    });
  }

  for (const path of ['/llms.txt', '/llms-full.txt', '/sitemap.xml', '/robots.txt']) {
    test(`global route bypasses locale routing: ${path}`, async () => {
      const response = await proxy(new NextRequest(`http://127.0.0.1:3107${path}`), event);
      assert.ok(response);
      assert.equal(response.headers.get('x-middleware-rewrite'), null);
      assert.equal(response.headers.get('location'), null);
    });
  }

  for (const path of ['/api/search', '/_next/static/chunk.js', '/_next/image', '/icon.png', '/apple-icon.png', '/favicon.ico', '/branding/quotamew-icon.png', '/images/screenshots/quotamew-dashboard.png']) {
    test(`assets and internal endpoints bypass proxy: ${path}`, () => {
      assert.equal(unstable_doesMiddlewareMatch({ config, nextConfig, url: path }), false);
    });
  }

  test('unsupported locale remains an unknown English path', async () => {
    const response = await proxy(new NextRequest('http://127.0.0.1:3107/fr/docs'), event);
    assert.ok(response);
    assert.equal(response.headers.get('location'), null);
    assert.equal(response.headers.get('x-middleware-rewrite'), 'http://127.0.0.1:3107/en/fr/docs');
  });
});
