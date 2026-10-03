import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm, rename } from 'node:fs/promises';
import { readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import snapshot from '../src/data/releases/stable.json';
import bootstrap from './fixtures/bootstrap-stable.json';
import { previewSnapshot } from '../src/data/releases/preview';
import { validateReleaseMetadata } from '../src/lib/release-metadata';
import { getStableRelease, getPreviewRelease } from '../src/lib/release';
import { parseTag, compareTags } from '../src/lib/semver';
import { githubFacts, mergeManifest } from '../scripts/releases/contract';
import { GitHubClient } from '../scripts/releases/github';
import { atomicUpdates, resolve, serialize, serializePreview, synchronize } from '../scripts/releases/sync';
import { release, manifest, source } from './fixtures/release-source';

const stable = validateReleaseMetadata(bootstrap, 'stable');
describe('SemVer', () => {
  test('orders core versions, numeric and textual prereleases', () => {
    const tags = ['v0.2.0', 'v0.3.0-alpha.1', 'v0.3.0-beta.1', 'v0.3.0-beta.2', 'v0.3.0-beta.10', 'v0.3.0-rc.1', 'v0.3.0'];
    for (let i = 1; i < tags.length; i++) assert.ok(compareTags(tags[i - 1], tags[i]) < 0);
    assert.equal(compareTags('v0.3.0', 'v0.3.0'), 0);
    assert.ok(compareTags('v0.3.0-1', 'v0.3.0-alpha') < 0);
    assert.ok(compareTags('v0.3.0-beta', 'v0.3.0-beta.1') < 0);
    assert.ok(compareTags('v999999999999999999.0.0', 'v999999999999999998.0.0') > 0);
  });
  for (const tag of ['0.3.0', 'v01.2.0', 'v0.3', 'v0.3.0-beta.01', 'v0.3.0-', 'v0.3.0+build', 'v0.3.0 beta', 'v0.3.0-beta..1']) {
    test(`rejects ${tag}`, () => assert.throws(() => parseTag(tag)));
  }
});

describe('channel resolution fixtures', () => {
  for (const [tags, expected] of [
    [[], null],
    [['v0.3.0-beta.1'], 'v0.3.0-beta.1'],
    [['v0.3.0-beta.2', 'v0.3.0-beta.1'], 'v0.3.0-beta.2'],
    [['v0.3.0-beta.2', 'v0.3.0-rc.1'], 'v0.3.0-rc.1'],
    [['v0.2.0-rc.2'], null],
  ] as [string[], string | null][]) {
    test(`selects ${expected ?? 'none'} from ${tags}`, async () => {
      const result = await resolve(source(tags.map(tag => release(tag))), stable, null);
      assert.equal(result.preview?.tag ?? null, expected);
      assert.equal(serialize(result.stable), serialize(stable));
    });
  }
  test('ignores newer drafts', async () => {
    assert.equal((await resolve(source([release('v0.4.0-beta.1', true)]), stable, null)).preview, null);
  });
  test('future Stable merges manifest facts with GitHub publication facts', async () => {
    const result = await resolve(source([], release('v0.3.0')), stable, null);
    assert.equal(result.stable.tag, 'v0.3.0');
    assert.equal(result.stable.publishedAt, '2026-10-01T00:00:00Z');
    assert.equal(result.stable.build, 6);
  });
  test('bootstrap omits date and does not request a manifest', async () => {
    const s = source([]); s.manifest = async () => { throw new Error('must not download'); };
    assert.equal(serialize((await resolve(s, stable, null)).stable), serialize(stable));
  });
  test('bootstrap rejects changed GitHub facts', async () => {
    const r = release('v0.2.0'); r.assets[0].size++;
    await assert.rejects(resolve(source([], r), stable, null), /bootstrap/);
  });
  test('missing future Stable manifest fails', async () => {
    const r = release('v0.3.0'); r.assets.pop();
    await assert.rejects(resolve(source([], r), stable, null), /Stable manifest missing/);
  });
  test('Stable downgrade refused', async () => {
    await assert.rejects(resolve(source([], release('v0.1.0')), stable, null), /downgrade/);
  });
  for (const [name, mutate, pattern] of [
    ['missing manifest', (r: ReturnType<typeof release>) => r.assets.pop(), /manifest missing/],
    ['missing DMG', (r: ReturnType<typeof release>) => r.assets.shift(), /exactly one DMG/],
    ['duplicate DMGs', (r: ReturnType<typeof release>) => r.assets.push({ ...r.assets[0] }), /exactly one DMG/],
    ['malformed SemVer', (r: ReturnType<typeof release>) => { r.tag_name = 'v0.3.0-beta.01'; }, /SemVer/],
    ['invalid digest', (r: ReturnType<typeof release>) => { r.assets[0].digest = 'sha256:bad'; }, /SHA256/],
  ] as const) {
    test(`rejects Preview ${name} and retains previous snapshot`, async () => {
      const r = release('v0.4.0-beta.1'); mutate(r);
      const previous = mergeManifest(manifest('v0.3.0-beta.1'), githubFacts(release('v0.3.0-beta.1'), 'preview'));
      const result = await resolve(source([r]), stable, previous);
      assert.equal(result.preview, previous);
      assert.match(result.diagnostics.join('\n'), pattern);
    });
  }
  test('withdrawn Preview persists when list is empty', async () => {
    const previous = mergeManifest(manifest('v0.3.0-beta.1'), githubFacts(release('v0.3.0-beta.1'), 'preview'));
    assert.equal((await resolve(source([]), stable, previous)).preview, previous);
  });
});

describe('contract failures', () => {
  const tag = 'v0.3.0-beta.1';
  for (const [name, mutate, pattern] of [
    ['schema', (m: ReturnType<typeof manifest>) => { m.schemaVersion = 2; }, /schemaVersion/],
    ['tag', (m: ReturnType<typeof manifest>) => { m.tag = 'v0.3.0-beta.2'; }, /tag\/version/],
    ['channel', (m: ReturnType<typeof manifest>) => { m.channel = 'stable'; }, /channel/],
    ['artifact', (m: ReturnType<typeof manifest>) => { m.artifact.filename = 'other.dmg'; }, /artifact/],
    ['build', (m: ReturnType<typeof manifest>) => { m.build = -1; }, /build/],
    ['signing', (m: ReturnType<typeof manifest>) => { m.signing.stapled = true; }, /stapled/],
    ['unknown field', (m: ReturnType<typeof manifest>) => { Reflect.set(m, 'marketing', 'copy'); }, /fields/],
  ] as const) {
    test(`manifest ${name}`, () => {
      const m = manifest(tag); mutate(m);
      assert.throws(() => mergeManifest(m, githubFacts(release(tag), 'preview')), pattern);
    });
  }
  for (const [name, mutate, pattern] of [
    ['draft', (r: ReturnType<typeof release>) => { r.draft = true; }, /draft/],
    ['flag', (r: ReturnType<typeof release>) => { r.prerelease = false; }, /channel/],
    ['repository', (r: ReturnType<typeof release>) => { r.html_url = 'https://github.com/other/repo'; }, /repository/],
    ['asset URL', (r: ReturnType<typeof release>) => { r.assets[0].browser_download_url = 'http://github.com/bad'; }, /URL/],
    ['filename', (r: ReturnType<typeof release>) => { r.assets[0].name = 'other.dmg'; }, /filename/],
    ['size', (r: ReturnType<typeof release>) => { r.assets[0].size = 0; }, /size/],
    ['digest missing', (r: ReturnType<typeof release>) => { r.assets[0].digest = null; }, /digest required/],
    ['duplicate manifest', (r: ReturnType<typeof release>) => { r.assets.push({ ...r.assets[1] }); }, /duplicate manifest/],
  ] as const) {
    test(`GitHub ${name}`, () => { const r = release(tag); mutate(r); assert.throws(() => githubFacts(r, 'preview'), pattern); });
  }
});

describe('GitHub client pagination and bounds', () => {
  test('finds valid Preview on later page and downloads by asset ID', async () => {
    const calls: string[] = [];
    const client = new GitHubClient('test-token', (async (input, init) => {
      const url = String(input); calls.push(url);
      assert.equal((init?.headers as Record<string, string>).Authorization, 'Bearer test-token');
      const data = url.endsWith('latest') ? release('v0.2.0') : url.includes('assets/2') ? manifest('v0.3.0-beta.1') : url.endsWith('page=1') ? Array.from({ length: 100 }, () => release('v0.2.0-rc.2')) : [release('v0.3.0-beta.1')];
      return Response.json(data);
    }) as typeof fetch, () => {});
    assert.equal((await resolve(client, stable, null)).preview?.tag, 'v0.3.0-beta.1');
    assert.equal(calls.length, 4);
    assert.ok(calls.some(url => url.endsWith('page=2')));
  });
  test('HTTP failures are sanitized', async () => {
    const client = new GitHubClient(undefined, (async () => new Response('secret body', { status: 403 })) as typeof fetch, () => {});
    await assert.rejects(client.latest(), /^Error: Release contract: GitHub HTTP 403$/);
  });
  test('bounds manifest payload', async () => {
    const client = new GitHubClient(undefined, (async () => new Response('x'.repeat(65537))) as typeof fetch, () => {});
    await assert.rejects(client.manifest({ id: 2 }), /too large/);
  });
  test('rejects malformed API JSON', async () => {
    const client = new GitHubClient(undefined, (async () => new Response('{')) as typeof fetch, () => {});
    await assert.rejects(client.latest(), /invalid JSON/);
  });
  test('verifies downloaded manifest digest when supplied', async () => {
    const client = new GitHubClient(undefined, (async () => Response.json(manifest('v0.3.0-beta.1'))) as typeof fetch, () => {});
    await assert.rejects(client.manifest({ id: 2, digest: `sha256:${'a'.repeat(64)}` }), /download digest mismatch/);
    assert.throws(() => client.manifest({ id: 2, digest: 'invalid' }), /manifest SHA256 digest/);
  });
});

describe('snapshot transactions and CLI', () => {
  test('dry run, atomic replacement, idempotency, failure retention', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'quotamew-sync-'));
    try {
      await writeFile(join(directory, 'stable.json'), serialize(stable));
      await writeFile(join(directory, 'preview.ts'), serializePreview(null));
      const s = source([release('v0.3.0-beta.1')]);
      assert.equal((await synchronize(s, directory, null, true)).changed, true);
      assert.equal(await readFile(join(directory, 'preview.ts'), 'utf8'), serializePreview(null));
      const result = await synchronize(s, directory, null, false);
      assert.equal(await readFile(join(directory, 'preview.ts'), 'utf8'), serializePreview(result.preview));
      assert.equal((await synchronize(s, directory, result.preview, false)).changed, false);
      const before = await readFile(join(directory, 'preview.ts'), 'utf8');
      const broken = source([]); broken.list = async () => { throw new Error('offline'); };
      await assert.rejects(synchronize(broken, directory, result.preview, false), /offline/);
      assert.equal(await readFile(join(directory, 'stable.json'), 'utf8'), serialize(stable));
      assert.equal(await readFile(join(directory, 'preview.ts'), 'utf8'), before);
      assert.deepEqual(readdirSync(directory).sort(), ['preview.ts', 'stable.json']);
    } finally { await rm(directory, { recursive: true }); }
  });
  test('fixture CLI dry-run never writes', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'quotamew-cli-'));
    try {
      const fixture = join(directory, 'source.json');
      const latest = release(snapshot.tag);
      latest.published_at = Reflect.get(snapshot, 'publishedAt') ?? latest.published_at;
      latest.assets[0].size = snapshot.artifact.sizeBytes;
      latest.assets[0].digest = `sha256:${snapshot.artifact.sha256}`;
      const { releaseURL: _url, artifact, ...fields } = snapshot;
      Reflect.deleteProperty(fields, 'publishedAt');
      await writeFile(fixture, JSON.stringify({ latest, releases: [release('v0.2.0-rc.2')], manifests: { 2: { ...fields, artifact: { filename: artifact.filename } } } }));
      const result = spawnSync(process.execPath, ['scripts/release-sync.ts', '--dry-run', '--fixture', fixture], { encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      assert.ok(result.stdout.includes(`Preview: ${previewSnapshot?.tag ?? 'none'} -> ${previewSnapshot?.tag ?? 'none'}`));
      assert.match(result.stdout, /Snapshots: unchanged/);
      const tag = `v${BigInt(parseTag(snapshot.tag).core[0]) + BigInt(parseTag(previewSnapshot?.tag ?? snapshot.tag).core[0]) + 1n}.0.0-beta.1`;
      // The manifest fixture for latest must also remain available if bootstrap
      // has been superseded; use a distinct asset ID for that release.
      latest.assets[1].id = 3;
      await writeFile(fixture, JSON.stringify({ latest, releases: [release(tag)], manifests: { 2: manifest(tag), 3: { ...fields, artifact: { filename: artifact.filename } } } }));
      const checked = spawnSync(process.execPath, ['scripts/release-sync.ts', '--check', '--fixture', fixture], { encoding: 'utf8' });
      assert.equal(checked.status, 1, checked.stderr);
      assert.match(checked.stdout, /Snapshots: would change/);
      assert.equal(readFileSync('src/data/releases/stable.json', 'utf8'), JSON.stringify(snapshot, null, 2) + '\n');
      assert.equal(readFileSync('src/data/releases/preview.ts', 'utf8'), serializePreview(previewSnapshot));
    } finally { await rm(directory, { recursive: true }); }
  });
});

