import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRequire } from 'node:module';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { NextProvider } from 'fumadocs-core/framework/next';
import { DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { DocsPathnameProvider } from '../src/components/docs-pathname-provider';
import { getPublicPathname } from '../src/lib/i18n';

// Match Next.js navigation's CommonJS context resolution after its server
// testing helpers install the shared-runtime require hook.
const { PathnameContext } = createRequire(import.meta.url)(
  'next/dist/shared/lib/hooks-client-context.shared-runtime',
) as typeof import('next/dist/shared/lib/hooks-client-context.shared-runtime');

describe('documentation hydration across default-locale rewrites', () => {
  test('only the complete default-locale segment is removed', () => {
    for (const [path, expected] of [
      ['/en', '/'], ['/en/', '/'], ['/en/docs', '/docs'],
      ['/en/docs/installation', '/docs/installation'],
      ['/docs/installation', '/docs/installation'],
      ['/zh-TW/docs/installation', '/zh-TW/docs/installation'],
      ['/english/docs', '/english/docs'], ['/enough', '/enough'],
      ['/docs/en/installation', '/docs/en/installation'],
      ['/en/docs/', '/docs/'],
    ]) assert.equal(getPublicPathname(path), expected);
  });

  for (const locale of ['en', 'zh-TW']) {
    test(`${locale}: actual Fumadocs navigation markup matches source and browser paths`, () => {
      const prefix = locale === 'en' ? '' : '/zh-TW';
      const tree = { name: 'Docs', children: [
        { type: 'page' as const, name: 'Overview', url: `${prefix}/docs` },
        { type: 'page' as const, name: 'Installation', url: `${prefix}/docs/installation` },
        { type: 'page' as const, name: 'Privacy', url: `${prefix}/docs/privacy` },
      ] };
      function render(pathname: string, Provider = DocsPathnameProvider) {
        return renderToStaticMarkup(
          <PathnameContext.Provider value={pathname}>
            <Provider>
              <DocsLayout tree={tree} nav={{ enabled: false }} searchToggle={{ enabled: false }} themeSwitch={{ enabled: false }}>
                <DocsPage toc={[{ title: 'Requirements', url: '#requirements', depth: 2 }]}>
                  <DocsTitle>Installation</DocsTitle>
                </DocsPage>
              </DocsLayout>
            </Provider>
          </PathnameContext.Provider>,
        );
      }
      const server = render(`/${locale}/docs/installation`);
      const client = render(`${prefix}/docs/installation`);
      if (locale === 'en') {
        const originalServer = render('/en/docs/installation', NextProvider);
        const originalClient = render('/docs/installation', NextProvider);
        assert.notEqual(originalServer, originalClient, 'fixture must reproduce the original mismatch');
        assert.match(originalServer, /truncate transition-\[opacity,translate,color\]">On this page/);
      }
      assert.equal(server, client);
      assert.match(server, /data-toc-popover-trigger/);
      assert.match(server, /truncate transition-\[opacity,translate,color\]">Installation/);
      assert.match(server, /data-active="true"[^>]*href="[^"]*\/docs\/installation"/);
      assert.match(server, /href="[^"]*\/docs\/privacy"[^>]*><div/);
    });
  }
});
