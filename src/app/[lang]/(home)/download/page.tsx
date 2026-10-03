import type { Metadata } from 'next';
import Link from 'next/link';
import { PreviewRelease, StableDownloadLink } from '@/components/release-actions';
import { getDownloadContent } from '@/lib/download-content';
import { localizePath } from '@/lib/i18n';
import { getStableRelease } from '@/lib/release';
import { getStableReleasePresentation } from '@/lib/release-presentation';
import { absoluteUrl, localizedAlternates } from '@/lib/site-url';

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/download'>): Promise<Metadata> {
  const { lang } = await params;
  const content = getDownloadContent(lang);
  const canonicalPath = localizePath(lang, '/download');
  const canonicalUrl = absoluteUrl(canonicalPath);
  const image = absoluteUrl(localizePath(lang, '/og/home'));
  return {
    title: content.eyebrow,
    description: content.description,
    alternates: { canonical: canonicalUrl, languages: localizedAlternates(canonicalPath) },
    openGraph: {
      type: 'website', url: canonicalUrl, siteName: 'QuotaMew',
      title: content.title, description: content.description,
      locale: lang === 'zh-TW' ? 'zh_TW' : 'en_US', images: [image],
    },
    twitter: { card: 'summary_large_image', title: content.title, description: content.description, images: [image] },
  };
}

export default async function DownloadPage({ params }: PageProps<'/[lang]/download'>) {
  const { lang } = await params;
  const content = getDownloadContent(lang);
  const metadata = getStableRelease();
  const release = getStableReleasePresentation(lang);
  const yesNo = (value: boolean) => value ? content.release.yes : content.release.no;
  const github = release.releaseURL.slice(0, release.releaseURL.lastIndexOf('/tag/'));
  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-6xl px-6 pb-12 pt-20 sm:pt-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium text-fd-muted-foreground">{release.headline}</p>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">{content.title}</h1>
          <p className="mt-6 leading-7 text-fd-muted-foreground">{content.description}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <StableDownloadLink locale={lang} />
            <a href={release.releaseURL} className="inline-flex min-h-11 items-center justify-center rounded-lg border px-5 py-2 text-sm font-medium hover:bg-fd-accent">{content.actions.github}</a>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border bg-fd-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold">{content.release.title}</h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <ReleaseItem label={content.release.version} value={release.versionLabel} />
            <ReleaseItem label={content.release.channel} value={release.channelLabel} />
            <ReleaseItem label={content.release.compatibility} value={release.requirements} />
            <ReleaseItem label={content.release.artifact} value={release.filename} />
            <ReleaseItem label={content.release.size} value={`${release.size} (${release.sizeExact})`} />
          </dl>
        </div>
        <PreviewRelease locale={lang} />
      </section>

      <section className="border-t bg-fd-secondary/20">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h2 className="text-2xl font-semibold">{content.security.title}</h2>
          <p className="mt-4 leading-7 text-fd-muted-foreground">{content.security.source}</p>
          <p className="mt-4 text-sm leading-6 text-fd-muted-foreground">{content.security.description}</p>
          <p className="mt-4 leading-7">{content.security.action}</p>
          <p className="mt-4 leading-7 text-fd-muted-foreground">{content.security.expectation}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm underline underline-offset-4">
            <Link href={localizePath(lang, '/docs/installation')}>{content.actions.installation}</Link>
            <Link href={localizePath(lang, '/docs/first-launch')}>{content.actions.firstLaunch}</Link>
            <Link href={localizePath(lang, '/docs/providers')}>{lang === 'zh-TW' ? 'Provider 前置需求' : 'Provider prerequisites'}</Link>
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h2 className="text-xl font-semibold">{content.verification.title}</h2>
          <p className="mt-3 text-sm leading-6 text-fd-muted-foreground">{content.verification.description}</p>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <ReleaseItem label={content.release.build} value={String(metadata.build)} />
            <ReleaseItem label={content.release.signed} value={release.signingStatus} />
            <ReleaseItem label={content.release.developerID} value={yesNo(metadata.signing.type === 'developer-id')} />
            <ReleaseItem label={content.release.codesign} value={yesNo(metadata.signing.codesignVerified)} />
            <ReleaseItem label={content.release.notarized} value={yesNo(metadata.signing.notarized)} />
            <ReleaseItem label={content.release.stapled} value={yesNo(metadata.signing.stapled)} />
            <div className="min-w-0 sm:col-span-2">
              <dt className="text-sm text-fd-muted-foreground">{content.release.checksum}</dt>
              <dd className="mt-2"><code className="block select-all break-all rounded-lg bg-fd-secondary p-3 text-sm">{release.sha256}</code></dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h2 className="text-2xl font-semibold">{content.channels.title}</h2>
          <p className="mt-4 leading-7">{content.channels.stable}</p>
          <p className="mt-3 leading-7 text-fd-muted-foreground">{content.channels.preview}</p>
          <p className="mt-3 leading-7 text-fd-muted-foreground">{content.channels.updates} <Link href={localizePath(lang, '/docs/updating')} className="underline underline-offset-4">{lang === 'zh-TW' ? '更新指南' : 'Updating guide'}</Link></p>
          <p className="mt-3 text-sm leading-6 text-fd-muted-foreground">{content.channels.history}</p>
          <a href={github} className="mt-4 inline-block text-sm underline underline-offset-4">{content.actions.history}</a>
        </div>
      </section>
    </main>
  );
}

function ReleaseItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-sm text-fd-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words font-medium">{value}</dd>
    </div>
  );
}
