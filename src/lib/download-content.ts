export const downloadContent = {
  en: {
    eyebrow: 'Download',
    title: 'Get QuotaMew for macOS.',
    description:
      'QuotaMew v0.2.0 RC.1 is the current Release Candidate for macOS. Download the verified RC.1 DMG below.',

    status: {
      beta: 'Beta',
      releaseCandidate: 'Release Candidate',
      stable: 'Stable',
      comingSoon: 'Public download unavailable',
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
      title: 'About the current Release Candidate',
      description:
        'The current Release Candidate is Apple Development signed, but it is not Developer ID signed or notarized for public distribution. macOS may therefore show a security warning the first time you open QuotaMew.',
      source:
        'Only download QuotaMew from this website or the official GitHub repository.',
      action:
        'You do not need to disable Gatekeeper or other system-wide macOS security features.',
      firstLaunch: {
        eyebrow: 'First Launch',
        title: 'macOS may block the current Release Candidate the first time.',
        description:
          'Because the current Release Candidate is not Developer ID signed or notarized for public distribution, macOS may require you to explicitly approve QuotaMew before it can open.',
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
            'Launch QuotaMew from Applications. macOS may ask for additional approval for the current Release Candidate.',
        },
      ],
    },

    release: {
      title: 'Release information',
      historicalNote:
        'The current public release is v0.2.0 RC.1, a Release Candidate. The DMG is Apple Development signed but not Developer ID signed or notarized; see the first-launch guidance before opening it.',
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
    title: '取得 macOS 版 QuotaMew。',
    description:
      'QuotaMew v0.2.0 RC.1 是目前公開提供的 macOS Release Candidate，請從下方下載已驗證的 RC.1 DMG。',

    status: {
      beta: 'Beta',
      releaseCandidate: 'Release Candidate',
      stable: '穩定版',
      comingSoon: '目前無法下載',
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
      title: '關於目前的 Release Candidate',
      description:
        '目前 Release Candidate 使用 Apple Development 簽署，但尚未使用 Developer ID 簽署或完成公開散布所需的公證，因此第一次開啟 QuotaMew 時，macOS 可能會顯示安全性警告。',
      source:
        '請只從本網站或 QuotaMew 官方 GitHub Repository 下載 QuotaMew。',
      action:
        '你不需要停用 Gatekeeper 或其他 macOS 全域安全性功能。',
      firstLaunch: {
        eyebrow: '首次啟動',
        title: 'macOS 第一次可能會阻擋目前的 Release Candidate。',
        description:
          '由於目前 Release Candidate 尚未使用 Developer ID 簽署或完成公開散布所需的公證，macOS 可能會要求你手動核准 QuotaMew 後才能開啟。',
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
            '從 Applications 啟動 QuotaMew。目前的 Release Candidate 可能需要額外的 macOS 安全性核准。',
        },
      ],
    },

    release: {
      title: '版本資訊',
      historicalNote:
        '目前公開版本為 v0.2.0 RC.1 Release Candidate。DMG 使用 Apple Development 簽署，但尚未使用 Developer ID 簽署或公證；開啟前請先閱讀首次啟動說明。',
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
