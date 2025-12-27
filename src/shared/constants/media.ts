/**
 * Media Constants
 *
 * Re-exports media-related constants from app.constants for backwards compatibility.
 */
export { FILE_CONFIG } from './app.constants'

// Legacy export for backwards compatibility
// This is a re-export of FILE_CONFIG.ACCEPTED_IMAGE_TYPES
import { FILE_CONFIG } from './app.constants'
export const ACCEPTED_IMAGE_TYPES = FILE_CONFIG.ACCEPTED_IMAGE_TYPES
