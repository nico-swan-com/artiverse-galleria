/**
 * Application Constants
 *
 * Centralized constants to replace magic numbers and strings throughout the codebase.
 * This improves maintainability and makes values easier to update.
 */

/**
 * UI Constants
 */
export const UI_CONSTANTS = {
  /**
   * Scroll threshold for navbar background change (in pixels)
   */
  NAVBAR_SCROLL_THRESHOLD: 20,

  /**
   * Default animation duration (in milliseconds)
   */
  ANIMATION_DURATION: 400,

  /**
   * Mobile breakpoint width (in pixels)
   */
  MOBILE_BREAKPOINT: 768,

  /**
   * Tablet breakpoint width (in pixels)
   */
  TABLET_BREAKPOINT: 1024
} as const

/**
 * Pagination Constants
 */
export const PAGINATION_CONSTANTS = {
  /**
   * Default page size
   */
  DEFAULT_PAGE_SIZE: 10,

  /**
   * Default page number
   */
  DEFAULT_PAGE: 1,

  /**
   * Maximum page size
   */
  MAX_PAGE_SIZE: 100,

  /**
   * Minimum page size
   */
  MIN_PAGE_SIZE: 1
} as const

/**
 * Cache Constants
 */
export const CACHE_CONSTANTS = {
  /**
   * Default cache TTL (Time To Live) in seconds
   */
  DEFAULT_TTL: 3600, // 1 hour

  /**
   * Short cache TTL in seconds
   */
  SHORT_TTL: 300, // 5 minutes

  /**
   * Long cache TTL in seconds
   */
  LONG_TTL: 86400, // 24 hours

  /**
   * Cache revalidation time in seconds
   */
  REVALIDATE_TIME: 60 // 1 minute
} as const

/**
 * Timeout Constants (in milliseconds)
 */
export const TIMEOUT_CONSTANTS = {
  /**
   * Default request timeout
   */
  REQUEST_TIMEOUT: 30000, // 30 seconds

  /**
   * Database query timeout
   */
  DATABASE_TIMEOUT: 10000, // 10 seconds

  /**
   * API call timeout
   */
  API_TIMEOUT: 15000 // 15 seconds
} as const

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  /**
   * Generic error messages
   */
  GENERIC: {
    UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
    NOT_FOUND: 'The requested resource was not found.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    VALIDATION_ERROR: 'Validation failed. Please check your input.',
    SERVER_ERROR: 'A server error occurred. Please try again later.'
  },

  /**
   * Authentication error messages
   */
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    ACCOUNT_LOCKED: 'Your account has been locked. Please contact support.'
  },

  /**
   * Database error messages
   */
  DATABASE: {
    CONNECTION_ERROR: 'Failed to connect to the database.',
    QUERY_ERROR: 'A database error occurred.',
    TRANSACTION_ERROR: 'Transaction failed. Please try again.'
  },

  /**
   * Form error messages
   */
  FORM: {
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters.',
    PASSWORDS_DONT_MATCH: 'Passwords do not match.'
  }
} as const

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  /**
   * Generic success messages
   */
  GENERIC: {
    CREATED: 'Successfully created.',
    UPDATED: 'Successfully updated.',
    DELETED: 'Successfully deleted.',
    SAVED: 'Successfully saved.'
  },

  /**
   * Authentication success messages
   */
  AUTH: {
    LOGGED_IN: 'Successfully logged in.',
    LOGGED_OUT: 'Successfully logged out.',
    REGISTERED: 'Account created successfully.'
  }
} as const

/**
 * Validation Constants
 */
export const VALIDATION_CONSTANTS = {
  /**
   * Minimum password length
   */
  MIN_PASSWORD_LENGTH: 8,

  /**
   * Maximum password length
   */
  MAX_PASSWORD_LENGTH: 128,

  /**
   * Minimum username length
   */
  MIN_USERNAME_LENGTH: 2,

  /**
   * Maximum username length
   */
  MAX_USERNAME_LENGTH: 50,

  /**
   * Maximum file size in bytes (10MB)
   */
  MAX_FILE_SIZE: 10 * 1024 * 1024,

  /**
   * Allowed image MIME types
   */
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ] as readonly string[]
} as const
