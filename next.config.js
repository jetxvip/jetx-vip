/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow YouTube iframes for hero video
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',         value: 'DENY' },
          { key: 'Cache-Control',           value: 'no-store, no-cache, must-revalidate' },
          { key: 'Referrer-Policy',         value: 'no-referrer' },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.ytimg.com' },
      { protocol: 'https', hostname: '**.youtube.com' },
    ],
  },
  // Allow Orchids preview origin for cross-origin dev requests
  allowedDevOrigins: ['orchids.cloud', '*.orchids.cloud'],
};

export default nextConfig;
