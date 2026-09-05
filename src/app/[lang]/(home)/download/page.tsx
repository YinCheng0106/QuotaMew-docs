import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Download,
  ExternalLink,
  Laptop,
  ShieldCheck,
} from 'lucide-react';

import { getDownloadContent } from '@/lib/download-content';
import { localizePath } from '@/lib/i18n';
import { releaseConfig } from '@/lib/release';
import {
  docsRoute,
  productGitConfig,
} from '@/lib/shared';

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/download'>): Promise<Metadata> {
  const { lang } = await params;
  const content = getDownloadContent(lang);

  return {
    title: content.eyebrow,
    description: content.description,
  };
}

export default async function DownloadPage({
  params,
}: PageProps<'/[lang]/download'>) {
  const { lang } = await params;
  const content = getDownloadContent(lang);

  const isAvailable =
    releaseConfig.availability === 'available';

  const githubReleasesUrl =
    `https://github.com/${productGitConfig.user}/${productGitConfig.repo}/releases`;

  const installationUrl = localizePath(
    lang,
    `${docsRoute}/installation`,
  );

  const firstLaunchUrl = localizePath(
    lang,
    `${docsRoute}/first-launch`,
  );

  return (
    <main className="flex flex-1 flex-col">
      <section>
        <div className="mx-auto w-full max-w-6xl px-6 pb-16 pt-20 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-fd-secondary/50 px-3 py-1 text-sm text-fd-muted-foreground">
              <span>{content.status.beta}</span>

              <span aria-hidden="true">·</span>

              <span>
                {isAvailable
                  ? content.status.available
                  : content.status.comingSoon}
              </span>
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {content.title}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-fd-muted-foreground sm:text-lg sm:leading-8">
              {content.description}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {isAvailable &&
              releaseConfig.downloadUrl ? (
                <a
                  href={releaseConfig.downloadUrl}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-fd-primary px-5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Download className="size-4" />
                  {content.actions.download}
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-fd-secondary px-5 text-sm font-medium text-fd-muted-foreground"
                >
                  <Download className="size-4" />
                  {content.status.comingSoon}
                </span>
              )}

              <a
                href={githubReleasesUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border bg-fd-background px-5 text-sm font-medium transition-colors hover:bg-fd-accent"
              >
                {content.actions.github}
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>

          <ReleaseOverview
            content={content}
          />
        </div>
      </section>

      <SecuritySection
        content={content}
        installationUrl={installationUrl}
      />

      <FirstLaunchSection
        content={content}
        firstLaunchUrl={firstLaunchUrl}
      />

      <InstallationSection
        content={content}
        installationUrl={installationUrl}
      />
    </main>
  );
}

function ReleaseOverview({
  content,
}: {
  content: ReturnType<typeof getDownloadContent>;
}) {
  const booleanLabel = (value: boolean) =>
    value
      ? content.release.yes
      : content.release.no;

  return (
    <div className="mx-auto mt-16 max-w-4xl rounded-2xl border bg-fd-card p-6 sm:mt-20 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl border bg-fd-background">
          <Laptop className="size-5" />
        </div>

        <h2 className="text-lg font-semibold">
          {content.release.title}
        </h2>
      </div>

      <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <ReleaseItem
          label={content.release.version}
          value={
            releaseConfig.version ??
            content.release.notPublished
          }
        />

        <ReleaseItem
          label={content.release.channel}
          value="Beta"
        />

        <ReleaseItem
          label={content.release.compatibility}
          value={`macOS ${releaseConfig.minimumMacOS}+`}
        />

        <ReleaseItem
          label={content.release.signed}
          value={booleanLabel(
            releaseConfig.developerIdSigned,
          )}
        />

        <ReleaseItem
          label={content.release.notarized}
          value={booleanLabel(
            releaseConfig.notarized,
          )}
        />

        <ReleaseItem
          label={content.release.automaticUpdates}
          value={booleanLabel(
            releaseConfig.autoUpdate,
          )}
        />
      </dl>
    </div>
  );
}

function ReleaseItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-sm text-fd-muted-foreground">
        {label}
      </dt>

      <dd className="mt-1 font-medium">
        {value}
      </dd>
    </div>
  );
}

function SecuritySection({
  content,
  installationUrl,
}: {
  content: ReturnType<typeof getDownloadContent>;
  installationUrl: string;
}) {
  return (
    <section className="border-t bg-fd-secondary/20">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-6">
          <div className="flex size-12 items-center justify-center rounded-2xl border bg-fd-background">
            <ShieldCheck className="size-6" />
          </div>

          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {content.security.title}
            </h2>

            <p className="mt-4 leading-7 text-fd-muted-foreground">
              {content.security.description}
            </p>

            <p className="mt-4 leading-7 text-fd-muted-foreground">
              {content.security.source}
            </p>

            <p className="mt-4 font-medium">
              {content.security.action}
            </p>

            <Link
              href={installationUrl}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              {content.actions.installation}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstallationSection({
  content,
  installationUrl,
}: {
  content: ReturnType<typeof getDownloadContent>;
  installationUrl: string;
}) {
  return (
    <section className="border-t">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-fd-muted-foreground">
            {content.install.eyebrow}
          </p>

          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.install.title}
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {content.install.steps.map(
            (step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border bg-fd-card p-6"
              >
                <div className="flex size-9 items-center justify-center rounded-full border bg-fd-background text-sm font-semibold">
                  {index + 1}
                </div>

                <h3 className="mt-5 font-semibold">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                  {step.description}
                </p>
              </div>
            ),
          )}
        </div>

        <Link
          href={installationUrl}
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          {content.actions.installation}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function FirstLaunchSection({
  content,
  firstLaunchUrl,
}: {
  content: ReturnType<typeof getDownloadContent>;
  firstLaunchUrl: string;
}) {
  const firstLaunch = content.security.firstLaunch;

  return (
    <section className="border-t">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-fd-muted-foreground">
            {firstLaunch.eyebrow}
          </p>

          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {firstLaunch.title}
          </h2>

          <p className="mt-4 text-pretty leading-7 text-fd-muted-foreground">
            {firstLaunch.description}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {firstLaunch.steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border bg-fd-card p-6"
            >
              <div className="flex size-9 items-center justify-center rounded-full border bg-fd-background text-sm font-semibold">
                {index + 1}
              </div>

              <h3 className="mt-5 font-semibold">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border bg-fd-secondary/30 p-5">
          <p className="text-sm font-medium">
            {firstLaunch.warning}
          </p>
        </div>

        <Link
          href={firstLaunchUrl}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          {firstLaunch.docs}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}