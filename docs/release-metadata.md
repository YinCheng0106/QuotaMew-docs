# Release metadata — snapshots and synchronization

`src/data/releases/stable.json` is the website's checked-in, verified
last-known-good Stable snapshot. It is **not** an app release manifest asset.
`src/lib/release.ts` imports it once and exposes `getStableRelease()`; pages must
not import or parse the JSON themselves. Validation throws during module
evaluation, so malformed data fails static generation/build without a fallback.

## Data contract and ownership

`ReleaseMetadata` has schema version 1, a `stable | preview` channel, tag/version,
build, optional UTC `publishedAt`, release URL, minimum macOS, bundle ID, artifact
filename/download URL/byte size/SHA256, and signing type/codesign verification/
notarization/stapling facts. The Stable loader requires the `stable` channel and
a final version. URLs must address the official QuotaMew GitHub tag and DMG.

These release facts are data-owned (eventually machine-managed), never embedded
in live presentation copy. `release-presentation.ts` derives localized labels,
decimal MB (one decimal place), exact bytes, and signing summaries. MDX uses the
`StableReleaseName`, `StableReleaseDownload`, `StableReleaseLink`,
`StableRequirements`, and `StableDistribution` components. Keep frontend labels,
installation steps, provider capability descriptions, automatic-update
availability, and README summaries curated. README is manually maintained and
must be reviewed when Stable changes; do not generate it.

The out-of-band synchronization tool joins GitHub facts with a versioned app
manifest. Website modules never import synchronization tooling. The optional
Preview channel is represented by `src/data/releases/preview.ts`: `null` means
absent; a validated full object means present. This avoids filesystem discovery
in website runtime code. No Preview UI is exposed.

## Snapshot provenance

