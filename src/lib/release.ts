export type ReleaseAvailability =
  | 'coming-soon'
  | 'available';

export type ReleaseChannel =
  | 'beta'
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
  channel: 'beta',

  availability: 'available',

  version: 'v0.2.0-beta.3',
  downloadUrl: 'https://github.com/YinCheng0106/QuotaMew/releases/download/v0.2.0-beta.3/QuotaMew-v0.2.0-beta.3.dmg',
  sha256: '821ca9ab13da169e612da3d922176bfaf79400db05e5f703ed0933fe9e003b5a',

  minimumMacOS: '14',

  developerIdSigned: false,
  notarized: false,
  autoUpdate: false,
};