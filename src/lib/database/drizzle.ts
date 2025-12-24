import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// Determine SSL configuration:
// 1. If POSTGRES_SSL is explicitly set, use that value
// 2. Otherwise, only use SSL in production
const getSSLConfig = () => {
  if (process.env.POSTGRES_SSL !== undefined) {
    return process.env.POSTGRES_SSL === 'true'
      ? { rejectUnauthorized: false }
      : false
  }
  return process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
}

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  ssl: getSSLConfig()
})

export const db = drizzle(pool, { schema })
