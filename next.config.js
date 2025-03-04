/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/check',
        destination: 'https://reactnative.directory/api/libraries/check',
      },
    ];
  },
};

module.exports = nextConfig;
