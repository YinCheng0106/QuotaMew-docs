# Website Phase 3 review

## Preflight and page plan

- Docs repository: `main`, clean; HEAD `15f76ac83a6a86f8bdf30b705710ea3b1502df65`, origin/main `e0489d8735ed6c21d5821a2ea43a60a2f494e647`, four commits ahead.
- Application repository is read-only. Pre-existing `QuotaMew/Localizable.xcstrings` modification must remain untouched. Product evidence is read from the `v0.2.0` tag rather than unreleased HEAD.
- REFINE homepage: concrete native menu-bar positioning; metadata-driven Stable CTA; four concise reasons to use the app.
- EXPAND feature/menu-bar summary: quota windows, Remaining/Used, Single/Overview, pinning; link to full settings documentation.
- ADD Providers: no existing dedicated page; explain runtime prerequisites and compatibility boundaries in one bilingual page.
- EXPAND Menu Bar and Settings: retain screenshots and existing explanation; add preferences, persistence, notification permission, reminder behavior and limitations. No separate notification page.
- RESTRUCTURE Download: primary Stable task and artifact basics; subordinate verification details; brief first-launch expectation with link to full guide. Generic conditional Preview is secondary and has no feature copy.
- KEEP First Launch: preserve the full safety procedure; add provider next-step links.
- REFINE Installation: remove duplicate first-launch sentences; link to provider prerequisites.
- RESTRUCTURE Troubleshooting: symptoms, supported causes, safe checks and next action.
- REFINE Privacy: preserve provider and diagnostics boundaries; explicit no telemetry/advertising analytics/data sales; bounded local notification/reset state; remove speculative future-feature prose.
- REFINE FAQ: useful quota/authentication/display questions; cross-link detailed guides.
- ADD shared light footer: Docs, Download, Privacy, GitHub, Releases, snapshot-derived Stable tag; included on product and documentation pages.
- KEEP release history on GitHub: Download explains channels and links to authoritative history. A separate copied changelog would duplicate release bodies and risks rewriting historical QuotaPulse prereleases.
- REFINE metadata and bilingual README descriptions; retain truthful curated Stable summary.

## Evidence boundary

Stable behavior was checked against `v0.2.0` app source: `CodexExecutableLocator`, `MenuBarPresentation`, `SettingsView`, `SettingsStore`, `NotificationService`, `ResetNotificationPolicy`, `LocalResetDetector`, `ClaudeSnapshotReader`, and tagged project documentation. Provider authentication belongs to Codex. Runtime discovery includes compatible packaged ChatGPT/Codex Desktop runtimes and standalone CLI candidates; it does not guarantee compatibility with every version. Notifications exclude Reserve, depend on fresh snapshots and authorization, and use bounded local state.

Release facts remain owned by checked-in snapshots and accessors. No snapshot, synchronization script, workflow or application file is part of this change.

## Validation and handoff

All configured gates pass: 159 tests (145 existing + 14 focused Phase 3 tests), lint, typecheck, ordinary production build, and `git diff --check`. The final ordinary build ran with `scripts/deny-release-network.cjs` and no GitHub credentials. Neither a diagnostic build nor a development server is the final build evidence.

HTTP smoke checked 22 English/zh-TW routes with direct 200 responses and three `/en` canonicalization paths with finite redirects to 200. An internal-link pass checked 476 links/anchors against 25 unique local targets. Browser checks covered both homepages and Download pages, Providers, Privacy, Troubleshooting, widths 390/768/1280, light/dark samples, checksum wrapping, footer, and keyboard navigation from Stable download to documentation. These are bounded local checks, not final human design, content or VoiceOver approval.

### Existing browser issue

The ordinary production build emits React hydration error #418 on English documentation pages. The same error was reproduced on English Privacy and Troubleshooting in an isolated archive of the original HEAD `15f76ac`, using the same dependencies and ordinary production build. It did not reproduce in development mode or `--debug-prerender`. This establishes a pre-existing issue, not its root cause. The pages render and navigation works; do not describe this browser run as console-error-free. No dependency or framework configuration change was introduced to hide the warning. The final review should explicitly assess this issue before production deployment; a focused follow-up can compare server/client text in the production documentation UI.

### Complete requested report

