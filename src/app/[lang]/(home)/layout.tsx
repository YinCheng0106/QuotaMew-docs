import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { SiteFooter } from '@/components/site-footer';

export default async function Layout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  return (
    <HomeLayout {...baseOptions(lang)}>
      {children}
      <SiteFooter locale={lang} />
    </HomeLayout>
  );
}
