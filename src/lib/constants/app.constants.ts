/**
 * Application-wide constants
 * Centralized location for magic numbers and configuration values
 */

/**
 * Cache configuration constants
 */
export const CACHE_CONFIG = {
  /** Default cache revalidation time in seconds */
  DEFAULT_REVALIDATE: 60,
  /** Short cache revalidation time in seconds (for frequently changing data) */
  SHORT_REVALIDATE: 1,
  /** Long cache duration in seconds (1 year) */
  LONG_CACHE_DURATION: 31536000,
  /** Cache tag prefixes */
  TAGS: {
    PRODUCTS: 'products',
    ARTISTS: 'artists',
    USERS: 'users',
    MEDIA: 'media'
  }
} as const

/**
 * File upload configuration
 */
export const FILE_CONFIG = {
  /** Maximum file size for media uploads (5MB) */
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  /** Maximum file size for avatars (1MB) */
  MAX_AVATAR_SIZE: 1 * 1024 * 1024,
  /** Accepted image MIME types */
  ACCEPTED_IMAGE_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ] as const
} as const

/**
 * Pagination defaults
 */
export const PAGINATION_CONFIG = {
  /** Default page number */
  DEFAULT_PAGE: 1,
  /** Default items per page */
  DEFAULT_LIMIT: 10,
  /** Default limit for public API */
  DEFAULT_PUBLIC_LIMIT: 3
} as const

/**
 * Search query configuration
 */
export const SEARCH_CONFIG = {
  /** Maximum length for search queries */
  MAX_QUERY_LENGTH: 255,
  /** Minimum length for search queries */
  MIN_QUERY_LENGTH: 1
} as const

/**
 * Image processing configuration
 */
export const IMAGE_CONFIG = {
  /** Default image quality (0-100) */
  DEFAULT_QUALITY: 80,
  /** Default watermark opacity (0-1) */
  DEFAULT_WATERMARK_OPACITY: 0.5,
  /** Default watermark scale (0-1, relative to image width) */
  DEFAULT_WATERMARK_SCALE: 0.2,
  /** Default watermark position */
  DEFAULT_WATERMARK_POSITION: 'southeast' as const
} as const

/**
 * SMTP configuration
 */
export const SMTP_CONFIG = {
  /** Simulated email delay in milliseconds */
  SIMULATOR_DELAY: 1500
} as const
