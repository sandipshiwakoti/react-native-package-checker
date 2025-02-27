/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://reactnative.directory/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
