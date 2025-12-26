import { unstable_cache } from 'next/cache'
import crypto from 'crypto'
import { CACHE_CONFIG } from '@/shared/constants'

/**
 * Image processing cache key parameters
 */
export interface ImageCacheParams {
  mediaId: string
  quality: number
  width?: number
  height?: number
  watermark: boolean
  skipWatermark: boolean
  wmText?: string
  wmLogo?: string
  wmPos?: string
  wmOpacity?: number
  wmScale?: number
}

/**
 * Generate a cache key for processed images
 * @param params - Image processing parameters
 * @returns Cache key string
 */
export function generateImageCacheKey(params: ImageCacheParams): string {
  const keyParts = [
    params.mediaId,
    `q${params.quality}`,
    params.width ? `w${params.width}` : '',
    params.height ? `h${params.height}` : '',
    params.watermark ? 'wm1' : 'wm0',
    params.skipWatermark ? 'skip1' : 'skip0',
    params.wmText ? `txt${params.wmText}` : '',
    params.wmLogo ? `logo${params.wmLogo}` : '',
    params.wmPos ? `pos${params.wmPos}` : '',
    params.wmOpacity ? `op${params.wmOpacity}` : '',
    params.wmScale ? `sc${params.wmScale}` : ''
  ]

  const keyString = keyParts.filter(Boolean).join('-')
  // Create a hash to keep cache keys manageable
  return `processed-image-${crypto.createHash('sha256').update(keyString).digest('hex').substring(0, 16)}`
}

/**
 * Get cached processed image
 * @param cacheKey - Cache key for the processed image
 * @returns Cached image buffer or null if not found
 */
export async function getCachedProcessedImage(
  cacheKey: string
): Promise<Buffer | null> {
  try {
    const getCached = unstable_cache(
      async (key: string): Promise<Buffer | null> => {
        // This will be populated by setCachedProcessedImage
        return null
      },
      [cacheKey],
      {
        tags: [CACHE_CONFIG.TAGS.MEDIA, `processed-${cacheKey}`],
        revalidate: CACHE_CONFIG.LONG_CACHE_DURATION
      }
    )

    // Note: unstable_cache doesn't directly support get/set operations
    // We'll use a different approach with filesystem or in-memory cache
    // For now, return null and implement filesystem cache
    return null
  } catch {
    return null
  }
}

/**
 * Cache processed image using filesystem
 * @param cacheKey - Cache key for the processed image
 * @param imageBuffer - Processed image buffer to cache
 */
export async function setCachedProcessedImage(
  cacheKey: string,
  imageBuffer: Buffer
): Promise<void> {
  // Filesystem caching would be implemented here
  // For now, we rely on HTTP cache headers and ETags
  // This is a placeholder for future filesystem cache implementation
}
