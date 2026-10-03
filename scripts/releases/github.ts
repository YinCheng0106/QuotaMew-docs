import { repository, requireFact } from './contract';
import { createHash } from 'node:crypto';

export interface ReleaseSource {
  latest(): Promise<unknown>;
  list(): Promise<unknown[]>;
  manifest(asset: Record<string, unknown>): Promise<unknown>;
}

export class GitHubClient implements ReleaseSource {
  constructor(private token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN, private request: typeof fetch = fetch, private log: (message: string) => void = console.log) {}

  private async json(path: string, asset = false, digest?: string): Promise<unknown> {
    const url = `https://api.github.com/repos/${repository}/${path}`;
    this.log(`GET ${path}`);
    const response = await this.request(url, {
      headers: { Accept: asset ? 'application/octet-stream' : 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}) },
      signal: AbortSignal.timeout(20000),
    });
    requireFact(response.ok, `GitHub HTTP ${response.status}`);
    const limit = asset ? 65536 : 4 * 1024 * 1024;
    const reader = response.body?.getReader();
    requireFact(reader, 'GitHub empty response');
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.length;
        requireFact(size <= limit, 'GitHub response too large');
        chunks.push(value);
      }
    } finally { await reader.cancel(); }
    const body = Buffer.concat(chunks);
    if (digest) requireFact(createHash('sha256').update(body).digest('hex') === digest, 'manifest download digest mismatch');
    try { return JSON.parse(body.toString('utf8')); }
    catch { throw new Error('Release contract: GitHub invalid JSON'); }
  }
  latest() { return this.json('releases/latest'); }
  async list() {
    const releases: unknown[] = [];
    // An exhausted bound fails rather than treating incomplete discovery as absence.
    for (let page = 1; page <= 100; page++) {
      const result = await this.json(`releases?per_page=100&page=${page}`);
      requireFact(Array.isArray(result), 'GitHub release list');
      releases.push(...result);
      if (result.length < 100) return releases;
    }
    throw new Error('Release contract: GitHub pagination limit');
  }
  manifest(asset: Record<string, unknown>) {
    requireFact(Number.isSafeInteger(asset.id) && (asset.id as number) > 0, 'manifest asset id');
    let digest: string | undefined;
    if (asset.digest !== undefined && asset.digest !== null) {
      requireFact(typeof asset.digest === 'string' && /^sha256:[a-fA-F0-9]{64}$/.test(asset.digest), 'manifest SHA256 digest');
      digest = asset.digest.slice(7).toLowerCase();
    }
    return this.json(`releases/assets/${asset.id}`, true, digest);
  }
}
