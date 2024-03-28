/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  redirects: () => {
    return [{
      source: '/',
      destination: '/zkpass',
      permanent: true
    }]
  }
}

module.exports = nextConfig
