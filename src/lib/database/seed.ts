import 'dotenv/config'
import { db } from './drizzle'
import { users, artists, products, media } from './schema'
import { getUsers } from './data/users'
import { artists as artistsData } from './data/artists'
import { artworks as productsData } from './data/artworks'
import { mediaFiles as mediaData } from './data/media'
import { Table } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type * as schema from './schema'
import { logger } from '../utilities/logger'

type Database = NodePgDatabase<typeof schema>

async function resetTable(db: Database, table: Table) {
  return db.delete(table)
}

async function seed() {
  try {
    logger.info('Starting database seed')

    // 1. Clean up existing data in reverse order of dependency
    logger.info('Cleaning database')
    await resetTable(db, products)
    await resetTable(db, artists)
    await resetTable(db, media)
    await resetTable(db, users)

    // 2. Seed Users
    logger.info('Seeding users')
    const usersData = await getUsers()
    await db.insert(users).values(usersData)
    logger.info('Users seeded', { count: usersData.length })

    // 3. Seed Media
    logger.info('Seeding media')
    // Media data usually has 'id' which might conflict if we allow auto-gen, but here we provide IDs
    // Convert hex string data to Buffer and date strings to Date objects
    const mediaDataWithBuffers = mediaData.map((item) => ({
      ...item,
      data: Buffer.from(item.data, 'hex'),
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt)
    }))
    await db.insert(media).values(mediaDataWithBuffers)
    logger.info('Media seeded', { count: mediaDataWithBuffers.length })

    // 4. Seed Artists
    logger.info('Seeding artists')
    await db.insert(artists).values(artistsData)
    logger.info('Artists seeded', { count: artistsData.length })

    // 5. Seed Products
    logger.info('Seeding products')
    // Convert price and sales from number to string for decimal type
    // Ensure featureImage is a string (not File)
    // Filter images array to only include strings
    const productsDataWithStringPrice = productsData.map((item) => ({
      ...item,
      price: item.price.toString(),
      sales: item.sales.toString(),
      featureImage:
        typeof item.featureImage === 'string'
          ? item.featureImage
          : item.featureImage instanceof File
            ? null
            : item.featureImage,
      images: item.images
        ? item.images.filter((img): img is string => typeof img === 'string')
        : item.images
    }))
    await db.insert(products).values(productsDataWithStringPrice)
    logger.info('Products seeded', {
      count: productsDataWithStringPrice.length
    })

    logger.info('Seeding completed successfully')
  } catch (error) {
    logger.error('Seeding failed', error)
    throw error
  }
}

seed().catch((error) => {
  logger.error('Fatal error during seeding', error)
  process.exit(1)
})
