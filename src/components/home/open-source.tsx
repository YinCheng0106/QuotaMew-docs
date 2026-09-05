import { ArrowRight, Code2 } from 'lucide-react';
import { GitHubIcon } from './github-icon';

type OpenSourceContent = {
  eyebrow: string;
  title: string;
  description: string;
  github: string;
};

export function OpenSourceSection({
  content,
  githubUrl,
}: {
  content: OpenSourceContent;
  githubUrl: string;
}) {
  return (
    <section className="border-t">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
        <div className="relative overflow-hidden rounded-3xl border bg-fd-card px-6 py-12 text-center sm:px-10 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-fd-primary/3"
          />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border bg-fd-background">
              <Code2 className="size-5" />
            </div>

            <p className="mt-6 text-sm font-medium text-fd-muted-foreground">
              {content.eyebrow}
            </p>

            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {content.title}
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-7 text-fd-muted-foreground sm:text-base">
              {content.description}
            </p>

            <div className="mt-8 flex justify-center">
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-fd-primary px-5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
              >
                <GitHubIcon className="size-4" />
                {content.github}
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}