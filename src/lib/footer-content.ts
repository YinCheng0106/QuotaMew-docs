import { localizePath } from './i18n';
import { getStableReleasePresentation } from './release-presentation';
import { productGitConfig } from './shared';

export function getFooterContent(locale: string) {
  const zh = locale === 'zh-TW';
  const github = `https://github.com/${productGitConfig.user}/${productGitConfig.repo}`;
  return {
    label: zh ? '網站導覽' : 'Site navigation',
    summary: zh ? '原生 macOS 額度工具。免費、開放原始碼、無遙測。' : 'A native macOS quota utility. Free, open source, no telemetry.',
    release: getStableReleasePresentation(locale),
    links: [
      { label: zh ? '文件' : 'Documentation', href: localizePath(locale, '/docs') },
      { label: zh ? '下載' : 'Download', href: localizePath(locale, '/download') },
      { label: zh ? '隱私權' : 'Privacy', href: localizePath(locale, '/docs/privacy') },
      { label: 'GitHub', href: github },
      { label: zh ? '發行紀錄' : 'Releases', href: `${github}/releases` },
    ],
  };
}
