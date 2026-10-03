import { getStableReleasePresentation } from './release-presentation';

export const homeContent = {
  en: {
    hero: {
      badge: 'Native macOS menu bar app',
      title: 'Your AI coding quota, at a glance.',
      description: 'A native macOS menu-bar monitor for AI coding quota. Keep Codex limits and reset times visible while you work.',
      download: 'Download Stable',
      docs: 'Read the Docs',
    },
    features: {
      eyebrow: 'Why QuotaMew',
      title: 'Keep quota close to your work.',
      items: [
        { title: 'Native macOS', description: 'Open a small menu-bar dashboard without adding another workspace.' },
        { title: 'At a glance', description: 'See quota and reset countdowns without repeatedly opening provider interfaces.' },
        { title: 'Your preferred display', description: 'Choose Remaining or Used, and a Single or Overview menu-bar display.' },
        { title: 'Local-first', description: 'Local settings, no telemetry, and no QuotaMew account or cloud sync.' },
      ],
    },
    monitoring: {
      eyebrow: 'What you can monitor',
      title: 'Quota windows, not billing estimates.',
      description: 'See 5-hour and Weekly limits when reported by the provider, plus Luna Reserve when available. QuotaMew displays provider data; it does not change your limits or activate Reserve.',
      items: [
        { title: 'Menu-bar choices', description: 'Pin a provider and select one quota in Single mode, or show regular windows together in Overview.' },
        { title: 'Reset reminders', description: 'Optional local notifications use fresh quota data to remind you before a reset or when a reset is detected.' },
      ],
      link: 'Explore menu-bar display and settings',
    },
    providers: {
      eyebrow: 'Supported providers',
      title: 'Start with Codex.',
      codex: { name: 'Codex', status: 'Supported', description: 'Uses a compatible local Codex runtime, including supported packaged ChatGPT / Codex Desktop runtimes. Codex manages sign-in.' },
      claude: { name: 'Claude Code', status: 'Experimental / Unverified', description: 'A limited local snapshot reader. Bridge setup and live subscribed-account validation are not complete; installing Claude alone does not enable quota monitoring.' },
      link: 'Provider prerequisites and compatibility',
    },
    trust: {
      title: 'Quota metadata, with clear data boundaries.',
      description: 'No telemetry or advertising analytics. Stable quota monitoring does not collect prompts or source code. Settings and bounded notification state stay on your Mac; the provider runtime manages its own network access.',
      link: 'Read the privacy details',
    },
    installation: {
      title: 'Install, then look in the menu bar.',
      description: 'Move QuotaMew from the DMG to Applications. macOS may require individual app approval on first launch. Onboarding introduces display preferences; it does not install or sign in to a provider.',
      link: 'Installation and first-launch guidance',
    },
    openSource: {
      eyebrow: 'Documentation & source',
      title: 'Free and open source.',
      description: 'Use the guides to get started, or visit GitHub for source code, release notes and issue reports.',
      github: 'View QuotaMew on GitHub',
    },
  },
  'zh-TW': {
    hero: {
      badge: '原生 macOS 選單列 App',
      title: '一眼掌握你的 AI 程式開發額度。',
      description: '在 macOS 選單列查看 AI 程式開發工具的額度，讓 Codex 限制與重置時間隨時可見。',
      download: '下載穩定版',
      docs: '閱讀文件',
    },
    features: {
      eyebrow: '為什麼選擇 QuotaMew',
      title: '工作時，額度資訊就在手邊。',
      items: [
        { title: '原生 macOS', description: '從選單列開啟精簡的額度面板，不需要多一個工作視窗。' },
        { title: '一眼掌握', description: '直接查看額度與重置倒數，省下反覆開啟開發工具介面的步驟。' },
        { title: '依你的習慣顯示', description: '選擇「剩餘」或「已使用」，搭配 Single 或 Overview 選單列模式。' },
        { title: '本機優先', description: '設定保存在本機，無遙測，也不需要 QuotaMew 帳號或雲端同步。' },
      ],
    },
    monitoring: {
      eyebrow: '可以查看哪些資訊',
      title: '掌握額度視窗與重置時間。',
      description: '依 Provider 提供的資料，查看 5 小時、每週額度，以及可用時的 Luna Reserve。QuotaMew 只呈現額度，不會變更限制或啟用 Reserve。',
      items: [
        { title: '選單列顯示選擇', description: '固定顯示一個 Provider，在 Single 選擇單一額度，或透過 Overview 一起查看一般額度視窗。' },
        { title: '重置提醒', description: '選用的本機通知會依據新鮮額度資料，在重置前提醒，或在偵測到重置後通知。' },
      ],
      link: '了解選單列顯示與設定',
    },
    providers: {
      eyebrow: '支援的 Provider',
      title: '從 Codex 開始。',
      codex: { name: 'Codex', status: '已支援', description: '透過相容的本機 Codex runtime 取得資料，包含支援的 ChatGPT／Codex Desktop 內附 runtime；登入由 Codex 自行處理。' },
      claude: { name: 'Claude Code', status: '實驗性／未驗證', description: '目前只有有限的本機 snapshot 讀取功能。橋接設定與真實訂閱帳號驗證尚未完成；只安裝 Claude 並不會啟用額度監控。' },
      link: '查看 Provider 前置需求與相容性',
    },
    trust: {
      title: '專注額度資訊，清楚說明資料邊界。',
      description: '無遙測、無廣告分析。穩定版額度監控不收集提示詞或原始碼；設定與有限的通知狀態保存在你的 Mac。Provider runtime 的網路通訊由該工具負責。',
      link: '閱讀完整隱私說明',
    },
    installation: {
      title: '安裝後，到選單列開始使用。',
      description: '將 DMG 內的 QuotaMew 移至 Applications。首次啟動可能需要 macOS 個別 App 核准。Onboarding 會介紹顯示偏好，不會替你安裝 Provider 或登入。',
      link: '查看安裝與首次啟動指南',
    },
    openSource: {
      eyebrow: '文件與原始碼',
      title: '免費、開放原始碼。',
      description: '透過文件開始使用，或前往 GitHub 查看原始碼、發行說明與回報問題。',
      github: '前往 QuotaMew GitHub',
    },
  },
} as const;

export type HomeLocale = keyof typeof homeContent;

export function getHomeContent(locale: string) {
  const content = homeContent[locale === 'zh-TW' ? 'zh-TW' : 'en'];
  return {
    ...content,
    hero: { ...content.hero, release: getStableReleasePresentation(locale).headline },
  };
}
