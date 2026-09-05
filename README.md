# QuotaPulse Docs

**English** | [繁體中文](README.zh-TW.md)

Official website and documentation source for [QuotaPulse](https://github.com/YinCheng0106/QuotaPulse), a lightweight native macOS menu bar app for monitoring AI coding usage and reset times.

**Website:** [quotapulse.yincheng.app](https://quotapulse.yincheng.app)

## About

This repository contains the source code and documentation for the official QuotaPulse website.

It provides:

- Product overview and feature information
- QuotaPulse download page
- Installation and first-launch guides
- Updating instructions
- Troubleshooting and FAQ
- Privacy and compatibility documentation
- English and Traditional Chinese localization

The QuotaPulse application itself is maintained separately in the [QuotaPulse repository](https://github.com/YinCheng0106/QuotaPulse).

## Tech Stack

The website is built with:

- [Next.js](https://nextjs.org/)
- [Fumadocs](https://fumadocs.dev/)
- TypeScript
- Tailwind CSS
- Bun

It uses the Next.js App Router and Fumadocs for documentation routing, search, MDX content, and internationalization.

## Local Development

### Requirements

- Bun
- A current Node.js runtime compatible with the project dependencies

Clone the repository and install dependencies:

```bash
git clone https://github.com/YinCheng0106/QuotaPulse-docs
cd QuotaPulse-docs
bun install
```

Start the development server:

```bash
bun run dev
```

Then open:

```text
http://localhost:3000
```

## Verification

Before submitting changes, run:

```bash
bun run lint
bun run types:check
bun run build
```

## Localization

QuotaPulse documentation is currently available in:

- English — default locale
- Traditional Chinese (Taiwan) — `zh-TW`

Public routes follow this structure:

```text
/
├── /download
├── /docs
└── /docs/...

/zh-TW
├── /zh-TW/download
├── /zh-TW/docs
└── /zh-TW/docs/...
```

When updating user-facing documentation, English and Traditional Chinese content should remain functionally consistent while using natural wording for each language rather than strict word-for-word translation.

## Deployment

The production website is available at:

**https://quotapulse.yincheng.app**

The site is designed to be deployed with Vercel.

The production site URL should be configured as:

```env
NEXT_PUBLIC_SITE_URL=https://quotapulse.yincheng.app
```

This value is used for canonical URLs, Open Graph metadata, alternate-language links, and other production metadata.

## Release Information

Download information is managed centrally by the website's release configuration.

When publishing a new QuotaPulse release, the website should be updated with:

- Release version
- DMG download URL
- SHA-256 checksum
- Minimum supported macOS version
- Signing and notarization status
- Automatic update availability

The website should only advertise a release as available after the corresponding GitHub Release and downloadable artifact have been verified.

## Related Project

### QuotaPulse

The macOS application source code, releases, issues, and development documentation are maintained in the main repository:

[github.com/YinCheng0106/QuotaPulse](https://github.com/YinCheng0106/QuotaPulse)

## Contributing

Focused fixes and improvements to the website or documentation are welcome.

When contributing:

- Keep English and Traditional Chinese documentation aligned where applicable.
- Avoid documenting planned functionality as if it is already available.
- Keep Beta limitations and security notices accurate.
- Verify links and localized routes.
- Run the project verification commands before opening a pull request.

For application bugs or feature requests, please use the main [QuotaPulse repository](https://github.com/YinCheng0106/QuotaPulse).

## License

The website source code and documentation are licensed under the [MIT License](LICENSE).

QuotaPulse names, logos, and branding assets are not granted for use as third-party product branding by this license.