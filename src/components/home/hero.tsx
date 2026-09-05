import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';
import { AppScreenshot } from './app-screenshot';

type HeroContent = {
  badge: string;
  title: string;
  description: string;
  download: string;
  docs: string;
};

export function Hero({
  content,
  lang,
  downloadUrl,
  docsUrl,
}: {
  content: HeroContent;
  lang: string;
  downloadUrl: string;
  docsUrl: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-16 pt-20 text-center sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-32">
        <div className="mb-6 rounded-full border bg-fd-secondary/50 px-3 py-1 text-sm text-fd-muted-foreground">
          {content.badge}
        </div>

        <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
          {content.title}
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-fd-muted-foreground sm:text-lg sm:leading-8">
          {content.description}
        </p>

        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Link
            href={downloadUrl}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-fd-primary px-5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            <Download className="size-4" />
            {content.download}
          </Link>
        
          <Link
            href={docsUrl}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border bg-fd-background px-5 text-sm font-medium transition-colors hover:bg-fd-accent"
          >
            {content.docs}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/*<AppScreenshot lang={lang} />*/}
        <AppPreview lang={lang} />
      </div>
    </section>
  );
}

function AppPreview({ lang }: { lang: string }) {
  const isTraditionalChinese = lang === 'zh-TW';

  return (
    <div className="mt-16 w-full max-w-4xl sm:mt-20">
      <div className="overflow-hidden rounded-2xl border bg-fd-card shadow-2xl shadow-black/5">
        <div className="flex h-11 items-center border-b px-4">
          <div className="flex gap-2">
            <div className="size-3 rounded-full bg-fd-muted-foreground/20" />
            <div className="size-3 rounded-full bg-fd-muted-foreground/20" />
            <div className="size-3 rounded-full bg-fd-muted-foreground/20" />
          </div>

          <span className="mx-auto pr-9 text-xs text-fd-muted-foreground">
            QuotaPulse
          </span>
        </div>

        <div className="grid gap-6 p-6 text-left sm:p-8 lg:grid-cols-[1fr_280px]">
          <div className="flex min-h-72 items-center justify-center rounded-xl border border-dashed bg-fd-secondary/30 p-8">
            <div className="max-w-sm text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border bg-fd-background font-semibold">
                Q
              </div>

              <p className="font-medium">
                {isTraditionalChinese
                  ? 'QuotaPulse App 截圖'
                  : 'QuotaPulse App Screenshot'}
              </p>

              <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                {isTraditionalChinese
                  ? '之後會在這裡放入真實的 QuotaPulse macOS 介面截圖。'
                  : 'A real screenshot of the QuotaPulse macOS interface will be placed here later.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3">
            <PreviewRow
              title="Codex"
              value="72%"
              subtitle={
                isTraditionalChinese
                  ? '剩餘額度'
                  : 'remaining'
              }
            />

            <PreviewRow
              title={
                isTraditionalChinese
                  ? '下次重置'
                  : 'Next reset'
              }
              value="2h 41m"
              subtitle={
                isTraditionalChinese
                  ? '倒數'
                  : 'countdown'
              }
            />

            <PreviewRow
              title="Claude Code"
              value="—"
              subtitle="Experimental"
            />
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-fd-muted-foreground">
        {isTraditionalChinese
          ? '目前為版面預覽，之後會替換成實際 App 截圖。'
          : 'Layout preview — this will be replaced with an actual app screenshot.'}
      </p>
    </div>
  );
}

function PreviewRow({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl border bg-fd-background p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">
          {title}
        </span>

        <span className="font-mono text-sm font-semibold">
          {value}
        </span>
      </div>

      <p className="mt-1 text-xs text-fd-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}