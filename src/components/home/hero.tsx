import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Download } from 'lucide-react';

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

        <AppPreview lang={lang} />
      </div>
    </section>
  );
}

function AppPreview({ lang }: { lang: string }) {
  const isTraditionalChinese = lang === 'zh-TW';

  return (
    <div className="mt-16 w-full max-w-4xl sm:mt-20">
      <div className="overflow-hidden rounded-2xl border bg-fd-card p-2 shadow-2xl shadow-black/5 sm:p-3">
        <Image
          src="/images/screenshots/quotamew-dashboard.png"
          alt={
            isTraditionalChinese
              ? 'QuotaMew macOS 選單列 Dashboard，顯示 Codex 五小時、每週與 Luna Reserve 額度'
              : 'QuotaMew macOS menu bar dashboard showing Codex 5-hour, Weekly, and Luna Reserve quota'
          }
          width={920}
          height={1114}
          priority
          className="h-auto w-full rounded-xl"
        />
      </div>

      <p className="mt-4 text-center text-xs text-fd-muted-foreground">
        {isTraditionalChinese
          ? 'QuotaMew 原生 macOS 選單列 Dashboard'
          : 'QuotaMew native macOS menu bar dashboard'}
      </p>
    </div>
  );
}
