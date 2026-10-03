import { getStableRelease } from './release';
import type { ReleaseMetadata, SigningType } from './release-metadata';

// Decimal MB, one decimal place; the exact byte count is displayed separately.
export function formatArtifactSize(sizeBytes: number): string {
  if (!Number.isSafeInteger(sizeBytes) || sizeBytes <= 0) {
    throw new Error('Artifact size must be a positive safe integer');
  }
  return `${(sizeBytes / 1_000_000).toFixed(1)} MB`;
}

export function getReleasePresentation(release: ReleaseMetadata, locale: string) {
  const zh = locale === 'zh-TW';
  const signingLabels: Record<SigningType, string> = {
    unsigned: zh ? '未簽署' : 'Unsigned',
    'apple-development': 'Apple Development',
    'developer-id': 'Developer ID',
  };
  const channelLabel = release.channel === 'stable'
    ? (zh ? '穩定版' : 'Stable')
    : (zh ? '預覽版' : 'Preview');
  const signingLabel = signingLabels[release.signing.type];
  const signingStatus = zh
    ? `${signingLabel}${release.signing.type === 'unsigned' ? '' : ' 簽署'}`
    : `${signingLabel}${release.signing.type === 'unsigned' ? '' : ' signed'}`;
  const distributionSummary = zh
    ? `${signingStatus}；${release.signing.type === 'developer-id' ? '已使用' : '未使用'} Developer ID 簽署；${release.signing.codesignVerified ? '已通過' : '未通過'} codesign 驗證；${release.signing.notarized ? '已' : '未'}公證；${release.signing.stapled ? '有' : '無'} stapled ticket。`
    : `${signingStatus}; ${release.signing.type === 'developer-id' ? '' : 'not '}Developer ID signed; codesign ${release.signing.codesignVerified ? 'verified' : 'not verified'}; ${release.signing.notarized ? '' : 'not '}notarized; ${release.signing.stapled ? 'has a' : 'no'} stapled ticket.`;

  return {
    versionLabel: release.tag,
    name: `QuotaMew ${release.tag}`,
    channelLabel,
    headline: `QuotaMew ${release.tag} · ${channelLabel}`,
    downloadURL: release.artifact.downloadURL,
    releaseURL: release.releaseURL,
    filename: release.artifact.filename,
    size: formatArtifactSize(release.artifact.sizeBytes),
    sizeExact: `${release.artifact.sizeBytes.toLocaleString(zh ? 'zh-TW' : 'en-US')} ${zh ? '位元組' : 'bytes'}`,
    sha256: release.artifact.sha256,
    requirements: zh ? `macOS ${release.minimumMacOS} 或更新版本` : `macOS ${release.minimumMacOS} or later`,
    signingStatus,
    distributionSummary,
  };
}

export function getStableReleasePresentation(locale: string) {
  return getReleasePresentation(getStableRelease(), locale);
}
