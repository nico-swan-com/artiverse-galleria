import 'reflect-metadata'
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm'
import { ProductsEntity } from '../products'
import { ArtistsEntity } from '../artists'
import { UsersEntity } from '../users'
import { MediaEntity } from '../media'

let dataSourceInstance: DataSource

export const getDataSourceInstance = () => {
  return dataSourceInstance
}

export class DatabaseConnectionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseConnectionError'
  }
}

export const getRepository = async <T extends ObjectLiteral>(
  entity: EntityTarget<T>
): Promise<Repository<T>> => {
  try {
    // Skip database operations during build time
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PHASE === 'phase-production-build'
    ) {
      throw new Error('Database operations not available during build phase')
    }

    await initializeDatabase()
    const dataSourceInstance = getDataSourceInstance()
    return dataSourceInstance.getRepository<T>(entity)
  } catch (error) {
    console.error('Error getting repository:', error)
    throw new DatabaseConnectionError(
      'Failed to get repository. Database connection might not be initialized.'
    )
  }
}

export const createDataSource = () => {
  console.debug('Creating DataSource with config:', {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    schema: process.env.POSTGRES_SCHEMA || 'public',
    entities: [UsersEntity, ArtistsEntity, ProductsEntity]
  })

  return new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    schema: process.env.POSTGRES_SCHEMA || 'public',
    entities: [UsersEntity, ArtistsEntity, ProductsEntity, MediaEntity],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    migrations: [__dirname + '/migrations/*.ts']
  })
}

export async function initializeDatabase(
  maxRetries: number = 5,
  retryDelay: number = 3000,
  maxWaitTime: number = 60000
): Promise<void> {
  // Skip database initialization during build time
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PHASE === 'phase-production-build'
  ) {
    console.debug('Skipping database initialization during build phase')
    return
  }

  if (!dataSourceInstance || !dataSourceInstance.isInitialized) {
    let attempts = 0
    const startTime = Date.now()

    while (attempts < maxRetries && Date.now() - startTime < maxWaitTime) {
      attempts++
      try {
        if (!dataSourceInstance) {
          console.debug('Creating new DataSource instance')
          dataSourceInstance = createDataSource()
        }

        if (!dataSourceInstance.isInitialized) {
          console.debug('Initializing DataSource')
          await dataSourceInstance.initialize()

          // Verify connection by running a test query
          await dataSourceInstance.query('SELECT 1')
          console.info('Database connection initialized and verified')
          return
        }
      } catch (error) {
        console.error(
          `Failed to initialize database (attempt ${attempts}/${maxRetries}):`,
          error
        )

        if (attempts < maxRetries && Date.now() - startTime < maxWaitTime) {
          console.debug(`Retrying in ${retryDelay}ms...`)
          await new Promise((resolve) => setTimeout(resolve, retryDelay))
        } else {
          throw error
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
      console.info('Closing database connection...')
      await dataSourceInstance.destroy()
      console.info('Database connection closed.')
      process.exit(0)
    } else {
      process.exit(0)
    }
  })
}
