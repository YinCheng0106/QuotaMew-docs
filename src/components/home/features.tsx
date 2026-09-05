import {
  Bell,
  Clock,
  Gauge,
  ShieldCheck,
} from 'lucide-react';

type FeaturesContent = {
  eyebrow: string;
  title: string;
  items: readonly {
    title: string;
    description: string;
  }[];
};

export function FeaturesSection({
  content,
}: {
  content: FeaturesContent;
}) {
  const icons = [Gauge, Clock, Bell, ShieldCheck];

  return (
    <section className="border-t">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-fd-muted-foreground">
            {content.eyebrow}
          </p>

          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.title}
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item, index) => {
            const Icon = icons[index] ?? Gauge;

            return (
              <div
                key={item.title}
                className="rounded-2xl border bg-fd-card p-6 transition-colors hover:bg-fd-accent/40"
              >
                <div className="flex size-10 items-center justify-center rounded-xl border bg-fd-background">
                  <Icon className="size-5" />
                </div>

                <h3 className="mt-5 font-semibold tracking-tight">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}