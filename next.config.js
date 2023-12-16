/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['uploadthing.com', 'lh3.googleusercontent.com', 'storage.ko-fi.com', 'api.radar.io'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
    serverActions: true,
    serverActionsBodySizeLimit: '5mb'
  },
}

module.exports = nextConfig
