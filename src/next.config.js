const withCSS = require('@zeit/next-css');

const PRODUCTION_API_URL = 'https://api.contratospr.com/v1';
const DEVELOPMENT_API_URL = 'http://localhost:8000/v1';

module.exports = withCSS({
  env: {
    API_URL:
      process.env.NODE_ENV === 'production'
        ? PRODUCTION_API_URL
        : DEVELOPMENT_API_URL,
    GA_TRACKING_ID: 'UA-37217294-9'
  },
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    };

    return config;
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx']
});
