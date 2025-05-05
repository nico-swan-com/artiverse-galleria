/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectLiteral, Repository } from 'typeorm'
import { dataSourceInstance } from '../database/data-source'
import { initializeDatabase } from '../database/data-source'

/**
 * Class decorator factory that adds a property to the decorated class for accessing a TypeORM repository of a specified entity.
 *
 * The added property returns a promise that resolves to the repository instance, ensuring that the repository is initialized only once and safely shared across concurrent accesses.
 *
 * @param entity - The TypeORM entity class for which the repository will be provided.
 * @param propertyKey - The name of the property to be added to the decorated class.
 *
 * @returns A class decorator that augments the target class with the repository property.
 *
 * @remark The repository is initialized lazily on first access. If multiple accesses occur concurrently, only one initialization is performed and others wait for completion.
 */
export function DatabaseRepository<T extends { new (...args: any[]): {} }>(
  entity: new (...args: any[]) => ObjectLiteral,
  propertyKey: string
) {
  return function (constructor: T) {
    return class extends constructor {
      private _repository: Repository<any> | null = null
      private _isInitializing: boolean = false

      async getRepository(): Promise<Repository<any>> {
        if (!this._repository) {
          if (this._isInitializing) {
            // Avoid concurrent initialization
            while (this._isInitializing) {
              await new Promise((resolve) => setTimeout(resolve, 50)) // Wait briefly
            }
            if (this._repository) return this._repository
          }

          this._isInitializing = true
          try {
            if (!dataSourceInstance || !dataSourceInstance.isInitialized) {
              await initializeDatabase()
            }
            this._repository = dataSourceInstance.getRepository(entity)
          } finally {
            this._isInitializing = false
          }
        }
        return this._repository
      }

      constructor(...args: any[]) {
        super(...args)
        // Define the property on the instance
        Object.defineProperty(this, propertyKey, {
          get: () => {
            return this.getRepository() // Return the promise
          },
          enumerable: true,
          configurable: true
        })
      }
    }
  }
}
