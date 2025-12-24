const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config()

console.log('Env loaded:', {
  host: process.env.POSTGRES_HOST,
  db: process.env.POSTGRES_DATABASE,
  schema: process.env.POSTGRES_SCHEMA
})

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false
})

async function listTables() {
  try {
    const res = await pool.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
      ORDER BY table_schema, table_name
    `)
    console.log('Tables found:')
    res.rows.forEach((r) => console.log(`${r.table_schema}.${r.table_name}`))
    await pool.end()
  } catch (err) {
    console.error('Error:', err)
  }
}

listTables()
