import type { NextConfig, SizeLimit } from 'next'
// Note: next.config.ts runs at build time, so we need to access env directly
// The env config validation happens at runtime, not build time
const BUILD_TYPE = process.env.BUILD_TYPE
const SERVER_ACTIONS_BODY_SIZE_LIMIT =
  process.env.SERVER_ACTIONS_BODY_SIZE_LIMIT

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
  },
  {
    protocol: 'https' as const,
    hostname: 'github.com',
    pathname: '/**'
  }
]

const sharedExperimental = {
  authInterrupts: true,
  serverActions: {
    bodySizeLimit: (SERVER_ACTIONS_BODY_SIZE_LIMIT as SizeLimit) || '10mb'
  }
}

const defaultConfig: NextConfig = {
  distDir: '_next',
  images: {
    remotePatterns: sharedRemotePatterns,
    localPatterns: [
      {
        pathname: '/api/media/**'
      }
    ]
  },
  experimental: {
    ...sharedExperimental,
    serverMinification: true
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      }
    ]
  },
  webpack: (config, { isServer }) => {
    // Preserve Next/webpack defaults and gracefully handle function/undefined externals.
    const asArray = (val: unknown): unknown[] =>
      Array.isArray(val) ? val : val ? [val] : []
    if (isServer) {
      const extra = [
        'pg-hstore',
        'react-native-sqlite-storage',
        'sqlite3',
        'mysql',
        'mssql',
        'oracledb',
        'better-sqlite3',
        'sql.js',
        '@sap/hana-client',
        'mongodb',
        'hdb-pool',
        'pg-query-stream'
      ]
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
    remotePatterns: sharedRemotePatterns,
    localPatterns: [
      {
        pathname: '/api/media/**'
      }
    ]
  },
  experimental: {
    ...sharedExperimental,
    serverMinification: false
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
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
    remotePatterns: sharedRemotePatterns,
    localPatterns: [
      {
        pathname: '/api/media/**'
      }
    ]
  },
  experimental: {
    ...sharedExperimental,
    serverMinification: false
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
          // Note: Strict-Transport-Security is not included for static exports
          // as it's typically handled at the CDN/edge level
        ]
      }
    ]
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
