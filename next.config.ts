import type { NextConfig, SizeLimit } from 'next'

const { BUILD_TYPE } = process.env

// Shared configuration to avoid duplication
const sharedRemotePatterns = [
  {
    protocol: 'https' as const,
    hostname: 'www.gravatar.com',
    pathname: '/avatar/**'
  },
  {
    protocol: 'https' as const,
    hostname: 'images.unsplash.com',
    pathname: '/**'
  },
  {
    protocol: 'https' as const,
    hostname: 'img.freepik.com',
    pathname: '/**'
  }
]

const sharedExperimental = {
  authInterrupts: true,
  serverActions: {
    bodySizeLimit:
      (process.env.SERVER_ACTIONS_BODY_SIZE_LIMIT as SizeLimit) || '10mb'
  }
}

const defaultConfig: NextConfig = {
  distDir: '_next',
  images: {
    remotePatterns: sharedRemotePatterns
  },
  experimental: {
    ...sharedExperimental,
    serverMinification: true
  },
  webpack: (config, { isServer }) => {
    // Preserve Next/webpack defaults and gracefully handle function/undefined externals.
    const asArray = (val: any) => (Array.isArray(val) ? val : val ? [val] : [])
    if (isServer) {
      const extra = ['pg-hstore', 'react-native-sqlite-storage', 'sqlite3']
      config.externals = [...asArray(config.externals), ...extra]
    }
    return config
  }
}

const customServerConfig: NextConfig = {
  distDir: '_next',
  /**
   * Enable standalone mode for custom server.
   *
   * @see https://nextjs.org/docs/app/building-your-application/configuring/custom-server
   */
  output: 'standalone',
  images: {
    remotePatterns: sharedRemotePatterns
  },
  experimental: {
    ...sharedExperimental,
    serverMinification: false
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
    remotePatterns: sharedRemotePatterns
  },
  experimental: {
    ...sharedExperimental,
    serverMinification: false
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
