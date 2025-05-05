import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../users'
import { Artist } from '../artists'
export let dataSourceInstance: DataSource

export const getDataSourceInstance = () => {
  return dataSourceInstance
}

export const createDataSource = () => {
  return new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    schema: process.env.POSTGRES_SCHEMA || 'public',
    entities: [User, Artist],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    migrations: [__dirname + '/migrations/*.ts'] // Verify this path
  })
}

/**
 * Initializes the PostgreSQL database connection with retry logic.
 *
 * Attempts to establish a connection to the database, retrying on failure up to {@link maxRetries} times or until {@link maxWaitTime} is exceeded. If the connection cannot be established within these limits, an error is thrown.
 *
 * @param maxRetries - Maximum number of connection attempts before giving up.
 * @param retryDelay - Delay in milliseconds between retry attempts.
 * @param maxWaitTime - Maximum total time in milliseconds to keep retrying before failing.
 *
 * @throws {Error} If the database connection cannot be established after the specified number of retries or wait time.
 */
export async function initializeDatabase(
  maxRetries: number = 5,
  retryDelay: number = 3000,
  maxWaitTime: number = 60000 // Example: 1 minute max wait time
): Promise<void> {
  if (!dataSourceInstance || !dataSourceInstance.isInitialized) {
    let attempts = 0
    const startTime = Date.now()

    while (attempts < maxRetries && Date.now() - startTime < maxWaitTime) {
      attempts++
      try {
        dataSourceInstance = createDataSource()

        await dataSourceInstance.initialize()
        console.log('Database connection initialized')
        return // Exit the function on successful connection
      } catch (error) {
        console.error(
          `Failed to initialize database (attempt ${attempts}/${maxRetries}) using config: ${JSON.stringify(
            {
              host: process.env.POSTGRES_HOST,
              port: process.env.POSTGRES_PORT,
              username: process.env.POSTGRES_USER,
              database: process.env.POSTGRES_DATABASE,
              schema: process.env.POSTGRES_SCHEMA
            }
          )}:`,
          error
        )
        if (attempts < maxRetries && Date.now() - startTime < maxWaitTime) {
          console.log(`Retrying in ${retryDelay}ms...`)
          await new Promise((resolve) => setTimeout(resolve, retryDelay))
        } else {
          throw error // Re-throw the error after the final attempt
        }
      }
    }
    throw new Error(
      'Max retries or wait time reached. Unable to connect to the database.'
    )
  }
}

// Graceful shutdown in production
if (process.env.NODE_ENV === 'production') {
  process.on('SIGINT', async () => {
    if (dataSourceInstance?.isInitialized) {
      await dataSourceInstance.destroy()
      console.log('Database connection closed.')
      process.exit(0)
    } else {
      process.exit(0)
    }
  })
}
