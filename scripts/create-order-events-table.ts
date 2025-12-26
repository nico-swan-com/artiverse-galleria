import 'dotenv/config'
import { db } from '../src/lib/database/drizzle'
import { sql } from 'drizzle-orm'

async function createOrderEventsTable() {
  console.log('Creating order_events table...')

  try {
    // Check if table exists
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'artiverse' 
        AND table_name = 'order_events'
      );
    `)

    console.log('Table exists check:', result)

    // Create table if not exists
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS artiverse.order_events (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        order_id varchar(50) NOT NULL,
        event_type varchar(50) NOT NULL,
        status varchar(50) NOT NULL,
        description text NOT NULL,
        metadata text,
        created_at timestamp DEFAULT now() NOT NULL
      );
    `)

    console.log('Table created!')

    // Add foreign key if not exists
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'order_events_order_id_orders_id_fk'
        ) THEN
          ALTER TABLE artiverse.order_events 
          ADD CONSTRAINT order_events_order_id_orders_id_fk 
          FOREIGN KEY (order_id) REFERENCES artiverse.orders(id);
        END IF;
      END $$;
    `)

    console.log('Foreign key added!')
    console.log('Done!')
  } catch (error) {
    console.error('Error:', error)
  }

  process.exit(0)
}

createOrderEventsTable()
