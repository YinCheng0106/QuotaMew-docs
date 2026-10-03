import { getStableReleasePresentation } from './release-presentation';

export const downloadContent = {
  en: {
    eyebrow: 'Download',
    title: 'Get QuotaMew for macOS.',

    status: {
      available: 'Available now',
    },

    actions: {
      download: 'Download for macOS',
      github: 'View GitHub Release',
      installation: 'Installation Guide',
    },

    requirements: {
      title: 'System Requirements',
      platform: 'Native macOS application',
    },

    security: {
      title: 'Distribution and first launch',
      source:
        'Only download QuotaMew from this website or the official GitHub repository.',
      action:
        'You do not need to disable Gatekeeper or other system-wide macOS security features.',
      firstLaunch: {
        eyebrow: 'First Launch',
        title: 'macOS may block QuotaMew the first time.',
        description:
          'If macOS blocks QuotaMew, use the individual app approval in System Settings → Privacy & Security → Open Anyway.',
        steps: [
          {
            title: 'Try to open QuotaMew',
            description:
              'Open QuotaMew from the Applications folder. macOS may display a security warning and prevent it from launching.',
          },
          {
            title: 'Open Privacy & Security',
            description:
              'Open System Settings and go to Privacy & Security.',
          },
          {
            title: 'Choose Open Anyway',
            description:
              'Find the message about QuotaMew in the Security section and choose Open Anyway.',
          },
          {
            title: 'Confirm the launch',
            description:
              'Confirm that you want to open QuotaMew. macOS may ask for Touch ID or your password.',
          },
        ],
        warning:
          'Do not disable Gatekeeper or other system-wide macOS security protections.',
        docs: 'Read the full First Launch guide',
      },
    },

    install: {
      eyebrow: 'Installation',
      title: 'Install in a few steps.',
      steps: [
        {
          title: 'Download the DMG',
          description:
            'Download the latest QuotaMew disk image from the official release.',
        },
        {
          title: 'Move QuotaMew to Applications',
          description:
            'Open the DMG and drag QuotaMew into the Applications folder.',
        },
        {
          title: 'Open QuotaMew',
          description:
            'Launch QuotaMew from Applications. macOS may ask for additional approval on first launch.',
        },
      ],
    },

    release: {
      title: 'Release information',
      version: 'Version',
      channel: 'Channel',
      compatibility: 'Compatibility',
      build: 'Build',
      artifact: 'Artifact',
      size: 'Download size',
      checksum: 'SHA256',
      signed: 'Signing',
      codesign: 'codesign verified',
      stapled: 'Stapled ticket',
      notarized: 'Apple notarized',
      automaticUpdates: 'Automatic updates',
      yes: 'Yes',
      no: 'No',
    },
  },

  'zh-TW': {
    eyebrow: '下載',
    title: '取得 macOS 版 QuotaMew。',

    status: {
      available: '目前可下載',
    },

    actions: {
      download: '下載 macOS 版本',
      github: '查看 GitHub Release',
      installation: '安裝指南',
    },

    requirements: {
      title: '系統需求',
      platform: '原生 macOS 應用程式',
    },

    security: {
      title: '散布與首次啟動',
      source:
        '請只從本網站或 QuotaMew 官方 GitHub Repository 下載 QuotaMew。',
      action:
        '你不需要停用 Gatekeeper 或其他 macOS 全域安全性功能。',
      firstLaunch: {
        eyebrow: '首次啟動',
        title: 'macOS 第一次可能會阻擋 QuotaMew。',
        description:
          '如果 macOS 阻擋 QuotaMew，請透過「系統設定」→「隱私權與安全性」→「仍要打開」（Open Anyway）核准個別 App。',
        steps: [
          {
            title: '嘗試開啟 QuotaMew',
            description:
              '從 Applications（應用程式）資料夾開啟 QuotaMew。macOS 可能會顯示安全性警告並阻止 App 啟動。',
          },
          {
            title: '開啟「隱私權與安全性」',
            description:
              '開啟「系統設定」，並前往「隱私權與安全性」。',
          },
          {
            title: '選擇「仍要打開」',
            description:
              '在安全性區段找到 QuotaMew 的相關訊息，並選擇「仍要打開」（Open Anyway）。',
          },
          {
            title: '確認開啟',
            description:
              '確認你要開啟 QuotaMew。macOS 可能會要求使用 Touch ID 或密碼進行驗證。',
          },
        ],
        warning:
          '請勿停用 Gatekeeper 或其他 macOS 全域安全性保護機制。',
        docs: '閱讀完整首次啟動指南',
      },
    },

    install: {
      eyebrow: '安裝',
      title: '幾個步驟即可完成安裝。',
      steps: [
        {
          title: '下載 DMG',
          description:
            '從 QuotaMew 官方 Release 下載最新的磁碟映像檔。',
        },
        {
          title: '將 QuotaMew 移至 Applications',
          description:
            '開啟 DMG，並將 QuotaMew 拖曳到 Applications（應用程式）資料夾。',
        },
        {
          title: '開啟 QuotaMew',
          description:
            '從 Applications 啟動 QuotaMew。首次啟動時可能需要額外的 macOS 安全性核准。',
        },
      ],
    },

    release: {
      title: '版本資訊',
      version: '版本',
      channel: '發布通道',
      compatibility: '相容性',
      build: '組建',
      artifact: '下載檔案',
      size: '檔案大小',
      checksum: 'SHA256',
      signed: '簽署方式',
      codesign: 'codesign 驗證通過',
      stapled: 'Stapled ticket',
      notarized: 'Apple 公證',
      automaticUpdates: '自動更新',
      yes: '是',
      no: '否',
    },
  },
} as const;

export function getDownloadContent(locale: string) {
  const content = downloadContent[locale === 'zh-TW' ? 'zh-TW' : 'en'];
  const release = getStableReleasePresentation(locale);
  return {
    ...content,
    description: locale === 'zh-TW'
      ? `${release.headline} 是目前公開提供的 macOS 版本。請從下方下載已驗證的 DMG。`
      : `${release.headline} is the current public release for macOS. Download the verified DMG below.`,
    requirements: { ...content.requirements, macOS: release.requirements },
    security: {
      ...content.security,
      description: `${release.distributionSummary} ${locale === 'zh-TW'
        ? 'macOS 第一次開啟時可能會顯示安全性警告。'
        : 'macOS may show a security warning on first launch.'}`,
    },
  };
}
