import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { PreviewRelease, StableDownloadLink } from '../src/components/release-actions';
import { SiteFooter } from '../src/components/site-footer';
import { getFooterContent } from '../src/lib/footer-content';
import { getHomeContent, homeContent } from '../src/lib/home-content';
import { downloadContent } from '../src/lib/download-content';
import { getStableRelease, getPreviewRelease } from '../src/lib/release';
import { validateReleaseMetadata } from '../src/lib/release-metadata';
import HomePage from '../src/app/[lang]/(home)/page';
import DownloadPage from '../src/app/[lang]/(home)/download/page';

const stable = getStableRelease();
function fixture(tag: string, channel: 'stable' | 'preview') {
  const root = 'https://github.com/YinCheng0106/QuotaMew/releases';
  return validateReleaseMetadata({
    ...stable, tag, version: tag.slice(1), channel,
    releaseURL: `${root}/tag/${tag}`,
    artifact: { ...stable.artifact, filename: `QuotaMew-${tag}.dmg`, downloadURL: `${root}/download/${tag}/QuotaMew-${tag}.dmg` },
  }, channel);
}
const preview = fixture('v9.1.0-beta.1', 'preview');

describe('public release presentation', () => {
  for (const locale of ['en', 'zh-TW']) {
    test(`${locale}: null Preview has no markup or empty spacing`, () => {
      assert.equal(renderToStaticMarkup(<PreviewRelease locale={locale} release={null} />), '');
      const current = getPreviewRelease();
      const html = renderToStaticMarkup(<PreviewRelease locale={locale} />);
      if (current === null) assert.equal(html, '');
      else assert.ok(html.includes(current.artifact.downloadURL));
    });

    test(`${locale}: fixture Preview stays secondary to unchanged Stable`, () => {
      const stableOnly = renderToStaticMarkup(<StableDownloadLink locale={locale} />);
      const html = renderToStaticMarkup(<><StableDownloadLink locale={locale} /><PreviewRelease locale={locale} release={preview} /></>);
      assert.ok(html.startsWith(stableOnly));
      assert.ok(html.indexOf('data-release-channel="stable"') < html.indexOf('data-release-channel="preview"'));
      assert.ok(html.includes(stable.artifact.downloadURL));
      assert.ok(html.includes(preview.artifact.downloadURL));
      assert.ok(html.includes(preview.releaseURL));
      assert.ok(html.includes(preview.tag));
      assert.match(html, locale === 'en' ? /optional prerelease/ : /預先發行版本/);
      assert.ok(!html.includes('Account Activity'));
      const before = JSON.stringify(getHomeContent(locale).monitoring);
      renderToStaticMarkup(<PreviewRelease locale={locale} release={preview} />);
      assert.equal(JSON.stringify(getHomeContent(locale).monitoring), before);
    });

    test(`${locale}: Stable CTA follows a changed metadata fixture`, () => {
      const next = fixture('v9.0.0', 'stable');
      const html = renderToStaticMarkup(<StableDownloadLink locale={locale} release={next} />);
      assert.ok(html.includes(next.tag));
      assert.ok(html.includes(next.artifact.downloadURL));
      assert.ok(!html.includes(stable.artifact.downloadURL));
      assert.match(html, locale === 'en' ? /Download Stable/ : /下載穩定版/);
    });

    test(`${locale}: actual home and Download follow local channel snapshots without network`, async () => {
      const original = globalThis.fetch;
      globalThis.fetch = (() => { throw new Error('Rendering must stay offline'); }) as typeof fetch;
      try {
        const props = { params: Promise.resolve({ lang: locale }), searchParams: Promise.resolve({}) };
        for (const page of [HomePage, DownloadPage]) {
          const html = renderToStaticMarkup(await page(props));
          assert.ok(html.includes('data-release-channel="stable"'));
          assert.ok(html.includes(stable.artifact.downloadURL));
          const current = getPreviewRelease();
          assert.equal(html.includes('data-release-channel="preview"'), current !== null);
          if (current) {
            assert.ok(html.includes(current.artifact.downloadURL));
            assert.ok(html.indexOf('data-release-channel="stable"') < html.indexOf('data-release-channel="preview"'));
          }
          assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
        }
      } finally { globalThis.fetch = original; }
    });

    test(`${locale}: footer has localized trust links and snapshot release data`, () => {
      const content = getFooterContent(locale);
      const prefix = locale === 'en' ? '' : '/zh-TW';
      assert.deepEqual(content.links.map(link => link.href), [
        `${prefix}/docs`, `${prefix}/download`, `${prefix}/docs/privacy`,
        'https://github.com/YinCheng0106/QuotaMew', 'https://github.com/YinCheng0106/QuotaMew/releases',
      ]);
      const html = renderToStaticMarkup(<SiteFooter locale={locale} />);
      assert.ok(html.includes('<footer'));
      assert.ok(html.includes('<nav aria-label='));
      assert.ok(html.includes(stable.tag));
      assert.ok(html.includes(stable.releaseURL));
      for (const link of content.links) assert.ok(html.includes(link.href));
    });
  }
});

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]);
}
function keys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, item]) => keys(item, `${prefix}.${key}`));
}

