import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '@/lib/users'

export let dataSourceInstance: DataSource

export const getDataSourceInstance = () => {
  return dataSourceInstance
}

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
        dataSourceInstance = new DataSource({
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: parseInt(process.env.POSTGRES_PORT || '5432'),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DATABASE,
          schema: 'public', // Ensure this is set correctly
          entities: [User],
          synchronize: false,
          logging: process.env.NODE_ENV === 'development',
          migrations: [__dirname + '/migrations/*.ts'] // Verify this path
        })

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
