import { revalidateTag } from 'next/cache'
import type { ICache } from './cache.interface'

/**
 * Next.js cache adapter
 * Implements ICache interface using Next.js unstable_cache
 */
export class NextCacheAdapter implements ICache {
  /**
   * Get a value from cache
   * Note: Next.js cache is read-only from this interface
   * Use unstable_cache directly for read operations
   */
  async get<T>(_key: string): Promise<T | null> {
    // Next.js cache is handled by unstable_cache, not directly accessible
    // This is a placeholder for the interface
    return null
  }

  /**
   * Set a value in cache
   * Note: Next.js cache uses unstable_cache which is set during function definition
   * This is a placeholder for the interface
   */
  async set<T>(_key: string, _value: T, _ttl?: number): Promise<void> {
    // Next.js cache is handled by unstable_cache, not directly settable
    // This is a placeholder for the interface
  }

  /**
   * Delete a value from cache
   * Note: Next.js cache uses tags for invalidation
   */
  async delete(key: string): Promise<void> {
    // Use tag-based invalidation
    revalidateTag(key, 'default')
  }

  /**
   * Invalidate cache by tags
   */
  async invalidateTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      revalidateTag(tag, 'default')
    }
  }
}

export const nextCache = new NextCacheAdapter()
