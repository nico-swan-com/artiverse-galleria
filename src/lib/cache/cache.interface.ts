/**
 * Cache interface for abstraction
 * Allows swapping cache implementations (Next.js cache, Redis, etc.)
 */
export interface ICache {
  /**
   * Get a value from cache
   */
  get<T>(key: string): Promise<T | null>

  /**
   * Set a value in cache
   */
  set<T>(key: string, value: T, ttl?: number): Promise<void>

  /**
   * Delete a value from cache
   */
  delete(key: string): Promise<void>

  /**
   * Invalidate cache by tags
   */
  invalidateTags(tags: string[]): Promise<void>
}
