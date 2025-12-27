/**
 * Rate Limit Configuration
 *
 * Defines rate limit configurations for different endpoint types.
 * All durations are in milliseconds.
 */

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   */
  limit: number
  /**
   * Time window in milliseconds
   */
  window: number
  /**
   * Custom error message when rate limit is exceeded
   */
  message?: string
}

/**
 * Rate limit configurations for different endpoint types
 */
export const RATE_LIMIT_CONFIG = {
  /**
   * Authentication endpoints (login, register)
   * 5 attempts per 15 minutes per IP
   */
  AUTH: {
    limit: 5,
    window: 15 * 60 * 1000, // 15 minutes
    message: 'Too many authentication attempts. Please try again later.'
  } satisfies RateLimitConfig,

  /**
   * Media upload endpoints
   * 10 requests per minute per user/IP
   */
  MEDIA_UPLOAD: {
    limit: 10,
    window: 60 * 1000, // 1 minute
    message: 'Too many upload requests. Please try again later.'
  } satisfies RateLimitConfig,

  /**
   * General API routes
   * 100 requests per minute per IP
   */
  API: {
    limit: 100,
    window: 60 * 1000, // 1 minute
    message: 'Too many requests. Please try again later.'
  } satisfies RateLimitConfig,

  /**
   * Contact form submissions
   * 3 submissions per hour per IP
   */
  CONTACT_FORM: {
    limit: 3,
    window: 60 * 60 * 1000, // 1 hour
    message: 'Too many contact form submissions. Please try again later.'
  } satisfies RateLimitConfig,

  /**
   * Webhook endpoints
   * 200 requests per minute per IP
   */
  WEBHOOK: {
    limit: 200,
    window: 60 * 1000, // 1 minute
    message: 'Too many webhook requests. Please try again later.'
  } satisfies RateLimitConfig
} as const
