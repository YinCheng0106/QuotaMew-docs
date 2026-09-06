import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getHomeContent } from '@/lib/home-content';
import { i18n } from '@/lib/i18n';
import { googleFonts } from 'takumi-js/helpers';
import { ImageResponse } from 'takumi-js/response';

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<'/[lang]/og/home'>,
) {
  const { lang } = await params;
  const content = getHomeContent(lang);

  const isTraditionalChinese = lang === 'zh-TW';

  const fonts = isTraditionalChinese
    ? googleFonts([
        {
          name: 'Noto Sans TC',
          weight: '100..900',
        },
      ])
    : undefined;

  const logoPath = path.join(
    process.cwd(),
    'public',
    'branding',
    'quotamew-icon.png',
  );

  const logoBuffer = await readFile(logoPath);
  const logoDataUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  const title = isTraditionalChinese
    ? '一眼掌握你的 AI 程式開發額度'
    : 'Your AI coding quota, at a glance.';

  const description = isTraditionalChinese
    ? '原生 macOS 選單列工具'
    : 'Native macOS menu bar utility';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        background:
          'linear-gradient(135deg, #0b0b0d 0%, #151518 55%, #0d0d10 100%)',
        color: '#ffffff',
        fontFamily: isTraditionalChinese
          ? 'Noto Sans TC'
          : 'sans-serif',
      }}
    >
      {/* Top */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '22px',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoDataUrl}
          alt="QuotaMew logo"
          width={96}
          height={96}
          style={{
            borderRadius: '22px',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontSize: '42px',
              fontWeight: 700,
              letterSpacing: '-1px',
            }}
          >
            QuotaMew
          </div>

          <div
            style={{
              marginTop: '4px',
              fontSize: '20px',
              color: '#a1a1aa',
            }}
          >
            quotamew.yincheng.app
          </div>
        </div>
      </div>

      {/* Main */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '980px',
        }}
      >
        <div
          style={{
            fontSize: isTraditionalChinese ? '58px' : '64px',
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: '-2px',
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: '24px',
            fontSize: '25px',
            color: '#a1a1aa',
          }}
        >
          {description}
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '18px',
        }}
      >
        <span style={{ color: '#71717a' }}>
          {isTraditionalChinese
            ? 'AI 程式開發用量 · 額度重置追蹤'
            : 'AI coding usage · Reset tracking'}
        </span>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            borderRadius: '999px',
            background: '#ffffff',
            color: '#111111',
            fontWeight: 600,
          }}
        >
          <span>
            {isTraditionalChinese
              ? '下載 macOS 版本'
              : 'Download for macOS'}
          </span>
        
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111111"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>,
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
