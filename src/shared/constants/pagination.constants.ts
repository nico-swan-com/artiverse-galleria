/**
 * Pagination Constants
 *
 * Re-exports pagination-related constants from app.constants for backwards compatibility.
 */
export { PAGINATION_CONFIG } from './app.constants'

// Legacy export for backwards compatibility with old import paths
import { PAGINATION_CONFIG } from './app.constants'
export const PAGINATION = {
  DEFAULT_PAGE: PAGINATION_CONFIG.DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE: PAGINATION_CONFIG.DEFAULT_LIMIT,
  MAX_PAGE_SIZE: 100
} as const
