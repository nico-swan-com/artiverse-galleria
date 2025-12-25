import { env } from '../config/env.config'

/**
 * Checks if the application is currently in the build phase
 * @returns true if in production build phase, false otherwise
 */
export function isBuildPhase(): boolean {
  return (
    env.NODE_ENV === 'production' && env.NEXT_PHASE === 'phase-production-build'
  )
}
