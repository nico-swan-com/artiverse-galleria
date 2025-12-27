import { env } from '../config/env.config'

/**
 * Checks if the application is currently in the build phase
 * @returns true if in production build phase, false otherwise
 *
 * Note: NEXT_PHASE is only set during Next.js build process.
 * During runtime, NEXT_PHASE will be undefined or not set to 'phase-production-build',
 * so this function will return false even in production runtime.
 */
export function isBuildPhase(): boolean {
  // Only return true if BOTH conditions are met:
  // 1. NODE_ENV is production
  // 2. NEXT_PHASE is explicitly set to 'phase-production-build'
  // This ensures runtime requests in production are not treated as build phase
  const isBuild =
    env.NODE_ENV === 'production' && env.NEXT_PHASE === 'phase-production-build'
  return isBuild
}
