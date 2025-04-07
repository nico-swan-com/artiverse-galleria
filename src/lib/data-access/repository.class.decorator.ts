/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectLiteral, Repository } from 'typeorm'
import { dataSourceInstance } from '../database/data-source'
import { initializeDatabase } from '../database/data-source'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
