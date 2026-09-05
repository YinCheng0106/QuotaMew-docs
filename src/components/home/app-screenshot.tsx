import Image from 'next/image';

export function AppScreenshot({
  lang,
}: {
  lang: string;
}) {
  const isTraditionalChinese = lang === 'zh-TW';

  return (
    <div className="mt-16 w-full max-w-5xl sm:mt-20">
      <div className="relative overflow-hidden rounded-2xl border bg-fd-card p-2 shadow-2xl shadow-black/5 sm:p-3">
        <div className="overflow-hidden rounded-xl border">
          <Image
            src="/images/quotapulse-app.webp"
            alt={
              isTraditionalChinese
                ? 'QuotaPulse macOS 選單列應用程式介面'
                : 'QuotaPulse macOS menu bar app interface'
            }
            width={1600}
            height={1000}
            priority
            className="h-auto w-full"
          />
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-fd-muted-foreground">
        {isTraditionalChinese
          ? 'QuotaPulse 原生 macOS 選單列介面'
          : 'QuotaPulse native macOS menu bar interface'}
      </p>
    </div>
  );
}