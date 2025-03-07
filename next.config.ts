import type { NextConfig } from 'next'

const { BUILD_TYPE } = process.env

const defaultConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com']
  },
  distDir: '_next'
}

const customServerConfig: NextConfig = {
  distDir: '_next',
  /**
   * Enable static exports.
   *
   * @see https://nextjs.org/docs/app/building-your-application/configuring/custom-server
   */
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com']
  }
}

const staticConfig: NextConfig = {
  /**
   * Enable static exports.
   *
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  output: 'export',

  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   *
   * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com']
  }
}

let nextConfig = defaultConfig
switch (String(BUILD_TYPE).toUpperCase()) {
  case 'STATIC':
    nextConfig = staticConfig
    break
  case 'STANDALONE':
    nextConfig = customServerConfig
    break
  default:
    nextConfig = defaultConfig
    break
}

export default nextConfig
