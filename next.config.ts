import type { NextConfig } from 'next'

const { BUILD_TYPE } = process.env

const defaultConfig: NextConfig = {
  distDir: '_next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**' // This allows all paths
      }
    ]
  }
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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**' // This allows all paths
      }
    ]
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
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          pathname: '/**' // This allows all paths
        }
      ]
    }
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
