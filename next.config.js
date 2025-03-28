/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static file serving for uploads
  output: 'standalone',
  // Configure server to serve uploaded files
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ]
  },
  // Disable TypeScript checking in production
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
