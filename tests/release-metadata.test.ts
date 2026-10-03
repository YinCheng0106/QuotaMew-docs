import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import snapshot from '../src/data/releases/stable.json';
import bootstrap from './fixtures/bootstrap-stable.json';
import historicalRC1 from './fixtures/historical-rc1.json';
import { validateReleaseMetadata } from '../src/lib/release-metadata';
import { getStableRelease } from '../src/lib/release';
import { formatArtifactSize, getReleasePresentation, getStableReleasePresentation } from '../src/lib/release-presentation';
import { getHomeContent } from '../src/lib/home-content';
import { getDownloadContent } from '../src/lib/download-content';

describe('verified Stable snapshot', () => {
  test('loads the verified v0.2.0 facts', () => {
    const stable = validateReleaseMetadata(bootstrap, 'stable');
    assert.equal(stable.tag, 'v0.2.0');
    assert.equal(stable.version, '0.2.0');
    assert.equal(stable.build, 5);
    assert.equal(stable.channel, 'stable');
    assert.equal(stable.minimumMacOS, '14');
    assert.equal(stable.bundleID, 'dev.quotapulse.app');
    assert.equal(stable.artifact.filename, 'QuotaMew-v0.2.0.dmg');
    assert.equal(stable.artifact.sizeBytes, 2663814);
    assert.equal(stable.artifact.sha256, '6e4e11d5fb033943a38ed418415d2886771d9138a38efdddf808c29de8e66230');
    assert.deepEqual(stable.signing, {
      type: 'apple-development', codesignVerified: true, notarized: false, stapled: false,
    });
    assert.ok(Object.isFrozen(stable));
    assert.ok(Object.isFrozen(stable.artifact));
    assert.ok(Object.isFrozen(stable.signing));
  });

  const invalidCases: [string, (data: typeof snapshot) => void][] = [
    ['unsupported schema', data => { data.schemaVersion = 2; }],
    ['malformed schema', data => { Reflect.set(data, 'schemaVersion', '1'); }],
    ['unknown channel', data => { data.channel = 'rc'; }],
    ['preview in Stable slot', data => { data.channel = 'preview'; }],
    ['prerelease marked Stable', data => { data.version = '0.2.0-rc.1'; data.tag = 'v0.2.0-rc.1'; }],
    ['empty tag', data => { data.tag = ''; }],
    ['tag/version mismatch', data => { data.tag = 'v0.2.1'; }],
    ['negative build', data => { data.build = -1; }],
    ['fractional build', data => { data.build = 1.5; }],
    ['HTTP release URL', data => { data.releaseURL = data.releaseURL.replace('https:', 'http:'); }],
    ['non-GitHub release URL', data => { data.releaseURL = data.releaseURL.replace('github.com', 'example.com'); }],
    ['wrong release tag URL', data => { data.releaseURL += '-rc.1'; }],
    ['HTTP download URL', data => { data.artifact.downloadURL = data.artifact.downloadURL.replace('https:', 'http:'); }],
    ['wrong repository download URL', data => { data.artifact.downloadURL = data.artifact.downloadURL.replace('QuotaMew/releases', 'Other/releases'); }],
    ['URL credentials', data => { data.releaseURL = data.releaseURL.replace('https://', 'https://user:secret@'); }],
    ['invalid checksum', data => { data.artifact.sha256 = 'z'.repeat(64); }],
    ['short checksum', data => { data.artifact.sha256 = 'a'.repeat(63); }],
    ['non-DMG artifact', data => { data.artifact.filename = 'QuotaMew-v0.2.0.zip'; }],
    ['wrong artifact tag', data => { data.artifact.filename = 'QuotaMew-v0.2.1.dmg'; }],
    ['zero size', data => { data.artifact.sizeBytes = 0; }],
    ['negative size', data => { data.artifact.sizeBytes = -1; }],
    ['fractional size', data => { data.artifact.sizeBytes = 1.5; }],
    ['missing field', data => { Reflect.deleteProperty(data, 'build'); }],
    ['missing nested field', data => { Reflect.deleteProperty(data.artifact, 'sha256'); }],
    ['unexpected bundle ID', data => { data.bundleID = 'dev.other.app'; }],
    ['missing signing', data => { Reflect.deleteProperty(data, 'signing'); }],
    ['unsupported signing', data => { data.signing.type = 'ad-hoc'; }],
    ['non-boolean notarized', data => { Reflect.set(data.signing, 'notarized', 'false'); }],
    ['stapled without notarization', data => { data.signing.stapled = true; data.signing.notarized = false; }],
    ['invalid minimum macOS', data => { data.minimumMacOS = ''; }],
    ['invalid optional date', data => { Reflect.set(data, 'publishedAt', 'unknown'); }],
  ];
  for (const [name, mutate] of invalidCases) {
    test(`rejects ${name}`, () => {
      const input = structuredClone(snapshot);
      mutate(input);
      assert.throws(() => validateReleaseMetadata(input, 'stable'), /Invalid release metadata:/);
    });
  }

  test('rejects non-object metadata', () => {
    for (const input of [null, [], 'stable', undefined]) {
      assert.throws(() => validateReleaseMetadata(input, 'stable'));
    }
  });

  test('supports the domain preview seam without a published preview snapshot', () => {
    const input = structuredClone(snapshot);
    input.channel = 'preview';
    input.version = '0.2.0-rc.1';
    input.tag = `v${input.version}`;
    input.releaseURL = `https://github.com/YinCheng0106/QuotaMew/releases/tag/${input.tag}`;
    input.artifact.filename = `QuotaMew-${input.tag}.dmg`;
    input.artifact.downloadURL = `https://github.com/YinCheng0106/QuotaMew/releases/download/${input.tag}/${input.artifact.filename}`;
    assert.equal(validateReleaseMetadata(input, 'preview').channel, 'preview');
    assert.throws(() => validateReleaseMetadata(input, 'stable'));
    assert.throws(() => validateReleaseMetadata(snapshot, 'preview'));
  });
});

