import dotenv from 'dotenv'
import path from 'path'

console.log('Loading .env files...')
const localResult = dotenv.config({
  path: path.resolve(process.cwd(), '.env.local')
})
const defaultResult = dotenv.config({
  path: path.resolve(process.cwd(), '.env')
})

console.log('Local .env loaded:', localResult.error ? 'No' : 'Yes')
if (localResult.parsed)
  console.log('Local keys:', Object.keys(localResult.parsed))
console.log('Default .env loaded:', defaultResult.error ? 'No' : 'Yes')

console.log('Checking POSTGRES_HOST:', process.env.POSTGRES_HOST)
console.log(
  'Checking POSTGRES_PASSWORD:',
  process.env.POSTGRES_PASSWORD ? '******' : 'undefined'
)

/*
import { db } from '../src/lib/database/drizzle'
import { env } from '../src/lib/config/env.config'
import { sql } from 'drizzle-orm'

async function debugDb() {
  console.log('Environment Config:')
  console.log(`Host: ${env.POSTGRES_HOST}`)
  console.log(`Port: ${env.POSTGRES_PORT}`)
  console.log(`User: ${env.POSTGRES_USER}`)
  console.log(`Database: ${env.POSTGRES_DATABASE}`)
  console.log(`SSL: ${env.POSTGRES_SSL}`)

  console.log('Attempting to connect...')
  try {
    const start = performance.now()
    await db.execute(sql`SELECT 1`)
    const end = performance.now()
    console.log(`Connected! Latency: ${(end - start).toFixed(2)}ms`)
  } catch (err) {
    console.error('Connection failed:', err)
  }
}

debugDb().then(() => process.exit(0))
*/
