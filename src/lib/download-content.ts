import { getStableReleasePresentation } from './release-presentation';

export const downloadContent = {
  en: {
    eyebrow: 'Download',
    title: 'Get QuotaMew for macOS.',
    actions: { github: 'View Stable GitHub Release', installation: 'Installation guide', firstLaunch: 'Full first-launch guide', history: 'Browse all GitHub Releases' },
    requirements: { title: 'System requirements', platform: 'Native macOS application' },
    release: {
      title: 'Stable download', version: 'Version', channel: 'Channel', compatibility: 'Minimum macOS',
      artifact: 'Artifact', size: 'Download size', build: 'Build', checksum: 'SHA256',
      signed: 'Signing', codesign: 'codesign verified', stapled: 'Stapled ticket', notarized: 'Apple notarized',
      developerID: 'Developer ID signed', yes: 'Yes', no: 'No',
    },
    verification: { title: 'Verify the artifact', description: 'Optional technical details for checking the downloaded DMG. The checksum identifies the release artifact; it does not replace your trust in the download source.' },
    security: {
      title: 'Installation and first launch',
      source: 'Download from this site or the official GitHub Release. Open the DMG, move QuotaMew to Applications, then launch it from there.',
      action: 'If macOS blocks first launch, use System Settings → Privacy & Security → Open Anyway only if you trust the source. Keep macOS security protections enabled.',
      expectation: 'QuotaMew appears in the menu bar. Onboarding explains display preferences; Codex must already have a compatible local runtime and its own sign-in.',
    },
    channels: {
      title: 'Release channels and updates',
      stable: 'Stable is the recommended release and always the primary download.',
      preview: 'Preview builds, when available, are optional prereleases with less testing and behavior that may change. A separate download appears only when a newer verified Preview exists.',
      updates: 'Updates are installed manually: quit QuotaMew and replace the app in Applications with the new official download.',
      history: 'GitHub Releases is the authoritative history for notes and artifacts. Older QuotaPulse-named and prerelease entries remain historical records.',
    },
  },
  'zh-TW': {
    eyebrow: '下載',
    title: '取得 macOS 版 QuotaMew。',
    actions: { github: '查看穩定版 GitHub Release', installation: '安裝指南', firstLaunch: '完整首次啟動指南', history: '查看完整 GitHub 發行紀錄' },
    requirements: { title: '系統需求', platform: '原生 macOS 應用程式' },
    release: {
      title: '穩定版下載', version: '版本', channel: '發布通道', compatibility: '最低 macOS 版本',
      artifact: '下載檔案', size: '檔案大小', build: '組建', checksum: 'SHA256',
      signed: '簽署方式', codesign: 'codesign 驗證通過', stapled: 'Stapled ticket', notarized: 'Apple 公證',
      developerID: 'Developer ID 簽署', yes: '是', no: '否',
    },
    verification: { title: '驗證下載檔案', description: '以下技術資訊可用來核對 DMG，屬於選用步驟。校驗碼可辨識發行檔案，不能取代你對下載來源的確認。' },
    security: {
      title: '安裝與首次啟動',
      source: '請從本網站或官方 GitHub Release 下載。開啟 DMG，將 QuotaMew 移至 Applications（應用程式），再從該資料夾啟動。',
      action: '若 macOS 阻擋首次啟動，請確認來源可信後，透過「系統設定 → 隱私權與安全性 → 仍要打開」核准個別 App，並保持系統安全性保護啟用。',
      expectation: 'QuotaMew 會出現在選單列。Onboarding 會介紹顯示偏好；Codex 仍需有相容的本機 runtime，並完成自己的登入。',
    },
    channels: {
      title: '發布通道與更新',
      stable: '穩定版是建議的一般使用版本，也始終是主要下載項目。',
      preview: '預覽版是選用的預先發行版本，測試可能較少，內容也可能變動。只有存在較新的已驗證預覽版時，才會另外顯示下載項目。',
      updates: '目前採手動更新：先退出 QuotaMew，再以官方下載的新版取代 Applications 裡的 App。',
      history: 'GitHub Releases 提供正式的發行說明與下載檔案。舊有 QuotaPulse 名稱及預先發行版本會保留為歷史紀錄。',
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
    security: { ...content.security, description: release.distributionSummary },
  };
}
