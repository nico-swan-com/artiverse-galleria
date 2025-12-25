import { db } from './drizzle'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type * as schema from './schema'
import { logger } from '../utilities/logger'

type Database = NodePgDatabase<typeof schema>

/**
 * Transaction wrapper utility
 * Provides a clean interface for executing database transactions
 * Ensures atomicity and proper error handling for multi-step database operations
 */
export class TransactionManager {
  /**
   * Execute operations within a database transaction
   * All operations are committed together or rolled back on error
   * @param operations - Function that receives transaction client and returns result
   * @returns Result of the operations
   * @throws Error if transaction fails, automatically rolls back
   */
  static async execute<T>(
    operations: (tx: Database) => Promise<T>
  ): Promise<T> {
    try {
      return await db.transaction(async (tx) => {
        return await operations(tx)
      })
    } catch (error) {
      logger.error('Transaction failed', error)
      throw error
    }
  }

  /**
   * Execute operations with automatic retry logic and exponential backoff
   * Useful for handling transient database errors
   * @param operations - Function that receives transaction client and returns result
   * @param maxRetries - Maximum number of retry attempts (default: 3)
   * @returns Result of the operations
   * @throws Error if all retry attempts fail
   */
  static async executeWithRetry<T>(
    operations: (tx: Database) => Promise<T>,
    maxRetries = 3
  ): Promise<T> {
    let lastError: unknown
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.execute(operations)
      } catch (error) {
        lastError = error
        logger.warn('Transaction attempt failed', {
          attempt,
          maxRetries,
          error
        })
        if (attempt === maxRetries) {
          throw lastError
        }
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, attempt * 100))
      }
    }
    throw lastError
  }
}
