import { RootProvider } from 'fumadocs-ui/provider/next';
import { i18nProvider } from 'fumadocs-ui/i18n';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { appDescription, appName } from '@/lib/shared';
import { translations } from '@/lib/layout.shared';
import { i18n } from '@/lib/i18n';
import { siteOrigin } from '@/lib/site-url';
import '../global.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: appDescription,
  applicationName: appName,
};

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({
    lang,
  }));
}

export default async function Layout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  return (
    <html
      lang={lang}
      className={inter.className}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider i18n={i18nProvider(translations, lang)}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
