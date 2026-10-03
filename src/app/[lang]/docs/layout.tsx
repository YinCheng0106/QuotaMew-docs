import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { DocsPathnameProvider } from '@/components/docs-pathname-provider';

export default async function Layout({
  children,
  params,
}: LayoutProps<'/[lang]/docs'>) {
  const { lang } = await params;

  return (
    <DocsPathnameProvider>
      <DocsLayout
        tree={source.getPageTree(lang)}
        {...baseOptions(lang)}
      >
        {children}
      </DocsLayout>
    </DocsPathnameProvider>
  );
}
