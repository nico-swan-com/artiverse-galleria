'use server'

/**
 * Product Domain Server Actions
 *
 * Server actions for product-related operations.
 * These actions are called from client components and handle
 * form submissions, mutations, and other server-side operations.
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import ProductsService from './products.service'
import { ProductCreate, ProductUpdate } from './model/product.schema'
import { CACHE_CONFIG } from '../constants/app.constants'
import { logger } from '../utilities/logger'
import { ProductNotFoundError, ProductValidationError } from './products.errors'

const productsService = new ProductsService()

/**
 * Create a new product
 */
export async function createProduct(data: ProductCreate) {
  try {
    const product = await productsService.create(data)

    // Revalidate product caches
    revalidateTag(CACHE_CONFIG.TAGS.PRODUCTS, 'default')
    revalidatePath('/admin/products')
    revalidatePath('/artworks')

    return { success: true, data: product }
  } catch (error) {
    logger.error('Failed to create product', error)
    return {
      success: false,
      error:
        error instanceof ProductValidationError
          ? error.message
          : 'Failed to create product'
    }
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(data: ProductUpdate) {
  try {
    if (!data.id) {
      throw new ProductValidationError('Product ID is required')
    }

    await productsService.update(data)

    // Revalidate product caches
    revalidateTag(CACHE_CONFIG.TAGS.PRODUCTS, 'default')
    revalidatePath('/admin/products')
    revalidatePath(`/artworks/${data.id}`)
    revalidatePath('/artworks')

    return { success: true }
  } catch (error) {
    logger.error('Failed to update product', error)
    return {
      success: false,
      error:
        error instanceof ProductValidationError ||
        error instanceof ProductNotFoundError
          ? error.message
          : 'Failed to update product'
    }
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string) {
  try {
    await productsService.delete(id)

    // Revalidate product caches
    revalidateTag(CACHE_CONFIG.TAGS.PRODUCTS, 'default')
    revalidatePath('/admin/products')
    revalidatePath('/artworks')

    return { success: true }
  } catch (error) {
    logger.error('Failed to delete product', error)
    return {
      success: false,
      error:
        error instanceof ProductNotFoundError
          ? error.message
          : 'Failed to delete product'
    }
  }
}