describe('presentation', () => {
  for (const locale of ['en', 'zh-TW']) {
    test(`${locale} derives current release facts and bilingual copy`, () => {
      const release = getStableReleasePresentation(locale);
      assert.equal(release.versionLabel, snapshot.tag);
      assert.equal(release.channelLabel, locale === 'en' ? 'Stable' : '穩定版');
      assert.equal(release.downloadURL, snapshot.artifact.downloadURL);
      assert.equal(release.releaseURL, snapshot.releaseURL);
      assert.equal(release.sha256, snapshot.artifact.sha256);
      assert.equal(release.sha256.length, 64);
      assert.equal(release.size, formatArtifactSize(snapshot.artifact.sizeBytes));
      assert.ok(release.sizeExact.includes(snapshot.artifact.sizeBytes.toLocaleString('en-US')));
      const bootstrapCopy = getReleasePresentation(validateReleaseMetadata(bootstrap, 'stable'), locale);
      assert.ok(bootstrapCopy.distributionSummary.includes('Apple Development'));
      assert.ok(bootstrapCopy.distributionSummary.includes('codesign'));
      assert.ok(bootstrapCopy.distributionSummary.includes(locale === 'en' ? 'not notarized' : '未公證'));
      assert.ok(bootstrapCopy.distributionSummary.includes(locale === 'en' ? 'no stapled ticket' : '無 stapled ticket'));
      assert.equal(getHomeContent(locale).hero.release, release.headline);
      assert.ok(getDownloadContent(locale).description.includes(release.headline));
      assert.equal(getDownloadContent(locale).requirements.macOS, release.requirements);
    });
  }

  test('size formatting is derived from bytes and responds to metadata changes', () => {
    assert.equal(formatArtifactSize(1_000_000), '1.0 MB');
    assert.equal(formatArtifactSize(9_900_000), '9.9 MB');
    for (const input of [0, -1, 1.5, Infinity, NaN]) assert.throws(() => formatArtifactSize(input));
    const modified = validateReleaseMetadata({ ...snapshot, artifact: { ...snapshot.artifact, sizeBytes: 3_000_000 } }, 'stable');
    assert.equal(getReleasePresentation(modified, 'en').size, '3.0 MB');
  });

  test('snapshot access and presentation need no network', () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (() => { throw new Error('Network access is forbidden'); }) as typeof fetch;
    try {
      assert.equal(getStableRelease().tag, snapshot.tag);
      getHomeContent('en');
      getDownloadContent('zh-TW');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

describe('historical and public-source safeguards', () => {
  test('historical RC.1 config remains unchanged and cannot be consumed as Stable', () => {
    // Captured from src/lib/release.ts at docs HEAD e0489d8; never imported by pages.
    const before = JSON.stringify(historicalRC1);
    getStableRelease();
    getStableReleasePresentation('en');
    assert.throws(() => validateReleaseMetadata(historicalRC1, 'stable'));
    assert.equal(JSON.stringify(historicalRC1), before);
    assert.equal(historicalRC1.version, 'v0.2.0-rc.1');
    assert.ok(historicalRC1.downloadUrl.endsWith('/QuotaMew-v0.2.0-rc.1.dmg'));
    assert.equal(historicalRC1.sha256, 'abd91c8c845dc0b6b75f054927602e555d1b2d9b2ba4b3010a44afe8ac85f7c7');
  });

  test('live presentation has no embedded current release literal or unreleased feature copy', () => {
    function files(dir: string): string[] {
      return readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
        entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]);
    }
    const publicFiles = [...files('src'), ...files('content')]
      .filter(path => /\.(tsx?|mdx)$/.test(path) && !path.startsWith('src/data/releases/'));
    for (const path of publicFiles) {
      const source = readFileSync(path, 'utf8');
      assert.doesNotMatch(source, /v0\.2\.0|RC\.1|Release Candidate|Codex Account Activity|Latest \/ 7D \/ 30D|provider-reported token activity|v0\.3/i, path);
    }
    assert.deepEqual(readdirSync('src/data/releases').sort(), ['preview.ts', 'stable.json']);
  });
});