| # | Result |
|---|---|
| 1 | Initial HEAD `15f76ac83a6a86f8bdf30b705710ea3b1502df65`; origin/main `e0489d8735ed6c21d5821a2ea43a60a2f494e647`; main ahead by four. |
| 2 | Docs working tree initially clean. App had an existing `QuotaMew/Localizable.xcstrings` modification. |
| 3 | 37 scoped files; complete list below. |
| 4 | Homepage now covers positioning, reasons, quota/display summary, providers, privacy, installation and source links. |
| 5 | Short native macOS quota positioning for developers, especially Codex users; existing app screenshot retained. |
| 6 | Primary Stable DMG link and version come from `getStableRelease()` and release presentation. |
| 7 | `PreviewRelease` returns null without a snapshot; fixture Preview is explicitly optional and secondary, with metadata URLs/tag and no feature promises. |
| 8 | Four concise benefits: native menu bar, at-a-glance quota, flexible display, privacy-conscious local state. |
| 9 | 5-hour/Weekly/Reserve where available; Remaining/Used; Single/Overview; selection, pinning and reminders. |
| 10 | Added one bilingual Providers page and navigation entry; no thin provider-page proliferation. |
| 11 | Compatible packaged ChatGPT/legacy Codex Desktop or standalone CLI; own Codex sign-in; Finder environment limitations; no browser-only executable. |
| 12 | Claude explicitly Experimental / Unverified; limited snapshot reader, no bridge setup or live subscribed-account validation. |
| 13 | Existing Menu Bar content retained; settings categories, pinning behavior, unavailable metric, local persistence and macOS login approval clarified. |
| 14 | Permission, fresh data, remaining thresholds, reset reminders/detection, bounded deduplication and Reserve exclusion explained; no delivery guarantee. |
| 15 | Download foregrounds Stable/action/artifact basics and first launch; verification details have lower emphasis. |
| 16 | Apple Development signed, codesign verified, not Developer ID/notarized/stapled; safe System Settings → Privacy & Security → Open Anyway guidance retained. |
| 17 | Ten symptom sections with supported causes, safe checks and next actions. |
| 18 | Full First Launch guide preserved; Installation/Download/Troubleshooting link to it rather than copy its procedure. |
| 19 | Explicit no telemetry/advertising analytics/data sales, local preferences and bounded notification/reset state; no “stores nothing” claim. |
| 20 | FAQ addresses authentication, telemetry/local state, Claude limits, quota semantics and Remaining/Used; links deeper guides. |
| 21 | Shared footer on product and docs pages: Documentation, Download, Privacy, GitHub, Releases, snapshot-derived Stable. |
| 22 | Download explains recommended Stable and optional less-tested Preview. No fake Preview download today. |
| 23 | Separate copied changelog skipped; authoritative GitHub Releases linked, preserving historical QuotaPulse naming. |
| 24 | English content reviewed for concise, grounded product language. |
| 25 | Traditional Chinese uses Taiwan wording and matches English information structure. |
| 26 | Quota/remaining/used/reset/provider terms reviewed without replacing intentional usage semantics. |
| 27 | Native links, semantic headings/footer navigation, textual channel/status labels; keyboard Tab/Enter checked. Full VoiceOver review remains human work. |
| 28 | 390/768/1280 checks; no page-level horizontal overflow on checked surfaces; SHA256 wraps. Preview fixture rendering tested, but no real Preview visual exists. |
| 29 | Home/Download titles/descriptions refined; Providers/Privacy/Troubleshooting MDX metadata updated and reused by existing metadata generator. |
| 30 | Both README descriptions/prerequisites aligned; curated v0.2.0 Stable summary and docs/download links retained. |
| 31 | Public source/content safeguard passes: no unreleased Account Activity, 7D/30D, token activity/history/trends or v0.3 feature claims. |
| 32 | Stable remains primary on both home and Download, including Preview fixture coexistence. |
| 33 | Current `getPreviewRelease()` is null; no Preview card/banner/empty state rendered. |
| 34 | Release accessors/snapshots remain source of changing facts; no hardcoded current UI URLs/version/size/checksum. |
| 35 | Phase 2 scripts/workflows/snapshots untouched; existing automation tests pass. |
| 36 | Existing routing tests and HTTP smoke pass, including canonical English paths. |
| 37 | Focused safeguards cover Stable/Preview, footer, stale facts, unsafe Gatekeeper commands, unreleased features, Claude wording and bilingual structure. |
| 38 | 159 pass, 0 fail across four test files. |
| 39 | `bun run lint` passed. |
| 40 | `bun run types:check` passed. |
| 41 | Ordinary `bun run build` passed with GitHub-release network requests denied. |
| 42 | 22 direct routes + three English canonicalization paths passed; internal link/anchor checks passed. |
| 43 | Local browser checks completed; existing English-docs hydration warning described above. |
| 44 | `git diff --check` passed before staging. |
| 45 | Local Conventional Commit `feat(site): refresh bilingual public product experience`; exact hash is reported in the final handoff (a commit cannot embed its own hash). |
| 46 | Final clean main status and ahead count verified after commit and reported in the final handoff. |
| 47 | Application repo remains untouched; only its original localization modification remains. Evidence reads used the v0.2.0 tag. |
| 48 | No push, deployment, tag, release mutation or remote publication performed. |
| 49 | Human bilingual copy/design review, full keyboard/VoiceOver pass and assessment of the pre-existing hydration issue remain before deployment. No live provider/notification/app validation claimed. |
| 50 | After final approval and hydration-issue disposition, separately authorize publishing the local commits and deploy the reviewed revision through the existing production workflow; verify deployed bilingual routes/download links afterward. |

### Changed files

```text
README.md
README.zh-TW.md
content/docs/faq.mdx
content/docs/faq.zh-TW.mdx
content/docs/first-launch.mdx
content/docs/first-launch.zh-TW.mdx
content/docs/index.mdx
content/docs/index.zh-TW.mdx
content/docs/installation.mdx
content/docs/installation.zh-TW.mdx
content/docs/menu-bar.mdx
content/docs/menu-bar.zh-TW.mdx
content/docs/meta.json
content/docs/meta.zh-TW.json
content/docs/privacy.mdx
content/docs/privacy.zh-TW.mdx
content/docs/providers.mdx
content/docs/providers.zh-TW.mdx
content/docs/troubleshooting.mdx
content/docs/troubleshooting.zh-TW.mdx
content/docs/updating.zh-TW.mdx
docs/release-metadata.md
docs/website-phase3-review.md
src/app/[lang]/(home)/download/page.tsx
src/app/[lang]/(home)/layout.tsx
src/app/[lang]/(home)/page.tsx
src/app/[lang]/docs/[[...slug]]/page.tsx
src/components/home/hero.tsx
src/components/home/product-summary.tsx
src/components/home/providers.tsx
src/components/release-actions.tsx
src/components/site-footer.tsx
src/lib/download-content.ts
src/lib/footer-content.ts
src/lib/home-content.ts
src/lib/shared.ts
tests/public-content.test.tsx
```
