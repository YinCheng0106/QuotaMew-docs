import type { Metadata } from 'next';
import { FeaturesSection } from '@/components/home/features';
import { Hero } from '@/components/home/hero';
import { GettingStartedSummary, MonitoringSection } from '@/components/home/product-summary';
import { PreviewRelease } from '@/components/release-actions';
import { OpenSourceSection } from '@/components/home/open-source';
import { ProvidersSection } from '@/components/home/providers';
import { getHomeContent } from '@/lib/home-content';
import { absoluteUrl, localizedAlternates } from '@/lib/site-url';
import { localizePath } from '@/lib/i18n';
import {
  docsRoute,
  productGitConfig,
} from '@/lib/shared';

export async function generateMetadata({
  params,
}: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;

  const isTraditionalChinese = lang === 'zh-TW';

  const canonicalPath = localizePath(lang, '/');
  const canonicalUrl = absoluteUrl(canonicalPath);

  const pageTitle = isTraditionalChinese
    ? 'QuotaMew — macOS AI 程式開發額度與重置時間監控工具'
    : 'QuotaMew — AI Coding Quota & Reset Monitor for macOS';

  const metaDescription = isTraditionalChinese
    ? 'QuotaMew 是原生 macOS 選單列額度工具，可查看 Codex 剩餘或已使用額度、重置時間，並提供選用的本機通知。無遙測，設定保存在本機。'
    : 'A native macOS menu-bar app for Codex quota, Remaining or Used display, reset times and optional local notifications. Local-first settings, no telemetry.';

  const ogTitle = isTraditionalChinese
    ? 'QuotaMew — 一眼掌握你的 AI 程式開發額度'
    : 'QuotaMew — Your AI coding quota, at a glance.';

  const ogImageUrl = absoluteUrl(
    localizePath(lang, '/og/home'),
  );

  return {
    icons: {
      icon: '/favicon.png',
    },
    
    title: {
      absolute: pageTitle,
    },

    applicationName: 'QuotaMew',
    
    description: metaDescription,

    alternates: {
      canonical: canonicalUrl,
      languages: localizedAlternates(canonicalPath),
    },

    openGraph: {
      type: 'website',
      url: canonicalUrl,
      siteName: 'QuotaMew',
      title: ogTitle,
      description: metaDescription,
      locale: isTraditionalChinese ? 'zh_TW' : 'en_US',
      alternateLocale: [
        isTraditionalChinese ? 'en_US' : 'zh_TW',
      ],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: metaDescription,
      images: [ogImageUrl],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function HomePage({
  params,
}: PageProps<'/[lang]'>) {
  const { lang } = await params;
  const content = getHomeContent(lang);

  const docsUrl = localizePath(lang, docsRoute);
  const githubUrl =
    `https://github.com/${productGitConfig.user}/${productGitConfig.repo}`;

  return (
    <main className="flex flex-1 flex-col">
      <Hero
        content={content.hero}
        lang={lang}
        docsUrl={docsUrl}
      />

      <div className="px-6"><PreviewRelease locale={lang} /></div>

      <FeaturesSection content={content.features} />

      <MonitoringSection locale={lang} />

      <ProvidersSection content={content.providers} docsUrl={localizePath(lang, '/docs/providers')} />

      <GettingStartedSummary locale={lang} />

      <OpenSourceSection
        content={content.openSource}
        githubUrl={githubUrl}
      />
    </main>
  );
}
