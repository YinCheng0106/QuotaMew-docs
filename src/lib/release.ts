import stableSnapshot from '../data/releases/stable.json';
import { previewSnapshot } from '../data/releases/preview';
import { validateReleaseMetadata } from './release-metadata';
import { compareTags } from './semver';

// Validate at module evaluation so an invalid checked-in snapshot fails the build.
const stableRelease = validateReleaseMetadata(stableSnapshot, 'stable');
const previewRelease = previewSnapshot === null ? null : validateReleaseMetadata(previewSnapshot, 'preview');

export function getPreviewRelease() {
  return previewRelease && compareTags(previewRelease.tag, stableRelease.tag) > 0 ? previewRelease : null;
}

export function getStableRelease() {
  return stableRelease;
}
