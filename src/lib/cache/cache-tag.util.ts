import { CACHE_CONFIG } from '../constants/app.constants'

/**
 * Generates cache tags for different entity types
 * Provides consistent cache tag naming across the application
 *
 * Cache tags are used by Next.js unstable_cache for cache invalidation
 */
export class CacheTagGenerator {
  /**
   * Generate cache tag for products list
   * @param sortBy - Optional sort field
   * @param order - Optional sort order
   * @returns Cache tag string
   */
  static products(sortBy?: string, order?: string): string {
    return sortBy && order
      ? `${CACHE_CONFIG.TAGS.PRODUCTS}-${sortBy}-${order}`
      : CACHE_CONFIG.TAGS.PRODUCTS
  }

  /**
   * Generate cache tag for paginated products
   * @param page - Page number
   * @param limit - Items per page
   * @param sortBy - Optional sort field
   * @param order - Optional sort order
   * @returns Cache tag string
   */
  static productsPaged(
    page: number,
    limit: number,
    sortBy?: string,
    order?: string
  ): string {
    return `products-page-${page}-limit-${limit}-${sortBy || 'createdAt'}-${order || 'DESC'}`
  }

  /**
   * Generate cache tag for a specific product
   * @param id - Product ID
   * @returns Cache tag string
   */
  static product(id: string): string {
    return `product-${id}`
  }

  /**
   * Generate cache tag for featured products
   */
  static featuredProducts(): string {
    return 'featured-products'
  }

  /**
   * Generate cache tag for products by artist
   */
  static productsByArtist(artistId: string): string {
    return `products-artist-${artistId}`
  }

  /**
   * Generate cache tag for artists
   */
  static artists(sortBy?: string, order?: string): string {
    return sortBy && order
      ? `${CACHE_CONFIG.TAGS.ARTISTS}-${sortBy}-${order}`
      : CACHE_CONFIG.TAGS.ARTISTS
  }

  /**
   * Generate cache tag for paginated artists
   */
  static artistsPaged(
    page: number,
    limit: number,
    sortBy?: string,
    order?: string
  ): string {
    return `artists-page-${page}-limit-${limit}-${sortBy || 'createdAt'}-${order || 'DESC'}`
  }

  /**
   * Generate cache tag for a specific artist
   */
  static artist(id: string): string {
    return `artist-${id}`
  }

  /**
   * Generate cache tag for users
   */
  static users(): string {
    return CACHE_CONFIG.TAGS.USERS
  }

  /**
   * Generate cache tag for media
   */
  static media(): string {
    return CACHE_CONFIG.TAGS.MEDIA
  }
}
