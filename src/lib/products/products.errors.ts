/**
 * Product Domain Errors
 *
 * Custom error classes for the products domain.
 * These errors provide more specific error handling and messaging
 * for product-related operations.
 */

/**
 * Base class for all product-related errors
 */
export class ProductError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message)
    this.name = 'ProductError'
  }
}

/**
 * Error thrown when a product is not found
 */
export class ProductNotFoundError extends ProductError {
  constructor(identifier: string) {
    super(`Product not found: ${identifier}`, 'PRODUCT_NOT_FOUND')
    this.name = 'ProductNotFoundError'
  }
}

/**
 * Error thrown when a product SKU already exists
 */
export class ProductSkuExistsError extends ProductError {
  constructor(sku: string | number) {
    super(`Product with SKU "${sku}" already exists`, 'PRODUCT_SKU_EXISTS')
    this.name = 'ProductSkuExistsError'
  }
}

/**
 * Error thrown when product validation fails
 */
export class ProductValidationError extends ProductError {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message, 'PRODUCT_VALIDATION_ERROR')
    this.name = 'ProductValidationError'
  }
}

/**
 * Error thrown when product stock is insufficient
 */
export class InsufficientStockError extends ProductError {
  constructor(productId: string, requested: number, available: number) {
    super(
      `Insufficient stock for product ${productId}: requested ${requested}, available ${available}`,
      'INSUFFICIENT_STOCK'
    )
    this.name = 'InsufficientStockError'
  }
}

/**
 * Error thrown when product price is invalid
 */
export class InvalidPriceError extends ProductError {
  constructor(price: number) {
    super(`Invalid product price: ${price}`, 'INVALID_PRICE')
    this.name = 'InvalidPriceError'
  }
}

/**
 * Error thrown when product category is invalid
 */
export class InvalidCategoryError extends ProductError {
  constructor(category: string) {
    super(`Invalid product category: ${category}`, 'INVALID_CATEGORY')
    this.name = 'InvalidCategoryError'
  }
}