test('a later rename failure restores every original file', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'quotamew-atomic-'));
  try {
    const a = join(directory, 'stable.json'), b = join(directory, 'preview.ts');
    await writeFile(a, 'original stable'); await writeFile(b, 'original preview');
    await assert.rejects(atomicUpdates([
      { path: a, before: 'original stable', after: 'candidate stable' },
      { path: b, before: 'original preview', after: 'candidate preview' },
    ], async (from, to) => { if (to === b) throw new Error('rename denied'); await rename(from, to); }), /rename denied/);
    assert.equal(await readFile(a, 'utf8'), 'original stable');
    assert.equal(await readFile(b, 'utf8'), 'original preview');
    assert.deepEqual(readdirSync(directory).sort(), ['preview.ts', 'stable.json']);
  } finally { await rm(directory, { recursive: true }); }
});

test('website release imports remain local with optional Preview', () => {
  const original = globalThis.fetch;
  globalThis.fetch = (() => { throw new Error('network forbidden'); }) as typeof fetch;
  try {
    assert.equal(getStableRelease().tag, snapshot.tag);
    const expected = previewSnapshot && compareTags(previewSnapshot.tag, snapshot.tag) > 0 ? previewSnapshot.tag : null;
    assert.equal(getPreviewRelease()?.tag ?? null, expected);
  }
  finally { globalThis.fetch = original; }
  function files(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(join(directory, e.name)) : [join(directory, e.name)]);
  }
  for (const file of files('src').filter(f => /\.(ts|tsx)$/.test(f))) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /scripts\/|api\.github\.com|octokit|GitHubClient/, file);
  }
});
