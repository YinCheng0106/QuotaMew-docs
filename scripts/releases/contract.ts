import { validateReleaseMetadata, type ReleaseMetadata, type ReleaseChannel } from '../../src/lib/release-metadata';
import { parseTag } from '../../src/lib/semver';

export const repository = 'YinCheng0106/QuotaMew';
export const manifestFilename = 'quotamew-release-manifest.json';
export type ReleaseManifest = Pick<ReleaseMetadata, 'schemaVersion' | 'tag' | 'version' | 'build' | 'channel' | 'minimumMacOS' | 'bundleID' | 'signing'> & { artifact: { filename: string } };
export function requireFact(ok: unknown, field: string): asserts ok {
  if (!ok) throw new Error(`Release contract: ${field}`);
}
export function record(input: unknown): Record<string, unknown> {
  requireFact(input !== null && typeof input === 'object' && !Array.isArray(input), 'expected object');
  return input as Record<string, unknown>;
}
export interface GitHubFacts {
  tag: string; channel: ReleaseChannel; releaseURL: string; publishedAt: string;
  artifact: ReleaseMetadata['artifact']; manifestAsset?: Record<string, unknown>;
}

export function githubFacts(input: unknown, channel: ReleaseChannel, fallbackSHA?: string): GitHubFacts {
  const r = record(input);
  requireFact(r.draft === false, 'draft');
  requireFact(r.prerelease === (channel === 'preview'), 'prerelease/channel');
  requireFact(typeof r.tag_name === 'string', 'tag');
  const tag = r.tag_name;
  requireFact(Boolean(parseTag(tag).prerelease.length) === (channel === 'preview'), 'SemVer/channel');
  const base = `https://github.com/${repository}/releases`;
  requireFact(r.html_url === `${base}/tag/${tag}`, 'release repository/URL');
  requireFact(typeof r.published_at === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(r.published_at) && Number.isFinite(Date.parse(r.published_at)), 'publishedAt');
  requireFact(Array.isArray(r.assets), 'assets');
  const assets = r.assets.map(record);
  const dmgs = assets.filter(a => typeof a.name === 'string' && /\.dmg$/i.test(a.name));
  requireFact(dmgs.length === 1, 'expected exactly one DMG');
  const asset = dmgs[0], filename = `QuotaMew-${tag}.dmg`;
  requireFact(asset.name === filename, 'DMG filename/tag');
  requireFact(asset.browser_download_url === `${base}/download/${tag}/${filename}`, 'DMG URL');
  requireFact(Number.isSafeInteger(asset.size) && (asset.size as number) > 0, 'DMG size');
  let sha256 = fallbackSHA;
  if (asset.digest !== undefined && asset.digest !== null) {
    requireFact(typeof asset.digest === 'string' && /^sha256:[a-fA-F0-9]{64}$/.test(asset.digest), 'GitHub SHA256 digest');
    sha256 = asset.digest.slice(7).toLowerCase();
  }
  requireFact(sha256, 'GitHub SHA256 digest required for future releases');
  const manifests = assets.filter(a => a.name === manifestFilename);
  requireFact(manifests.length <= 1, 'duplicate manifest');
  if (manifests[0]) {
    requireFact(manifests[0].browser_download_url === `${base}/download/${tag}/${manifestFilename}`, 'manifest URL');
    requireFact(Number.isSafeInteger(manifests[0].size) && (manifests[0].size as number) > 0 && (manifests[0].size as number) <= 65536, 'manifest size');
  }
  return { tag, channel, releaseURL: r.html_url as string, publishedAt: r.published_at,
    artifact: { filename, downloadURL: asset.browser_download_url as string, sizeBytes: asset.size as number, sha256 }, manifestAsset: manifests[0] };
}

export function mergeManifest(input: unknown, facts: GitHubFacts): ReleaseMetadata {
  const m = record(input), artifact = record(m.artifact), signing = record(m.signing);
  const keys = ['schemaVersion', 'tag', 'version', 'build', 'channel', 'minimumMacOS', 'bundleID', 'artifact', 'signing'];
  requireFact(Object.keys(m).length === keys.length && Object.keys(m).every(k => keys.includes(k)), 'manifest fields');
  requireFact(Object.keys(artifact).length === 1 && artifact.filename === facts.artifact.filename, 'manifest artifact');
  requireFact(Object.keys(signing).length === 4 && Object.keys(signing).every(k => ['type', 'codesignVerified', 'notarized', 'stapled'].includes(k)), 'manifest signing fields');
  requireFact(m.schemaVersion === 1, 'manifest schemaVersion (supported: 1)');
  requireFact(m.tag === facts.tag && m.version === facts.tag.slice(1), 'manifest tag/version');
  requireFact(m.channel === facts.channel, 'manifest channel');
  return validateReleaseMetadata({ ...m, releaseURL: facts.releaseURL, publishedAt: facts.publishedAt, artifact: facts.artifact }, facts.channel);
}
