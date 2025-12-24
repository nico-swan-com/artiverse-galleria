import 'dotenv/config'
import { db } from './drizzle'
import { users, artists, products, media } from './schema'
import { getUsers } from './data/users'
import { artists as artistsData } from './data/artists'
import { artworks as productsData } from './data/artworks'
import { mediaFiles as mediaData } from './data/media'
import { Table, getTableName, sql } from 'drizzle-orm'

async function resetTable(db: any, table: Table) {
  return db.delete(table)
}

async function seed() {
  try {
    console.log('🌱 Starting seed...')

    // 1. Clean up existing data in reverse order of dependency
    console.log('🧹 Cleaning database...')
    await resetTable(db, products)
    await resetTable(db, artists)
    await resetTable(db, media)
    await resetTable(db, users)

    // 2. Seed Users
    console.log('👤 Seeding users...')
    const usersData = await getUsers()
    await db.insert(users).values(usersData)
    console.log('✅ Users seeded')

    // 3. Seed Media
    console.log('🖼️ Seeding media...')
    // Media data usually has 'id' which might conflict if we allow auto-gen, but here we provide IDs
    // Convert hex string data to Buffer and date strings to Date objects
    const mediaDataWithBuffers = mediaData.map((item) => ({
      ...item,
      data: Buffer.from(item.data, 'hex'),
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt)
    }))
    await db.insert(media).values(mediaDataWithBuffers)
    console.log('✅ Media seeded')

    // 4. Seed Artists
    console.log('🎨 Seeding artists...')
    await db.insert(artists).values(artistsData)
    console.log('✅ Artists seeded')

    // 5. Seed Products
    console.log('📦 Seeding products...')
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
    console.log('✅ Products seeded')

    console.log('✅ Seeding completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
