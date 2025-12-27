/**
 * Branded Types for IDs
 *
 * Branded types prevent accidentally mixing different ID types.
 * This provides compile-time safety when working with IDs from different entities.
 */

/**
 * Branded type for User IDs
 */
export type UserId = string & { readonly __brand: 'UserId' }

/**
 * Branded type for Product IDs
 */
export type ProductId = string & { readonly __brand: 'ProductId' }

/**
 * Branded type for Artist IDs
 */
export type ArtistId = string & { readonly __brand: 'ArtistId' }

/**
 * Branded type for Order IDs
 */
export type OrderId = string & { readonly __brand: 'OrderId' }

/**
 * Branded type for Media IDs
 */
export type MediaId = string & { readonly __brand: 'MediaId' }

/**
 * Helper function to create a UserId from a string
 */
export function toUserId(id: string): UserId {
  return id as UserId
}

/**
 * Helper function to create a ProductId from a string
 */
export function toProductId(id: string): ProductId {
  return id as ProductId
}

/**
 * Helper function to create an ArtistId from a string
 */
export function toArtistId(id: string): ArtistId {
  return id as ArtistId
}

/**
 * Helper function to create an OrderId from a string
 */
export function toOrderId(id: string): OrderId {
  return id as OrderId
}

/**
 * Helper function to create a MediaId from a string
 */
export function toMediaId(id: string): MediaId {
  return id as MediaId
}
