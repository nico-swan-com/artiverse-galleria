import type { NextConfig, SizeLimit } from 'next'

const { BUILD_TYPE } = process.env

const defaultConfig: NextConfig = {
  distDir: '_next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
        pathname: '/avatar/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**' // This allows all paths
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '/**' // This allows all paths
      }
    ]
  },
  experimental: {
    serverMinification: true,
    authInterrupts: true,
    serverActions: {
      bodySizeLimit:
        (process.env.SERVER_ACTIONS_BODY_SIZE_LIMIT as SizeLimit) || '10mb'
    }
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'pg-hstore']
    }

    config.externals = [
      ...config.externals,
      'react-native-sqlite-storage',
      'sqlite3'
    ]

    return config
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
        hostname: 'www.gravatar.com',
        pathname: '/avatar/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**' // This allows all paths
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '/**' // This allows all paths
      }
    ]
  },
  experimental: {
    serverMinification: false,
    authInterrupts: true,
    serverActions: {
      bodySizeLimit:
        (process.env.SERVER_ACTIONS_BODY_SIZE_LIMIT as SizeLimit) || '10mb'
    }
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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
        pathname: '/avatar/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**' // This allows all paths
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '/**' // This allows all paths
      }
    ]
  },
  experimental: {
    serverMinification: false,
    authInterrupts: true,
    serverActions: {
      bodySizeLimit:
        (process.env.SERVER_ACTIONS_BODY_SIZE_LIMIT as SizeLimit) || '10mb'
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
