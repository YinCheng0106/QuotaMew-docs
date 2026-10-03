# Release metadata — Phase 1

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

Future app manifests can supply version/build/platform/bundle/artifact checksum
and signing facts; GitHub can supply release/asset URLs, size, and publication
time. Website URLs and provenance can be joined during ingestion rather than
forced into an app manifest. No Preview snapshot, discovery, or UI exists yet.

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

## Verification and Phase 2

Run `bun run test`, `bun run lint`, `bun run types:check`, and `bun run build`.
The tests use Bun and Node's built-in test/assert APIs; no added dependencies.
Tests cover invalid metadata, localized presentation, exact checksum/bytes,
historical fixture isolation, current literal/v0.3 safeguards, and offline access.

Local production smoke verified both languages' generated HTML, plus live
Traditional Chinese homepage/Download (including light/dark and narrow checksum
wrapping). English HTTP navigation encountered a locale redirect loop with the
unchanged proxy/i18n configuration; this is not full browser acceptance. Routing
repair is outside this release-data migration and should be checked before deployment.

Phase 1 builds, visitor requests, and Vercel runtime read only the checked-in
snapshot. There is no GitHub API client or release network request. Phase 2 owns
out-of-band GitHub synchronization, per-release manifest validation, explicit
Stable/Preview selection, verified snapshot updates, and last-known-good retention
on sync failure. Normal builds and page requests must retain this local boundary.
