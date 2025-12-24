import 'reflect-metadata'
import { DataSource, DataSourceOptions } from 'typeorm'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.migration' })

const configuration = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  schema: process.env.POSTGRES_SCHEMA || 'public',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/seeding/*.js'],
  synchronize: false,
  logging: false
} as DataSourceOptions

const dataSource = new DataSource(configuration)

export default dataSource
