/**
 * Utilities Barrel Export
 *
 * Central export point for all utility functions and services.
 */

// Core utilities
export * from './get-avatar-url'
export * from './get-image-src'
export * from './image'
export * from './html-escape'
export * from './build-phase.util'

// Logger
export * from './logger'

// Error handling
export * from './error-handler.service'
export * from './api-error-handler'
export * from './api-error.types'

// Search utilities
export * from './search-query.util'

// Client-side utilities (note: requires 'use client' in consuming component)
// crop-image.util.ts is exported separately due to 'use client' directive
// Import directly: import { getCroppedImg, blobToFile } from '@/lib/utilities/crop-image.util'
