import {
  CircleCheck,
  FlaskConical,
} from 'lucide-react';

type ProviderContent = {
  eyebrow: string;
  title: string;
  codex: {
    name: string;
    status: string;
    description: string;
  };
  claude: {
    name: string;
    status: string;
    description: string;
  };
};

export function ProvidersSection({
  content,
}: {
  content: ProviderContent;
}) {
  return (
    <section className="border-t bg-fd-secondary/20">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-fd-muted-foreground">
            {content.eyebrow}
          </p>

          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.title}
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <ProviderCard
            {...content.codex}
            supported
          />

          <ProviderCard
            {...content.claude}
          />
        </div>
      </div>
    </section>
  );
}

function ProviderCard({
  name,
  status,
  description,
  supported = false,
}: {
  name: string;
  status: string;
  description: string;
  supported?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-fd-card p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl border bg-fd-background">
          {supported ? (
            <CircleCheck className="size-5" />
          ) : (
            <FlaskConical className="size-5" />
          )}
        </div>

        <span
          className={
            supported
              ? 'rounded-full bg-fd-primary/10 px-3 py-1 text-xs font-medium text-fd-primary'
              : 'rounded-full bg-fd-secondary px-3 py-1 text-xs font-medium text-fd-muted-foreground'
          }
        >
          {status}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-semibold tracking-tight">
        {name}
      </h3>

      <p className="mt-2 max-w-lg text-sm leading-6 text-fd-muted-foreground">
        {description}
      </p>
    </div>
  );
}