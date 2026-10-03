import { getStableReleasePresentation } from '@/lib/release-presentation';

type Props = { locale: 'en' | 'zh-TW' };

export function StableReleaseName({ locale }: Props) {
  return <>{getStableReleasePresentation(locale).headline}</>;
}

export function StableReleaseDownload({ locale }: Props) {
  const release = getStableReleasePresentation(locale);
  return <a href={release.downloadURL}><code>{release.filename}</code></a>;
}

export function StableReleaseLink({ locale }: Props) {
  const release = getStableReleasePresentation(locale);
  return <a href={release.releaseURL}>{release.name} GitHub Release</a>;
}

export function StableRequirements({ locale }: Props) {
  return <>{getStableReleasePresentation(locale).requirements}</>;
}

export function StableDistribution({ locale }: Props) {
  return <>{getStableReleasePresentation(locale).distributionSummary}</>;
}
