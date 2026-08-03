/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/anime-bay',
  reactStrictMode: true,
  images: {
    // Static export requires unoptimized images.
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: 's4.anilist.co' }],
  },
  trailingSlash: true,
};

export default nextConfig;