import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '@/lib/data-access/users/user.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  schema: process.env.POSTGRES_SCHEMA,
  entities: [User],
  synchronize: false, // Use migrations in production!
  logging: process.env.NODE_ENV === 'development',
  migrations: [__dirname + '/migrations/*.ts']
})

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch((error) => console.error('Data Source initialization error', error))

export function getDataSource() {
  if (!AppDataSource) {
    throw new Error('Data source is not initialized')
  }
  return AppDataSource
}

if (process.env.NODE_ENV === 'production') {
  process.on('SIGINT', async () => {
    if (AppDataSource?.isInitialized) {
      await AppDataSource.destroy()
      console.log('Database connection closed.')
      process.exit(0)
    }
  })
}
