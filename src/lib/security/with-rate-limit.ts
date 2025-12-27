import { NextRequest, NextResponse } from 'next/server'
import {
  rateLimiter,
  getRateLimitKey,
  createRateLimitResponse
} from './rate-limiter'
import type { RateLimitConfig } from './rate-limit-config'

/**
 * Higher-order function to wrap API route handlers with rate limiting
 *
 * @example
 * ```typescript
 * export const GET = withRateLimit(
 *   RATE_LIMIT_CONFIG.API,
 *   async (req: NextRequest) => {
 *     // Your handler logic
 *     return NextResponse.json({ data: 'example' })
 *   }
 * )
 * ```
 */
export function withRateLimit(
  config: RateLimitConfig,
  handler: (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    ...args: unknown[]
  ): Promise<NextResponse> => {
    const key = getRateLimitKey(req)
    const { allowed, resetTime } = rateLimiter.check(key, config)

    if (!allowed) {
      return createRateLimitResponse(
        config.message || 'Rate limit exceeded',
        resetTime
      ) as NextResponse
    }

    return handler(req, ...args)
  }
}

/**
 * Rate limit check for server actions
 * Use this function at the start of your server action
 *
 * @example
 * ```typescript
 * async function myAction(prevState, formData) {
 *   await checkRateLimit(RATE_LIMIT_CONFIG.CONTACT_FORM)
 *   // Your action logic
 * }
 * ```
 */
export async function checkRateLimit(config: RateLimitConfig): Promise<void> {
  try {
    const { headers } = await import('next/headers')
    const headersList = await headers()

    // Get IP from headers - Next.js headers() returns ReadonlyHeaders which is Map-like
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const key = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown'

    const { allowed } = rateLimiter.check(key, config)

    if (!allowed) {
      const error = new Error(config.message || 'Rate limit exceeded')
      ;(error as Error & { statusCode?: number; code?: string }).statusCode =
        429
      ;(error as Error & { statusCode?: number; code?: string }).code =
        'RATE_LIMIT_EXCEEDED'
      throw error
    }
  } catch (error) {
    // If it's already a rate limit error, re-throw it
    if (
      error instanceof Error &&
      (error as Error & { code?: string }).code === 'RATE_LIMIT_EXCEEDED'
    ) {
      throw error
    }
    // If we can't get headers, log and allow the request
    // (in production, you might want to fail closed instead)
    console.warn('Rate limiting check failed, allowing request', error)
  }
}
