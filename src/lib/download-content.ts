export const downloadContent = {
  en: {
    eyebrow: 'Download',
    title: 'Get QuotaPulse for macOS.',
    description:
      'QuotaPulse is currently distributed as a beta macOS app. Public downloadable builds will be provided here when they are ready.',

    status: {
      beta: 'Beta',
      comingSoon: 'Public download coming soon',
      available: 'Available now',
    },

    actions: {
      download: 'Download for macOS',
      github: 'View GitHub Releases',
      installation: 'Installation Guide',
    },

    requirements: {
      title: 'System Requirements',
      macOS: 'macOS 14 or later',
      platform: 'Native macOS application',
    },

    security: {
      title: 'About the current Beta',
      description:
        'Current beta builds are not signed and notarized with an Apple Developer ID. macOS may therefore show a security warning the first time you open QuotaPulse.',
      source:
        'Only download QuotaPulse from this website or the official GitHub repository.',
      action:
        'You do not need to disable Gatekeeper or other system-wide macOS security features.',
      firstLaunch: {
        eyebrow: 'First Launch',
        title: 'macOS may block the current beta the first time.',
        description:
          'Because the current beta is not signed and notarized with an Apple Developer ID, macOS may require you to explicitly approve QuotaPulse before it can open.',
        steps: [
          {
            title: 'Try to open QuotaPulse',
            description:
              'Open QuotaPulse from the Applications folder. macOS may display a security warning and prevent it from launching.',
          },
          {
            title: 'Open Privacy & Security',
            description:
              'Open System Settings and go to Privacy & Security.',
          },
          {
            title: 'Choose Open Anyway',
            description:
              'Find the message about QuotaPulse in the Security section and choose Open Anyway.',
          },
          {
            title: 'Confirm the launch',
            description:
              'Confirm that you want to open QuotaPulse. macOS may ask for Touch ID or your password.',
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
            'Download the latest QuotaPulse disk image from the official release.',
        },
        {
          title: 'Move QuotaPulse to Applications',
          description:
            'Open the DMG and drag QuotaPulse into the Applications folder.',
        },
        {
          title: 'Open QuotaPulse',
          description:
            'Launch QuotaPulse from Applications. macOS may ask for additional approval for the current beta.',
        },
      ],
    },

    release: {
      title: 'Release information',
      version: 'Version',
      channel: 'Channel',
      compatibility: 'Compatibility',
      signed: 'Developer ID signed',
      notarized: 'Apple notarized',
      automaticUpdates: 'Automatic updates',
      yes: 'Yes',
      no: 'No',
      notPublished: 'Not published yet',
    },
  },

  'zh-TW': {
    eyebrow: '下載',
    title: '取得 macOS 版 QuotaPulse。',
    description:
      'QuotaPulse 目前以 macOS Beta 應用程式形式提供。當公開測試版本準備完成後，將會在這裡提供下載。',

    status: {
      beta: 'Beta',
      comingSoon: '公開下載即將推出',
      available: '目前可下載',
    },

    actions: {
      download: '下載 macOS 版本',
      github: '查看 GitHub Releases',
      installation: '安裝指南',
    },

    requirements: {
      title: '系統需求',
      macOS: 'macOS 14 或更新版本',
      platform: '原生 macOS 應用程式',
    },

    security: {
      title: '關於目前的 Beta 版本',
      description:
        '目前的 Beta 尚未使用 Apple Developer ID 完成簽署與公證，因此第一次開啟 QuotaPulse 時，macOS 可能會顯示安全性警告。',
      source:
        '請只從本網站或 QuotaPulse 官方 GitHub Repository 下載 QuotaPulse。',
      action:
        '你不需要停用 Gatekeeper 或其他 macOS 全域安全性功能。',
      firstLaunch: {
        eyebrow: '首次啟動',
        title: 'macOS 第一次可能會阻擋目前的 Beta 版本。',
        description:
          '由於目前的 Beta 尚未使用 Apple Developer ID 完成簽署與公證，macOS 可能會要求你手動核准 QuotaPulse 後才能開啟。',
        steps: [
          {
            title: '嘗試開啟 QuotaPulse',
            description:
              '從 Applications（應用程式）資料夾開啟 QuotaPulse。macOS 可能會顯示安全性警告並阻止 App 啟動。',
          },
          {
            title: '開啟「隱私權與安全性」',
            description:
              '開啟「系統設定」，並前往「隱私權與安全性」。',
          },
          {
            title: '選擇「仍要打開」',
            description:
              '在安全性區段找到 QuotaPulse 的相關訊息，並選擇「仍要打開」（Open Anyway）。',
          },
          {
            title: '確認開啟',
            description:
              '確認你要開啟 QuotaPulse。macOS 可能會要求使用 Touch ID 或密碼進行驗證。',
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
            '從 QuotaPulse 官方 Release 下載最新的磁碟映像檔。',
        },
        {
          title: '將 QuotaPulse 移至 Applications',
          description:
            '開啟 DMG，並將 QuotaPulse 拖曳到 Applications（應用程式）資料夾。',
        },
        {
          title: '開啟 QuotaPulse',
          description:
            '從 Applications 啟動 QuotaPulse。目前的 Beta 版本可能需要額外的 macOS 安全性核准。',
        },
      ],
    },

    release: {
      title: '版本資訊',
      version: '版本',
      channel: '發布通道',
      compatibility: '相容性',
      signed: 'Developer ID 簽署',
      notarized: 'Apple 公證',
      automaticUpdates: '自動更新',
      yes: '是',
      no: '否',
      notPublished: '尚未公開發布',
    },
  },
} as const;

export function getDownloadContent(locale: string) {
  return downloadContent[
    locale === 'zh-TW' ? 'zh-TW' : 'en'
  ];
}