import 'reflect-metadata'
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm'
import { ProductEntity } from '../products/model/products.entity'
import { Artist } from '../artists/model/artist.entity'
import { User } from '../users/model/user.entity'
import { MediaEntity } from '../media'

// This promise will hold the single connection instance
let dataSourcePromise: Promise<DataSource> | null = null

export class DatabaseConnectionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseConnectionError'
  }
}

const createAndInitializeDataSource = async (
  maxRetries: number = 5,
  retryDelay: number = 3000,
  maxWaitTime: number = 120000 // Increased to 2 minutes
): Promise<DataSource> => {
  // Skip database initialization during build time
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PHASE === 'phase-production-build'
  ) {
    console.debug('Skipping database initialization during build phase')
    // Return a mock DataSource to prevent errors during build
    return {
      getRepository: () => {
        throw new Error(
          'getRepository called during build phase; database unavailable'
        )
      }
    } as unknown as DataSource
  }

  // Debug: Log the actual environment variables being used
  console.debug('Database connection config:', {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DATABASE,
    schema: process.env.POSTGRES_SCHEMA,
    password: process.env.POSTGRES_PASSWORD ? '[REDACTED]' : 'NOT_SET'
  })

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    schema: process.env.POSTGRES_SCHEMA || 'public',
    entities: [User, Artist, ProductEntity, MediaEntity],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    migrations: [__dirname + '/migrations/*.ts']
  })

  console.debug('DataSource created', dataSource)

  let attempts = 0
  const startTime = Date.now()

  // Ensure we attempt all retries regardless of time
  while (attempts < maxRetries) {
    attempts++
    try {
      if (!dataSource.isInitialized) {
        console.debug(
          `Initializing DataSource (attempt ${attempts}/${maxRetries})`
        )
        await dataSource.initialize()
        // Verify connection
        await dataSource.query('SELECT 1')
        console.info('Database connection initialized and verified')
        return dataSource
      }
      return dataSource
    } catch (error) {
      console.error(
        `Failed to initialize database (attempt ${attempts}/${maxRetries}):`,
        error
      )

      if (dataSource.isInitialized) {
        await dataSource.destroy()
      }

      // Check if we should continue retrying
      if (attempts < maxRetries) {
        const elapsedTime = Date.now() - startTime
        if (elapsedTime >= maxWaitTime) {
          console.warn(
            `Max wait time (${maxWaitTime}ms) exceeded, but will attempt remaining retries`
          )
        }

        console.debug(
          `Retrying in ${retryDelay}ms... (${maxRetries - attempts} attempts remaining)`
        )
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
      } else {
        const totalTime = Date.now() - startTime
        throw new DatabaseConnectionError(
          `Max retries (${maxRetries}) reached after ${totalTime}ms. Unable to connect to the database.`
        )
      }
    }
  }

  throw new DatabaseConnectionError(
    'Unable to initialize database within the specified constraints.'
  )
}

export const getDataSource = (): Promise<DataSource> => {
  if (!dataSourcePromise) {
    console.debug('Creating new DataSource connection promise.')
    dataSourcePromise = createAndInitializeDataSource()
  }
  return dataSourcePromise
}

export const getRepository = async <T extends ObjectLiteral>(
  entity: EntityTarget<T>
): Promise<Repository<T>> => {
  try {
    const dataSource = await getDataSource()
    if (!dataSource.getRepository) {
      // This handles the build-time mock case
      throw new Error('Database operations not available during build phase')
    }
    return dataSource.getRepository<T>(entity)
  } catch (error) {
    console.error('Error getting repository:', error)
    // Ensure we don't leak raw errors
    if (error instanceof DatabaseConnectionError) {
      throw error
    }
    throw new DatabaseConnectionError(
      'Failed to get repository due to a database connection issue.'
    )
  }
}

// Graceful shutdown in production
if (process.env.NODE_ENV === 'production') {
  process.on('SIGINT', async () => {
    if (dataSourcePromise) {
      try {
        const dataSource = await dataSourcePromise
        if (dataSource?.isInitialized) {
          console.info('Closing database connection...')
          await dataSource.destroy()
          console.info('Database connection closed.')
        }
      } catch (error) {
        console.error('Error closing database connection:', error)
      } finally {
        process.exit(0)
      }
    } else {
      process.exit(0)
    }
  })
}
