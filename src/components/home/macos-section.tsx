import {
  Feather,
  Laptop,
  ShieldCheck,
} from 'lucide-react';

type MacOSContent = {
  eyebrow: string;
  title: string;
  items: readonly {
    title: string;
    description: string;
  }[];
};

export function MacOSSection({
  content,
}: {
  content: MacOSContent;
}) {
  const icons = [Laptop, Feather, ShieldCheck];

  return (
    <section className="border-t">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-fd-muted-foreground">
              {content.eyebrow}
            </p>

            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {content.title}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {content.items.map((item, index) => {
              const Icon = icons[index] ?? Laptop;

              return (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl border bg-fd-card p-5 sm:p-6"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-fd-background">
                    <Icon className="size-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold tracking-tight">
                      {item.title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-fd-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}