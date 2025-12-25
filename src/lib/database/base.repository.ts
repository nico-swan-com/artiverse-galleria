import { db } from './drizzle'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type * as schema from './schema'
import { logger } from '../utilities/logger'
import type { SQL } from 'drizzle-orm'

type Database = NodePgDatabase<typeof schema>

/**
 * Base repository class with common operations
 * Provides error handling wrapper and transaction support
 * Follows DRY principle by centralizing common repository patterns
 */
export abstract class BaseRepository {
  protected db: Database = db

  /**
   * Execute a database operation with centralized error handling and logging
   * @param operation - The database operation to execute
   * @param context - Additional context for error logging
   * @returns Result of the operation
   * @throws Error if operation fails, with context logged
   */
  protected async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    context: Record<string, unknown> = {}
  ): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      logger.error('Database operation failed', error, {
        ...context,
        repository: this.constructor.name
      })
      throw error
    }
  }

  /**
   * Execute multiple operations within a database transaction
   * Ensures all operations succeed or all are rolled back
   * @param operations - Function that receives transaction client and performs operations
   * @returns Result of the operations
   * @throws Error if transaction fails, automatically rolls back
   */
  protected async executeTransaction<T>(
    operations: (tx: Database) => Promise<T>
  ): Promise<T> {
    return this.executeWithErrorHandling(
      async () => {
        // Drizzle transaction support
        return await this.db.transaction(async (tx) => {
          return await operations(tx)
        })
      },
      { operation: 'transaction' }
    )
  }
}
