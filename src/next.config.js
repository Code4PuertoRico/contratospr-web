const withCSS = require('@zeit/next-css');

module.exports = withCSS({
  env: {
    API_URL: 'http://localhost:8000/api/v1'
  },
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    };

    return config;
  }
});
