import snapshot from './bootstrap-stable.json';
import { manifestFilename, repository } from '../../scripts/releases/contract';
import type { ReleaseSource } from '../../scripts/releases/github';

export function release(tag: string, draft = false) {
  const name = `QuotaMew-${tag}.dmg`, base = `https://github.com/${repository}/releases`;
  return { tag_name: tag, draft, prerelease: tag.includes('-'), html_url: `${base}/tag/${tag}`, published_at: '2026-10-01T00:00:00Z', assets: [
    { id: 1, name, size: snapshot.artifact.sizeBytes, digest: `sha256:${snapshot.artifact.sha256}`, browser_download_url: `${base}/download/${tag}/${name}` },
    { id: 2, name: manifestFilename, size: 512, digest: null, browser_download_url: `${base}/download/${tag}/${manifestFilename}` },
  ] };
}
export function manifest(tag: string) {
  return { schemaVersion: 1, tag, version: tag.slice(1), build: 6, channel: tag.includes('-') ? 'preview' : 'stable', minimumMacOS: '14', bundleID: snapshot.bundleID, artifact: { filename: `QuotaMew-${tag}.dmg` }, signing: { ...snapshot.signing } };
}
export function source(releases: unknown[], latest: unknown = release('v0.2.0')): ReleaseSource {
  return { latest: async () => latest, list: async () => releases, manifest: async asset => {
    const url = String(asset.browser_download_url);
    return manifest(url.split('/').at(-2)!);
  } };
}
