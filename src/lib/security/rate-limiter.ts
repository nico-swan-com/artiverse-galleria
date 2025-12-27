import { LRUCache } from 'lru-cache'
import type { RateLimitConfig } from './rate-limit-config'

/**
 * Rate Limiter using LRU Cache for in-memory storage
 *
 * This is suitable for development and small deployments.
 * For production at scale, consider using Redis-based solutions.
 */
class RateLimiter {
  private cache: LRUCache<string, number[]>

  constructor() {
    // Create LRU cache with max size of 10000 entries
    // TTL is not set here as we manage TTL per key based on window
    this.cache = new LRUCache<string, number[]>({
      max: 10000
    })
  }

  /**
   * Check if a request is within rate limit
   * @param key - Unique identifier for the rate limit (e.g., IP address, user ID)
   * @param config - Rate limit configuration
   * @returns Object with allowed status and remaining requests
   */
  check(
    key: string,
    config: RateLimitConfig
  ): {
    allowed: boolean
    remaining: number
    resetTime: number
  } {
    const now = Date.now()
    const windowStart = now - config.window

    // Get existing timestamps for this key
    let timestamps = this.cache.get(key) || []

    // Filter out timestamps outside the current window
    timestamps = timestamps.filter((timestamp) => timestamp > windowStart)

    // Check if limit is exceeded
    const allowed = timestamps.length < config.limit

    if (allowed) {
      // Add current request timestamp
      timestamps.push(now)
      this.cache.set(key, timestamps)
    }

    // Calculate reset time (oldest timestamp + window)
    const resetTime =
      timestamps.length > 0
        ? Math.min(...timestamps) + config.window
        : now + config.window

    return {
      allowed,
      remaining: Math.max(0, config.limit - timestamps.length),
      resetTime
    }
  }

  /**
   * Reset rate limit for a specific key
   * @param key - Unique identifier for the rate limit
   */
  reset(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all rate limit entries
   */
  clear(): void {
    this.cache.clear()
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter()

/**
 * Get client identifier for rate limiting
 * Prioritizes IP address from headers, falls back to a default key
 */
export function getRateLimitKey(
  request: Request | { headers: Headers | Map<string, string> }
): string {
  let headers: Headers | Map<string, string>

  if (request instanceof Request) {
    headers = request.headers
  } else {
    headers = request.headers
  }

  // Handle both Headers and Map types (Next.js headers() returns ReadonlyHeaders which is similar to Map)
  const getHeader = (name: string): string | null => {
    if (headers instanceof Headers) {
      return headers.get(name)
    }
    // Handle Map-like objects (Next.js ReadonlyHeaders)
    const value = (headers as Map<string, string>).get(name)
    return value || null
  }

  // Try to get IP from various headers (useful behind proxies/load balancers)
  const forwardedFor = getHeader('x-forwarded-for')
  if (forwardedFor) {
    // Take the first IP if there are multiple
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  const realIp = getHeader('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback - in production, you'd want to get the actual IP from the request
  // For now, use a default key (this means all users share the limit)
  return 'default'
}

/**
 * Create rate limit response
 */
export function createRateLimitResponse(
  message: string,
  resetTime: number
): Response {
  const resetTimeSeconds = Math.ceil((resetTime - Date.now()) / 1000)

  return new Response(
    JSON.stringify({
      error: message,
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: resetTimeSeconds
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': resetTimeSeconds.toString(),
        'X-RateLimit-Limit': '0',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(resetTime).toISOString()
      }
    }
  )
}
