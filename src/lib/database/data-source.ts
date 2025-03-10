import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entities/auth/user.entity'

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
