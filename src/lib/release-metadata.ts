import { parseTag } from './semver';

export type ReleaseChannel = 'stable' | 'preview';
export type SigningType = 'unsigned' | 'apple-development' | 'developer-id';

export interface ReleaseMetadata {
  readonly schemaVersion: 1;
  readonly tag: string;
  readonly version: string;
  readonly build: number;
  readonly channel: ReleaseChannel;
  readonly publishedAt?: string;
  readonly releaseURL: string;
  readonly minimumMacOS: string;
  readonly bundleID: 'dev.quotapulse.app';
  readonly artifact: {
    readonly filename: string;
    readonly downloadURL: string;
    readonly sizeBytes: number;
    readonly sha256: string;
  };
  readonly signing: {
    readonly type: SigningType;
    readonly codesignVerified: boolean;
    readonly notarized: boolean;
    readonly stapled: boolean;
  };
}

function requireValid(condition: unknown, field: string): asserts condition {
  if (!condition) throw new Error(`Invalid release metadata: ${field}`);
}

function object(value: unknown, field: string): Record<string, unknown> {
  requireValid(value !== null && typeof value === 'object' && !Array.isArray(value), field);
  return value as Record<string, unknown>;
}

function string(value: unknown, field: string): string {
  requireValid(typeof value === 'string' && value.trim() === value && value.length > 0, field);
  return value;
}

function githubURL(value: unknown, expectedPath: string, field: string): string {
  const raw = string(value, field);
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`Invalid release metadata: ${field}`);
  }
  requireValid(
    url.protocol === 'https:' && url.hostname === 'github.com' &&
    !url.port && !url.username && !url.password && !url.search && !url.hash &&
    url.pathname === expectedPath,
    field,
  );
  return raw;
}

export function validateReleaseMetadata(
  input: unknown,
  expectedChannel: ReleaseChannel,
): ReleaseMetadata {
  const data = object(input, 'root');
  requireValid(data.schemaVersion === 1, 'schemaVersion (supported: 1)');
  requireValid(data.channel === 'stable' || data.channel === 'preview', 'channel');
  requireValid(data.channel === expectedChannel, `channel (expected ${expectedChannel})`);

  const tag = string(data.tag, 'tag');
  const version = string(data.version, 'version');
  // Stable must be a final version; preview must explicitly carry a prerelease suffix.
  const core = '(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)';
  const prerelease = '[0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*';
  requireValid(new RegExp(`^${core}${data.channel === 'preview' ? `-${prerelease}` : ''}$`).test(version), 'version/channel');
  requireValid(tag === `v${version}`, 'tag/version');
  try { parseTag(tag); } catch { throw new Error('Invalid release metadata: SemVer'); }
  requireValid(Number.isSafeInteger(data.build) && (data.build as number) >= 0, 'build');
  const minimumMacOS = string(data.minimumMacOS, 'minimumMacOS');
  requireValid(/^\d+(?:\.\d+){0,2}$/.test(minimumMacOS), 'minimumMacOS');
  requireValid(data.bundleID === 'dev.quotapulse.app', 'bundleID');

  const artifact = object(data.artifact, 'artifact');
  const filename = string(artifact.filename, 'artifact.filename');
  requireValid(filename === `QuotaMew-${tag}.dmg`, 'artifact.filename (expected QuotaMew tag DMG)');
  requireValid(Number.isSafeInteger(artifact.sizeBytes) && (artifact.sizeBytes as number) > 0, 'artifact.sizeBytes');
  const sha256 = string(artifact.sha256, 'artifact.sha256');
  requireValid(/^[a-fA-F0-9]{64}$/.test(sha256), 'artifact.sha256');

  const signing = object(data.signing, 'signing');
  requireValid(['unsigned', 'apple-development', 'developer-id'].includes(signing.type as string), 'signing.type');
  for (const field of ['codesignVerified', 'notarized', 'stapled']) {
    requireValid(typeof signing[field] === 'boolean', `signing.${field}`);
  }
  requireValid(!signing.stapled || signing.notarized, 'signing.stapled requires notarization');
  requireValid(signing.type !== 'unsigned' || (!signing.codesignVerified && !signing.notarized), 'unsigned signing status');

  const publishedAt = data.publishedAt === undefined ? undefined : string(data.publishedAt, 'publishedAt');
  if (publishedAt !== undefined) {
    requireValid(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(publishedAt) && Number.isFinite(Date.parse(publishedAt)), 'publishedAt (UTC timestamp)');
  }

  const base = '/YinCheng0106/QuotaMew/releases';
  return Object.freeze({
    schemaVersion: 1,
    tag,
    version,
    build: data.build as number,
    channel: data.channel,
    ...(publishedAt === undefined ? {} : { publishedAt }),
    releaseURL: githubURL(data.releaseURL, `${base}/tag/${tag}`, 'releaseURL'),
    minimumMacOS,
    bundleID: 'dev.quotapulse.app',
    artifact: Object.freeze({
      filename,
      downloadURL: githubURL(artifact.downloadURL, `${base}/download/${tag}/${filename}`, 'artifact.downloadURL'),
      sizeBytes: artifact.sizeBytes as number,
      sha256,
    }),
    signing: Object.freeze({
      type: signing.type as SigningType,
      codesignVerified: signing.codesignVerified as boolean,
      notarized: signing.notarized as boolean,
      stapled: signing.stapled as boolean,
    }),
  });
}
