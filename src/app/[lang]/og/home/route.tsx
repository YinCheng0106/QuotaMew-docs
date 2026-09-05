import { getHomeContent } from '@/lib/home-content';
import { i18n } from '@/lib/i18n';
import { appName } from '@/lib/shared';
import { googleFonts } from 'takumi-js/helpers';
import { ImageResponse } from 'takumi-js/response';
import { generate as DefaultImage } from 'fumadocs-ui/og/takumi';

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<'/[lang]/og/home'>,
) {
  const { lang } = await params;
  const content = getHomeContent(lang);

  const fonts =
    lang === 'zh-TW'
      ? googleFonts([
          {
            name: 'Noto Sans TC',
            weight: '100..900',
          },
        ])
      : undefined;

  return new ImageResponse(
    <DefaultImage
      title={content.hero.title}
      description={content.hero.description}
      site={appName}
    />,
    {
      width: 1200,
      height: 630,
      format: 'webp',
      fonts,
    },
  );
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({
    lang,
  }));
}