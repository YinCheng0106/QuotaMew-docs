import { getFooterContent } from '../lib/footer-content';

export function SiteFooter({ locale }: { locale: string }) {
  const content = getFooterContent(locale);
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-8 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="text-fd-muted-foreground">
          <p>{content.summary}</p>
          <a href={content.release.releaseURL} className="mt-2 inline-block hover:underline">{content.release.headline}</a>
        </div>
        <nav aria-label={content.label}>
          <ul className="flex flex-wrap gap-x-5 gap-y-3">
            {content.links.map(link => (
              <li key={link.href}><a href={link.href} className="hover:underline">{link.label}</a></li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
