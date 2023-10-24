const { version } = require('./package.json');
const { composePlugins, withNx } = require('@nx/next');

const withTM = require('next-transpile-modules')([
  '@project-serum/sol-wallet-adapter',
  '@solana/wallet-adapter-base',
  '@solana/wallet-adapter-react',
  '@solana/wallet-adapter-bitkeep',
  '@solana/wallet-adapter-bitpie',
  '@solana/wallet-adapter-clover',
  '@solana/wallet-adapter-coin98',
  '@solana/wallet-adapter-coinhub',
  '@solana/wallet-adapter-ledger',
  '@solana/wallet-adapter-mathwallet',
  '@solana/wallet-adapter-phantom',
  '@solana/wallet-adapter-safepal',
  '@solana/wallet-adapter-solflare',
  '@solana/wallet-adapter-solong',
  '@solana/wallet-adapter-tokenpocket',
  '@solana/wallet-adapter-torus',
]);

const { withSentryConfig } = require('@sentry/nextjs');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = withTM({
  env: {
    APP_VERSION: version,
    ADMINS_PBKS: process.env.ADMINS_PBKS || '',
    APP_BASE_URL: process.env.APP_BASE_URL || '',
    DEVNET_RPC_ENDPOINT: process.env.DEVNET_RPC_ENDPOINT || '',
    DISCORD_OAUTH_URL: process.env.DISCORD_OAUTH_URL || '',
    ENVIRONMENT: process.env.ENVIRONMENT || '',
    GOOGLE_ANALYTICS_KEY: process.env.GOOGLE_ANALYTICS_KEY || '',
    GUILD_TREASURY_ADDR: process.env.GUILD_TREASURY_ADDR || '',
    RPC_API_BASE_URL: process.env.RPC_API_BASE_URL || '',
    STAR_ATLAS_API_URL: process.env.STAR_ATLAS_API_URL || '',
    FEATURES_ENDPOINT: process.env.FEATURES_ENDPOINT || '',
    DEV_FEATURES_ENDPOINT: process.env.DEV_FEATURES_ENDPOINT || '',
    SENTRY_DSN: process.env.SENTRY_DSN || '',
    SOLSCAN_API_TOKEN: process.env.SOLSCAN_API_TOKEN || '',
  },
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
  },
  images: {
    domains: ['storage.googleapis.com'],
    minimumCacheTTL: 86400,
  },
  pageExtensions: ['page.tsx', 'page.ts', 'api.ts'],
  reactStrictMode: true,
  trailingSlash: false,
  // sentry: {
  //   // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
  //   // for client-side builds. (This will be the default starting in
  //   // `@sentry/nextjs` version 8.0.0.) See
  //   // https://webpack.js.org/configuration/devtool/ and
  //   // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
  //   // for more information.
  //   hideSourceMaps: true,

  //   // This option will automatically provide performance monitoring for Next.js
  //   // data-fetching methods and API routes, making the manual wrapping of API
  //   // routes via `withSentry` redundant.
  //   autoInstrumentServerFunctions: false,
  // },
});

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = withSentryConfig(composePlugins(...plugins)(nextConfig), {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
  org: 'sai-ib',
  project: 'sai-frontend',
});
