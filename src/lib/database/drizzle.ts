import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'
import { env } from '../config/env.config'

/**
 * Determine SSL configuration:
 * 1. If POSTGRES_SSL is explicitly set, use that value
 * 2. Otherwise, only use SSL in production
 */
const getSSLConfig = () => {
  if (env.POSTGRES_SSL !== undefined) {
    return env.POSTGRES_SSL ? { rejectUnauthorized: false } : false
  }
  return env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
}

const pool = new Pool({
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DATABASE,
  ssl: getSSLConfig()
})

export const db = drizzle(pool, { schema })
