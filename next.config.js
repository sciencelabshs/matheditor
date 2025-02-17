const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withPWA = require("./next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === 'development',
  register: false,
  buildExcludes: ["app-build-manifest.json"],
  skipWaiting: false,
  cacheStartUrl: false,
  dynamicStartUrl: false,
  reloadOnOnline: false,
});


/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/new/:path*',
        destination: '/new',
      },
      {
        source: '/edit/:path*',
        destination: '/edit',
      },
      {
        source: '/pdf/:path*',
        destination: '/api/pdf/:path*',
      }
    ]
  },
  /** @param { import('webpack').Configuration } config */
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('canvas');
    }
    return config
  },
};

module.exports = withPWA(withBundleAnalyzer(config));