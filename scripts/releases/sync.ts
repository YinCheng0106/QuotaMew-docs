import { readFile, writeFile, rename, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { validateReleaseMetadata, type ReleaseMetadata } from '../../src/lib/release-metadata';
import { compareTags, parseTag } from '../../src/lib/semver';
import { githubFacts, mergeManifest, record, requireFact } from './contract';
import type { ReleaseSource } from './github';

export const serialize = (release: ReleaseMetadata) => JSON.stringify(validateReleaseMetadata(release, release.channel), null, 2) + '\n';
export const serializePreview = (release: ReleaseMetadata | null) => "import type { ReleaseMetadata } from '../../lib/release-metadata';\n\n// Generated optional snapshot; null denotes an absent channel.\nexport const previewSnapshot: ReleaseMetadata | null = " + (release ? serialize(release).trimEnd() : 'null') + ';\n';

export async function atomicUpdates(updates: { path: string; before: string; after: string }[], replace = rename) {
  const staged: { path: string; temp: string; before: string }[] = [];
  const replaced: typeof staged = [];
  try {
    for (const file of updates) {
      const temp = `${file.path}.${randomUUID()}.tmp`;
      staged.push({ path: file.path, temp, before: file.before });
      await writeFile(temp, file.after, { flag: 'wx' });
    }
    for (const file of staged) { await replace(file.temp, file.path); replaced.push(file); }
  } catch (error) {
    // Restore already replaced files if a later rename fails. Each replacement
    // is atomic; this is not a crash-atomic transaction across multiple files.
    for (const file of replaced.reverse()) {
      await writeFile(file.temp, file.before, { flag: 'wx' });
      await rename(file.temp, file.path);
    }
    throw error;
  } finally { await Promise.all(staged.map(file => unlink(file.temp).catch(() => {}))); }
}

export async function resolve(source: ReleaseSource, current: ReleaseMetadata, previousPreview: ReleaseMetadata | null) {
  const diagnostics: string[] = [];
  const remote = await source.latest();
  const r = record(remote);
  const bootstrap = current.tag === 'v0.2.0' && r.tag_name === current.tag;
  const facts = githubFacts(remote, 'stable', bootstrap ? current.artifact.sha256 : undefined);
  requireFact(compareTags(facts.tag, current.tag) >= 0, 'Stable downgrade refused');
  let stable: ReleaseMetadata;
  if (bootstrap) {
    requireFact(facts.releaseURL === current.releaseURL && JSON.stringify(facts.artifact) === JSON.stringify(current.artifact), 'bootstrap GitHub facts changed');
    requireFact(current.publishedAt === undefined || current.publishedAt === facts.publishedAt, 'bootstrap publication date changed');
    // Preserve verified application facts and omitted publication time byte-for-byte.
    stable = current;
    diagnostics.push('Stable: v0.2.0 — bootstrap verified');
  } else {
    requireFact(facts.manifestAsset, 'Stable manifest missing');
    stable = mergeManifest(await source.manifest(facts.manifestAsset), facts);
  }
  const candidates: ReleaseMetadata[] = [];
  for (const raw of await source.list()) {
    let tag = 'unknown';
    try {
      const release = record(raw);
      if (release.draft === true || release.prerelease === false) continue;
      if (typeof release.tag_name === 'string') tag = release.tag_name;
      parseTag(tag);
      if (compareTags(tag, stable.tag) <= 0) { diagnostics.push(`${tag}: ignored (not newer than Stable)`); continue; }
      const previewFacts = githubFacts(raw, 'preview');
      requireFact(previewFacts.manifestAsset, 'Preview manifest missing');
      candidates.push(mergeManifest(await source.manifest(previewFacts.manifestAsset), previewFacts));
    } catch (error) {
      const reason = error instanceof Error && /^(Release contract:|Invalid release metadata:|Invalid .*SemVer)/.test(error.message) ? error.message : 'manifest request/validation failed';
      diagnostics.push(`${/^v[0-9A-Za-z.-]{1,80}$/.test(tag) ? tag : 'invalid tag'}: rejected (${reason})`);
    }
  }
  candidates.sort((a, b) => compareTags(b.tag, a.tag));
  let preview = candidates[0] ?? previousPreview;
  if (preview && previousPreview && compareTags(preview.tag, previousPreview.tag) < 0) preview = previousPreview;
  return { stable, preview, diagnostics };
}

export async function synchronize(source: ReleaseSource, directory: string, preview: ReleaseMetadata | null, dryRun: boolean) {
  const stablePath = join(directory, 'stable.json'), previewPath = join(directory, 'preview.ts');
  const before = await readFile(stablePath, 'utf8');
  const current = validateReleaseMetadata(JSON.parse(before), 'stable');
  const result = await resolve(source, current, preview);
  const updates = [
    { path: stablePath, before, after: serialize(result.stable) },
    { path: previewPath, before: await readFile(previewPath, 'utf8'), after: serializePreview(result.preview) },
  ].filter(file => file.before !== file.after);
  if (!dryRun) {
    await atomicUpdates(updates);
  }
  return { ...result, changed: updates.length > 0, currentStable: current.tag, currentPreview: preview?.tag ?? 'none' };
}
