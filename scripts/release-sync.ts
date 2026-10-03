import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { previewSnapshot } from '../src/data/releases/preview';
import { GitHubClient, type ReleaseSource } from './releases/github';
import { synchronize } from './releases/sync';

const args = process.argv.slice(2);
const fixtureIndex = args.indexOf('--fixture');
const allowed = args.filter((_, i) => i !== fixtureIndex + 1 || fixtureIndex < 0);
if (allowed.some(arg => !['--dry-run', '--check', '--fixture'].includes(arg)) || (fixtureIndex >= 0 && !args[fixtureIndex + 1])) {
  console.error('Usage: bun run release:sync [--dry-run|--check] [--fixture path]');
  process.exit(1);
}
try {
  let source: ReleaseSource = new GitHubClient();
  if (fixtureIndex >= 0) {
    const fixture = JSON.parse(await readFile(args[fixtureIndex + 1], 'utf8'));
    source = { latest: async () => fixture.latest, list: async () => fixture.releases, manifest: async asset => fixture.manifests[String(asset.id)] };
  }
  const dryRun = args.includes('--dry-run') || args.includes('--check');
  const result = await synchronize(source, resolve('src/data/releases'), previewSnapshot, dryRun);
  for (const line of result.diagnostics.slice(0, 50)) console.log(line);
  console.log(`Stable: ${result.currentStable} -> ${result.stable.tag}`);
  console.log(`Preview: ${result.currentPreview} -> ${result.preview?.tag ?? 'none'}`);
  console.log(`Snapshots: ${result.changed ? dryRun ? 'would change' : 'changed' : 'unchanged'}`);
  if (args.includes('--check') && result.changed) process.exitCode = 1;
} catch (error) {
  console.error(error instanceof Error && /^(Release contract:|Invalid release metadata:|Invalid .*SemVer)/.test(error.message) ? error.message : 'Release sync failed: network or filesystem failure');
  process.exitCode = 1;
}
