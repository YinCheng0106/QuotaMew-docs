import stableSnapshot from '../data/releases/stable.json';
import { validateReleaseMetadata } from './release-metadata';

// Validate at module evaluation so an invalid checked-in snapshot fails the build.
const stableRelease = validateReleaseMetadata(stableSnapshot, 'stable');

export function getStableRelease() {
  return stableRelease;
}
