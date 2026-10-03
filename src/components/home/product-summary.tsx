import Link from 'next/link';
import { getHomeContent } from '../../lib/home-content';
import { localizePath } from '../../lib/i18n';

export function MonitoringSection({ locale }: { locale: string }) {
  const content = getHomeContent(locale).monitoring;
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <p className="text-sm text-fd-muted-foreground">{content.eyebrow}</p>
        <h2 className="mt-3 text-balance text-3xl font-semibold">{content.title}</h2>
        <p className="mt-4 max-w-3xl leading-7 text-fd-muted-foreground">{content.description}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {content.items.map(item => (
            <div key={item.title}>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
        <Link href={localizePath(locale, '/docs/menu-bar')} className="mt-6 inline-block text-sm underline underline-offset-4">{content.link}</Link>
      </div>
    </section>
  );
}

export function GettingStartedSummary({ locale }: { locale: string }) {
  const content = getHomeContent(locale);
  return (
    <section className="border-t bg-fd-secondary/20">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:px-8">
        {[
          { ...content.trust, href: '/docs/privacy' },
          { ...content.installation, href: '/docs/installation' },
        ].map(item => (
          <div key={item.href}>
            <h2 className="text-2xl font-semibold tracking-tight">{item.title}</h2>
            <p className="mt-4 leading-7 text-fd-muted-foreground">{item.description}</p>
            <Link href={localizePath(locale, item.href)} className="mt-4 inline-block text-sm underline underline-offset-4">{item.link}</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