Stable facts were supplied by the completed release verification in this task:
[v0.2.0 Release](https://github.com/YinCheng0106/QuotaMew/releases/tag/v0.2.0),
tag `v0.2.0`, app commit `3a63921fced7ed7fd68b4ddbc9c5b09e8c97be95`, version
`0.2.0`, build `5`, bundle ID `dev.quotapulse.app`, artifact
`QuotaMew-v0.2.0.dmg`, 2,663,814 bytes, and its exact SHA256 in the snapshot.
Distribution is Apple Development signed and codesign verified, without
Developer ID signing, notarization, or a stapled ticket. Minimum macOS `14`
matches the pre-existing release configuration and both installation/FAQ guides.
The application checkout was not inspected or changed. No publication timestamp
was supplied, so `publishedAt` is omitted rather than guessed.

## Current-release inventory

| Classification | Surfaces at initial docs HEAD `e0489d8` | Treatment |
| --- | --- | --- |
| CURRENT DYNAMIC FACT | `src/lib/release.ts`: channel, tag, DMG URL, checksum, minimum macOS, distribution flags | Replaced by validated snapshot/accessor |
| CURRENT DYNAMIC FACT | `home-content.ts`, `download-content.ts`, Download page: version/RC badge/current release text | Derived presentation; no current literals |
| CURRENT DYNAMIC FACT | Both overview, installation, first-launch, updating, FAQ, troubleshooting MDX: current version/download/distribution/minimum macOS | Shared MDX components |
| CURRENT DYNAMIC FACT | Both menu-bar frontmatter descriptions: current RC.1 version | Evergreen descriptions |
| CURATED COPY | Both READMEs: current release summary and link; install/Gatekeeper steps; capabilities; update availability | Narrow Stable correction; README remains manual |
| HISTORICAL RECORD | No dedicated Beta/RC history in the checked-out public content | Git history unchanged; original RC.1 config values captured in `tests/fixtures/historical-rc1.json`, never served as Stable |
| UNRELATED | Provider copy, screenshots, generic `.dmg` references, Beta contribution guidance | Retained |

No current release date or asset size existed in the old presentation. Remaining
literal versions/URLs are intentional: canonical snapshot, verification tests,
historical test fixture, this provenance/inventory, and curated README summaries.
Historical Beta naming, RC.1/RC.2 artifacts/checksums/dates in Git history are not
rewritten by this migration. Do not globally replace prerelease strings.

## Verification

Run `bun run test`, `bun run lint`, `bun run types:check`, and `bun run build`.
The tests use Bun and Node's built-in test/assert APIs; no added dependencies.
Tests cover invalid metadata, localized presentation, exact checksum/bytes,
historical fixture isolation, current literal/v0.3 safeguards, and offline access.

Phase 1 local production smoke verified both languages' generated HTML, plus live
Traditional Chinese homepage/Download (including light/dark and narrow checksum
wrapping). English HTTP navigation encountered a locale redirect loop with the
unchanged proxy/i18n configuration; this is not full browser acceptance. Routing
repair is outside this release-data migration and should be checked before deployment.

The subsequent routing baseline fixes that English redirect loop. Routing tests
remain part of every sync PR validation.

## Manifest v1: application release responsibility

Upload exactly one **`quotamew-release-manifest.json`** alongside the intended
DMG. The filename is constant because the Release supplies version scope.
`scripts/releases/contract.ts` defines `ReleaseManifest` and its executable
validator. All fields below are required; unknown fields and schema versions
are rejected. Deploy support for a future schema before publishing manifests
using it. Do not reinterpret newer schemas as v1.

```json
{
  "schemaVersion": 1,
  "tag": "v0.3.0-beta.1",
  "version": "0.3.0-beta.1",
  "build": 6,
  "channel": "preview",
  "minimumMacOS": "14",
  "bundleID": "dev.quotapulse.app",
  "artifact": { "filename": "QuotaMew-v0.3.0-beta.1.dmg" },
  "signing": {
    "type": "apple-development",
    "codesignVerified": true,
    "notarized": false,
    "stapled": false
  }
}
```

This is a **contract example, not a published release or verified future build**.
The app release flow must derive the actual build, platform and signing facts
from its built artifact and verification results. Build is a nonnegative safe
integer; signing type is `unsigned`, `apple-development`, or `developer-id`.
Boolean verification fields must reflect performed checks. Stapling requires
notarization; unsigned artifacts cannot claim codesign verification/notarization.
The app-side generator is outside this repository and this phase.

GitHub owns `releaseURL`, `publishedAt`, draft/prerelease flags and the asset's
download URL, positive byte size and SHA256 digest. The manifest owns schema,
tag/version/channel identity, build, minimum macOS, bundle ID, intended filename
and signing verification facts. Marketing, feature lists, release notes, website
copy, updater policy and duplicate GitHub URL/size/digest fields are prohibited.
The snapshot's existing tag and canonical URLs encode repository provenance;
there are no sync timestamps or workflow IDs causing churn.

Future automatic releases require a manifest and a GitHub `sha256:` digest.
The Phase 1 snapshot requires a checksum: absent GitHub digest is rejected
rather than inventing one or expanding the manifest contract. Tag, version,
channel and filename must agree between sources; there is no precedence rule
that tolerates a conflict.

## Bootstrap and channel resolution

Only checked-in verified Stable `v0.2.0`, matched by remote latest `v0.2.0`, has
the grandfathered exception. Compare GitHub URL, filename, download URL, byte
size and digest (when provided) against that snapshot; retain all existing app
facts and its omitted publication date. Never attach a manifest to that release
or guess missing build/signing facts. A mismatch fails synchronization.

Stable discovery calls the documented `/repos/YinCheng0106/QuotaMew/releases/latest`.
Reject drafts, prereleases, malformed tags, missing/ambiguous DMGs and downgrades.
Future Stable must pass manifest validation before replacing its snapshot.

Preview lists `/releases?per_page=100&page=N` until a short page. A 100-page
safety cap fails discovery rather than declaring incomplete results complete.
Filter drafts/final releases and versions not newer than resolved Stable,
validate remaining releases and manifests, then choose the highest valid
SemVer. Alpha, beta and RC are all `preview`; preserve their full tags. Core and
numeric prerelease components compare numerically (BigInt), textual identifiers
compare ASCII, shorter prerelease sequences sort first, and final versions sort
above prereleases of the same core. Leading zeros, malformed suffixes and build
metadata are not accepted QuotaMew tags. Old `v0.2.0-rc.2` is below `v0.2.0`.

Exactly one DMG is allowed, named `QuotaMew-<tag>.dmg`. Extra DMGs are ambiguous,
even if one matches. Canonical HTTPS GitHub repository/tag paths are required;
credentials, query strings, redirects expressed as asset URLs, other hosts or
repositories are rejected. The manifest must occur at most once and be at most
64 KiB. API JSON is bounded to 4 MiB with a 20-second request timeout.

The small client lives exclusively under `scripts/releases/`. It uses the
documented JSON API, no HTML scraping, and downloads manifest assets by ID with
`Accept: application/octet-stream`. Manifest bytes are checked against the
manifest asset digest when GitHub supplies one. Optional `GITHUB_TOKEN` (or
`GH_TOKEN`) authenticates API requests; public local discovery needs no token. Response
bodies, authorization headers and credentials are never logged. Official API
contracts: [releases](https://docs.github.com/en/rest/releases/releases) and
[assets](https://docs.github.com/en/rest/releases/assets).

## CLI, deterministic snapshots and failure policy

```sh
bun run release:sync
bun run release:sync --dry-run
bun run release:sync --check
bun run release:sync --dry-run --fixture /path/to/sanitized-source.json
```

`--dry-run` reports current/candidate tags, rejection reasons and would-change
status without writes. `--check` also exits 1 if a valid snapshot diff exists.
Fixture JSON has `latest`, `releases`, and `manifests` keyed by manifest asset ID;
fixtures never invoke GitHub. Normal sync writes only changed, fully validated
candidates with fixed key ordering, two-space JSON formatting and no timestamps.

Fetch and resolve both channels before any write. Stage files in the same
directory using exclusive temporary names, then rename atomically per file.
On a later rename error, restore already replaced originals and clean temporary
files. This is file-level atomicity, not crash-atomicity across two files; an
abrupt process/filesystem failure may require restoring from Git. Workflow
validation must succeed before any commit/PR. GitHub/API/list failures or invalid
Stable leave snapshots untouched. Invalid individual newer Previews are reported
and skipped independently; they never clear a previous Preview or contaminate
Stable. A failed Preview manifest request is treated as a rejected candidate.

Last-known-good snapshots persist when releases disappear, manifests break or
only older candidates remain. Never automatically clear a channel. Withdrawn or
bad releases require a manually reviewed snapshot correction/removal. The
website validates both local snapshots; `getPreviewRelease()` returns null for
absence or a retained Preview overtaken by Stable, without deleting that snapshot.
`getStableRelease()` always supplies the primary CTA. Future Preview UI must be
a secondary explicit opt-in; this phase changes no public content or install flow.

## Synchronization workflow and review boundary

`.github/workflows/release-sync.yml` supports `workflow_dispatch` and one weekly
Monday run at 06:17 UTC (14:17 Taiwan), avoiding aggressive polling. Only runs on
the repository default branch. Uses the supplied Actions token and explicit
`contents: write` / `pull-requests: write` for the snapshot branch and PR; no
actions/packages/OIDC write permissions. Repository Actions settings must allow
GitHub Actions to create pull requests. No new PAT or long-lived secret required.

Run sync, tests, lint, typecheck, build and diff checks. No snapshot diff means no
commit or PR. Changed snapshots use `automation/release-snapshots`, an explicit
file allowlist and a Conventional Commit. GitHub CLI creates or updates one PR
with Stable/Preview changes and validation results; branch replacement uses an
explicit remote-SHA lease. It neither merges nor deploys. A token-created PR may
not trigger other Actions workflows; this workflow performs validation itself.
The remote workflow is not executed during local implementation verification.

Application Release events are cross-repository and are not wired here. A future
app release workflow may dispatch docs synchronization after a secure authorized
mechanism exists; initial manual/weekly runs are sufficient.

## Local-only website/build proof

`pages -> release.ts -> checked-in snapshots/validators` has no tool/client import.
Tests forbid release-tool/GitHub-client imports anywhere in `src`, exercise both
accessors with fetch disabled, and cover sanitized release fixtures, pagination,
bootstrap, source conflicts, malformed metadata, dry-run, idempotency and failure
retention. Bootstrap verification is an immutable fixture, allowing later valid
snapshot PRs to pass tests rather than pinning the website forever to v0.2.0.

For a normal production build with release HTTP access forbidden (no sync step):

```sh
env -u GITHUB_TOKEN -u GH_TOKEN \
  NODE_OPTIONS="--require=$PWD/scripts/deny-release-network.cjs" bun run build
```

This preload rejects GitHub/API/release-asset hosts in Node fetch/http/https and
inherits into build workers. It demonstrates the release metadata boundary; it
does not claim all build tooling is network-isolated at the OS level. GitHub
availability never determines website rendering or ordinary build availability.