describe('curated content safeguards', () => {
  test('English and zh-TW have matching copy structures and documentation navigation', () => {
    assert.deepEqual(keys(homeContent.en), keys(homeContent['zh-TW']));
    assert.deepEqual(keys(downloadContent.en), keys(downloadContent['zh-TW']));
    const en = JSON.parse(readFileSync('content/docs/meta.json', 'utf8')).pages as string[];
    const zh = JSON.parse(readFileSync('content/docs/meta.zh-TW.json', 'utf8')).pages as string[];
    assert.deepEqual(en.filter(x => !x.startsWith('---')), zh.filter(x => !x.startsWith('---')));
    for (const page of en.filter(x => !x.startsWith('---'))) {
      const english = readFileSync(`content/docs/${page}.mdx`, 'utf8');
      const chinese = readFileSync(`content/docs/${page}.zh-TW.mdx`, 'utf8');
      assert.equal((english.match(/^## /gm) ?? []).length, (chinese.match(/^## /gm) ?? []).length, page);
      assert.deepEqual([...english.matchAll(/<Accordion[^>]*id="([^"]+)"/g)].map(x => x[1]),
        [...chinese.matchAll(/<Accordion[^>]*id="([^"]+)"/g)].map(x => x[1]), page);
    }
  });

  test('public presentation contains no stale release facts, unsafe bypass or unreleased feature copy', () => {
    const publicFiles = [...files('src'), ...files('content')]
      .filter(path => /\.(tsx?|mdx)$/.test(path) && !path.startsWith('src/data/releases/'));
    for (const path of publicFiles) {
      const source = readFileSync(path, 'utf8');
      assert.doesNotMatch(source, /Account Activity|7D|30D|token activity|token history|token trends|v0\.3|v0\.2\.0|RC\.1|xattr\s+-|spctl\s+--master-disable/i, path);
      assert.doesNotMatch(source, /github\.com\/[^\s'"]+\/releases\/(?:tag|download)\//, path);
      assert.doesNotMatch(source, /\b[a-f0-9]{64}\b/i, path);
    }
  });

  test('Claude remains explicitly experimental and unverified on the main public surfaces', () => {
    assert.equal(homeContent.en.providers.claude.status, 'Experimental / Unverified');
    assert.equal(homeContent['zh-TW'].providers.claude.status, '實驗性／未驗證');
    for (const page of ['providers', 'privacy', 'faq', 'troubleshooting', 'menu-bar', 'index']) {
      assert.match(readFileSync(`content/docs/${page}.mdx`, 'utf8'), /Experimental \/ Unverified/);
      assert.match(readFileSync(`content/docs/${page}.zh-TW.mdx`, 'utf8'), /實驗性／未驗證/);
    }
  });

  test('shared footer is included on both product and documentation pages', () => {
    for (const path of ['src/app/[lang]/(home)/layout.tsx', 'src/app/[lang]/docs/[[...slug]]/page.tsx']) {
      assert.match(readFileSync(path, 'utf8'), /<SiteFooter locale=/);
    }
  });
});
