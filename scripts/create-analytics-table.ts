import { Client } from 'pg'
import fs from 'fs'
import path from 'path'

async function main() {
  console.log('Using direct pg connection for migration...')

  // 1. Manually read .env.local to find DB credentials
  // avoiding all app-level Zod validation
  const envPath = path.resolve(__dirname, '../.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local not found at', envPath)
    process.exit(1)
  }

  const envContent = fs.readFileSync(envPath, 'utf-8')
  const envVars: Record<string, string> = {}

  envContent.split('\n').forEach((line) => {
    // Match key: value OR key=value
    const match = line.match(/^([^=:]+)[:=](.*)$/)
    if (match) {
      const key = match[1].trim()
      let value = match[2].trim()
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1)
      }
      envVars[key] = value
    }
  })

  // 2. Construct connection string or config
  // POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DATABASE
  const msg = (key: string) => `Missing ${key} in .env.local`

  if (!envVars.POSTGRES_USER) throw new Error(msg('POSTGRES_USER'))
  if (!envVars.POSTGRES_HOST) throw new Error(msg('POSTGRES_HOST'))
  if (!envVars.POSTGRES_DATABASE) throw new Error(msg('POSTGRES_DATABASE'))
  if (!envVars.POSTGRES_PASSWORD) throw new Error(msg('POSTGRES_PASSWORD'))

  const client = new Client({
    user: envVars.POSTGRES_USER,
    password: envVars.POSTGRES_PASSWORD,
    host: envVars.POSTGRES_HOST,
    port: parseInt(envVars.POSTGRES_PORT || '5432'),
    database: envVars.POSTGRES_DATABASE,
    ssl: envVars.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false
  })

  try {
    await client.connect()
    console.log('✅ Connected to database')

    // 3. Run the migration SQL
    console.log('Creating analytics_events table...')

    await client.query(`
      CREATE TABLE IF NOT EXISTS "artiverse"."analytics_events" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "event_type" varchar(50) NOT NULL,
        "user_id" uuid,
        "session_id" varchar(100),
        "path" varchar(255),
        "metadata" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `)

    // Add foreign key if it doesn't exist
    // Checking existence is a bit complex in raw SQL,
    // so we'll just try/catch the constraint creation
    try {
      await client.query(`
        ALTER TABLE "artiverse"."analytics_events" 
        ADD CONSTRAINT "analytics_events_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "artiverse"."users"("id") 
        ON DELETE no action ON UPDATE no action;
        `)
      console.log('Constraint added.')
    } catch (err: unknown) {
      // Code 42710 usually means duplicate object (constraint exists)
      const error = err as { code?: string; message?: string }
      if (error.code === '42710' || error.message?.includes('already exists')) {
        console.log(
          'Constraint analytics_events_user_id_users_id_fk already exists, skipping.'
        )
      } else {
        throw err
      }
    }

    console.log('✅ Migration successful')
  } catch (err) {
    console.error('❌ Migration failed:', err)
  } finally {
    await client.end()
  }
}

main()
