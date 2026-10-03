import { Download } from 'lucide-react';
import { getPreviewRelease, getStableRelease } from '../lib/release';
import { getReleasePresentation } from '../lib/release-presentation';
import type { ReleaseMetadata } from '../lib/release-metadata';

export function StableDownloadLink({
  locale,
  release = getStableRelease(),
}: {
  locale: string;
  release?: ReleaseMetadata;
}) {
  const copy = getReleasePresentation(release, locale);
  return (
    <a href={copy.downloadURL} data-release-channel="stable"
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-fd-primary px-5 py-2 text-sm font-medium text-fd-primary-foreground hover:opacity-90">
      <Download aria-hidden="true" className="size-4 shrink-0" />
      {locale === 'zh-TW' ? '下載穩定版' : 'Download Stable'} {copy.versionLabel}
    </a>
  );
}

export function PreviewRelease({
  locale,
  release = getPreviewRelease(),
}: {
  locale: string;
  release?: ReleaseMetadata | null;
}) {
  if (!release) return null;
  const copy = getReleasePresentation(release, locale);
  const zh = locale === 'zh-TW';
  return (
    <aside data-release-channel="preview" className="mx-auto my-8 w-full max-w-4xl rounded-xl border p-5">
      <h2 className="font-semibold">{copy.channelLabel} · {copy.versionLabel}</h2>
      <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
        {zh ? '選用的預先發行版本，測試可能較少，內容也可能變動。一般使用建議下載穩定版。' : 'An optional prerelease with less testing and behavior that may change. Stable is recommended for everyday use.'}
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3 text-sm">
        <a className="underline underline-offset-4" href={copy.downloadURL}>
          {zh ? '試用預覽版' : 'Try Preview'} {copy.versionLabel}
        </a>
        <a className="underline underline-offset-4" href={copy.releaseURL}>
          {zh ? '查看預覽版發行說明與安裝資訊' : 'Preview release notes and installation details'}
        </a>
      </div>
    </aside>
  );
}
