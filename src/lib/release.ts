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

  version: 'v0.2.0-beta.2',
  downloadUrl: 'https://github.com/YinCheng0106/QuotaMew/releases/download/v0.2.0-beta.2/QuotaMew-v0.2.0-beta.2.dmg',
  sha256: 'c3b40ab35f095479382248641358258c169bc84af21990a043d8095e504a3642',

  minimumMacOS: '14',

  developerIdSigned: false,
  notarized: false,
  autoUpdate: false,
};