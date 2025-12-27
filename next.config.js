/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用实验性功能以支持 React 19
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // 允许外部图片域名
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lxd4dc8r8oetlgua.public.blob.vercel-storage.com',
      },
    ],
  },
}

module.exports = nextConfig
