import type { Metadata } from 'next';
import { FeaturesSection } from '@/components/home/features';
import { Hero } from '@/components/home/hero';
import { MacOSSection } from '@/components/home/macos-section';
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
    ? 'QuotaMew 是一款輕量的原生 macOS 選單列 App，讓你快速查看 AI 程式開發工具的使用量、剩餘額度與重置時間，並透過本機通知掌握重要的額度重置資訊。'
    : 'QuotaMew is a lightweight native macOS menu bar app for monitoring AI coding usage, remaining quota, reset times, and local reset notifications.';

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

  const downloadUrl = localizePath(lang, '/download');

  return (
    <main className="flex flex-1 flex-col">
      <Hero
        content={content.hero}
        lang={lang}
        downloadUrl={downloadUrl}
        docsUrl={docsUrl}
      />

      <FeaturesSection content={content.features} />

      <ProvidersSection content={content.providers} />

      <MacOSSection content={content.macOS} />

      <OpenSourceSection
        content={content.openSource}
        githubUrl={githubUrl}
      />
    </main>
  );
}
