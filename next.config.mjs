import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  // Preserve the original origin for same-origin locale rewrites, including IP hosts.
  skipProxyUrlNormalize: true,
  serverExternalPackages: ['@takumi-rs/core'],
  reactStrictMode: true,
};

export default withMDX(config);
