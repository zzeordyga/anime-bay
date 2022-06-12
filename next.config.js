/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['s4.anilist.co'],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
}

module.exports = nextConfig
