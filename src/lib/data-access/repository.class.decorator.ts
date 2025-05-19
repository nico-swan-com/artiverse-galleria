/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectLiteral, Repository } from 'typeorm'
import {
  getDataSourceInstance,
  initializeDatabase
} from '../database/data-source'

class DatabaseConnectionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseConnectionError'
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function DatabaseRepository<T extends { new (...args: any[]): {} }>(
  entity: new (...args: any[]) => ObjectLiteral,
  propertyKey: string
) {
  return function (constructor: T) {
    return class extends constructor {
      private _repository: Repository<ObjectLiteral> | null = null
      private _isInitializing: boolean = false
      private _initializingPromise: Promise<Repository<ObjectLiteral>> | null =
        null

      async getRepository(): Promise<Repository<ObjectLiteral>> {
        if (this._repository) {
          console.debug('Returning existing repository instance')
          return this._repository
        }

        if (this._isInitializing) {
          console.debug('Repository initialization in progress, waiting...')
          if (!this._initializingPromise) {
            throw new DatabaseConnectionError(
              'Repository initialization state is inconsistent.'
            )
          }
          return this._initializingPromise
        }

        this._isInitializing = true
        this._initializingPromise = (async () => {
          try {
            console.debug('Starting database initialization')
            await initializeDatabase()
            const dataSourceInstance = getDataSourceInstance()

            if (!dataSourceInstance) {
              throw new DatabaseConnectionError(
                'DataSource instance is not available after initialization.'
              )
            }

            if (!dataSourceInstance.isInitialized) {
              throw new DatabaseConnectionError(
                'DataSource is not initialized after initialization attempt.'
              )
            }

            console.debug(`Getting repository for entity: ${entity.name}`)
            this._repository = dataSourceInstance.getRepository(entity)

            if (!this._repository) {
              throw new DatabaseConnectionError(
                `Failed to get repository for entity: ${entity.name}`
              )
            }

            // Verify repository is working
            try {
              await this._repository.find({ take: 1 })
              console.debug('Repository successfully tested with a query')
            } catch (queryError) {
              throw new DatabaseConnectionError(
                `Repository test query failed: ${
                  queryError instanceof Error
                    ? queryError.message
                    : String(queryError)
                }`
              )
            }

            return this._repository
          } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err))
            console.error('Repository initialization failed:', {
              error: error.message
            })
            throw new DatabaseConnectionError(
              `Repository initialization failed: ${error.message}`
            )
          } finally {
            this._isInitializing = false
            this._initializingPromise = null
          }
        })()

        return this._initializingPromise
      }

      constructor(...args: any[]) {
        super(...args)
        Object.defineProperty(this, propertyKey, {
          get: () => this.getRepository(),
          enumerable: true,
          configurable: true
        })
      }

      async cleanup(): Promise<void> {
        const dataSourceInstance = getDataSourceInstance()
        if (dataSourceInstance?.isInitialized) {
          console.debug('Cleaning up database connection')
          await dataSourceInstance.destroy()
          this._repository = null
        }
      }
    }
  }
}
