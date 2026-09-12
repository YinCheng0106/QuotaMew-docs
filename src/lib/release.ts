export type ReleaseAvailability =
  | 'coming-soon'
  | 'available';

export type ReleaseChannel =
  | 'beta'
  | 'rc'
  | 'stable';

interface ReleaseConfig {
  channel: ReleaseChannel;
  availability: ReleaseAvailability;

  version: string | null;
  downloadUrl: string | null;
  sha256: string | null;

  minimumMacOS: string;

  developerIdSigned: boolean;
  notarized: boolean;
  autoUpdate: boolean;
}

export const releaseConfig: ReleaseConfig = {
  channel: 'rc',

  availability: 'available',

  version: 'v0.2.0-rc.1',
  downloadUrl: 'https://github.com/YinCheng0106/QuotaMew/releases/download/v0.2.0-rc.1/QuotaMew-v0.2.0-rc.1.dmg',
  sha256: 'abd91c8c845dc0b6b75f054927602e555d1b2d9b2ba4b3010a44afe8ac85f7c7',

  minimumMacOS: '14',

  developerIdSigned: false,
  notarized: false,
  autoUpdate: false,
};
