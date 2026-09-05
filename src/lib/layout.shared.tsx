import { zhTW } from '@fumadocs/language/zh-tw';
import { uiTranslations } from 'fumadocs-ui/i18n';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { i18n, localizePath } from './i18n';
import {
  appName,
  docsRoute,
  productGitConfig,
} from './shared';

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .preset('zh-TW', zhTW())
  .add({
    en: {
      displayName: 'English',
    },
  });

export function baseOptions(locale: string): BaseLayoutProps {
  const isTraditionalChinese = locale === 'zh-TW';

  return {
    i18n: true,
    nav: {
      title: appName,
      url: localizePath(locale, '/'),
    },
    links: [
      {
        text: isTraditionalChinese ? '文件' : 'Docs',
        url: localizePath(locale, docsRoute),
        active: 'nested-url',
      },
      {
        text: isTraditionalChinese ? '下載' : 'Download',
        url: localizePath(locale, '/download'),
        active: 'nested-url',
      },
    ],
    githubUrl: `https://github.com/${productGitConfig.user}/${productGitConfig.repo}`,
  };
}