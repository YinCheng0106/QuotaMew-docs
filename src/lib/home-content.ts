export const homeContent = {
  en: {
    hero: {
      badge: 'Native macOS menu bar app',
      title: 'Your AI coding quota, at a glance.',
      description:
        'A lightweight native macOS menu bar app for monitoring AI coding usage and reset times.',
      download: 'Download for macOS',
      docs: 'Read the Docs',
    },

    features: {
      eyebrow: 'Why QuotaMew',
      title: 'Stay aware without breaking your flow.',
      items: [
        {
          title: 'Usage at a glance',
          description:
            'See your coding usage directly from the macOS menu bar.',
        },
        {
          title: 'Reset countdowns',
          description:
            'Know when your quota resets without repeatedly checking provider apps.',
        },
        {
          title: 'Local notifications',
          description:
            'Get useful reminders around important usage and reset thresholds.',
        },
        {
          title: 'Privacy-first',
          description:
            'Keep QuotaMew lightweight with local-first processing and minimal data access.',
        },
      ],
    },

    providers: {
      eyebrow: 'Providers',
      title: 'Built around the tools you use.',
      codex: {
        name: 'Codex',
        status: 'Supported',
        description:
          'Validated integration for compatible Codex runtimes on macOS.',
      },
      claude: {
        name: 'Claude Code',
        status: 'Experimental',
        description:
          'Integration is available and remains experimental while real-world validation continues.',
      },
    },

    macOS: {
      eyebrow: 'Built for macOS',
      title: 'A native utility, not another dashboard.',
      items: [
        {
          title: 'Native macOS',
          description: 'Built with Swift and SwiftUI.',
        },
        {
          title: 'Lightweight',
          description:
            'Designed to stay out of the way while you work.',
        },
        {
          title: 'Local-first',
          description:
            'No QuotaMew account or cloud sync is required.',
        },
      ],
    },

    openSource: {
      eyebrow: 'Open Source',
      title: 'Built openly.',
      description:
        'QuotaMew is free and open source. Explore the code, report issues, or contribute on GitHub.',
      github: 'View QuotaMew on GitHub',
    },
  },

  'zh-TW': {
    hero: {
      badge: '原生 macOS 選單列應用程式',
      title: '一眼掌握你的 AI 程式開發額度。',
      description:
        '輕量的原生 macOS 選單列應用程式，讓你快速查看 AI 程式開發工具的使用量與重置時間。',
      download: '下載 macOS 版本',
      docs: '閱讀文件',
    },

    features: {
      eyebrow: '為什麼選擇 QuotaMew',
      title: '掌握使用狀態，不打斷你的工作流程。',
      items: [
        {
          title: '快速掌握使用量',
          description:
            '直接從 macOS 選單列查看程式開發工具的使用狀態。',
        },
        {
          title: '重置時間倒數',
          description:
            '快速掌握額度重置時間，不需要反覆開啟 Provider 應用程式查看。',
        },
        {
          title: '本機通知',
          description:
            '在重要的使用量與重置時間點收到實用的本機提醒。',
        },
        {
          title: '隱私優先',
          description:
            '以本機處理與最小化資料存取為核心，維持輕量且透明的使用方式。',
        },
      ],
    },

    providers: {
      eyebrow: '支援的 Provider',
      title: '支援你正在使用的開發工具。',
      codex: {
        name: 'Codex',
        status: '已支援',
        description:
          '已針對 macOS 上相容的 Codex runtime 完成整合驗證。',
      },
      claude: {
        name: 'Claude Code',
        status: '實驗性',
        description:
          '目前已有整合功能，但仍在持續進行實際帳號與環境驗證。',
      },
    },

    macOS: {
      eyebrow: '專為 macOS 打造',
      title: '原生工具，而不是另一個複雜的 Dashboard。',
      items: [
        {
          title: '原生 macOS',
          description: '使用 Swift 與 SwiftUI 打造。',
        },
        {
          title: '輕量',
          description:
            '設計成在背景安靜運作，不干擾你的工作流程。',
        },
        {
          title: '本機優先',
          description:
            '不需要 QuotaMew 帳號或 Cloud Sync。',
        },
      ],
    },

    openSource: {
      eyebrow: 'Open Source',
      title: '開放原始碼。',
      description:
        'QuotaMew 是免費且開源的專案。你可以在 GitHub 查看原始碼、回報問題或參與貢獻。',
      github: '前往 QuotaMew GitHub',
    },
  },
} as const;

export type HomeLocale = keyof typeof homeContent;

export function getHomeContent(locale: string) {
  return homeContent[locale === 'zh-TW' ? 'zh-TW' : 'en'];
}
