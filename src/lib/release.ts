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

  version: 'v0.2.0-beta.1',
  downloadUrl: 'https://github.com/YinCheng0106/QuotaPulse/releases/download/v0.2.0-beta.1/QuotaPulse-v0.2.0-beta.1.dmg',
  sha256: '96792f49495741fedacb6a519794dc10dba61708ae45fb052a9882d3a15e01fe',

  minimumMacOS: '14',

  developerIdSigned: false,
  notarized: false,
  autoUpdate: false,
};