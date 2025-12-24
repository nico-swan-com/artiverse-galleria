import {
  pgTable,
  pgSchema,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  serial,
  uniqueIndex,
  customType
} from 'drizzle-orm/pg-core'
import {
  relations,
  sql,
  type InferSelectModel,
  type InferInsertModel
} from 'drizzle-orm'

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return 'bytea'
  }
})

export const artiverseSchema = pgSchema('artiverse')

export const users = artiverseSchema.table('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email').notNull().unique(),
  name: varchar('name').notNull(),
  avatar: text('avatar'),
  password: varchar('password').notNull(),
  role: varchar('role').default('Client').notNull(),
  status: varchar('status').default('Pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at')
})

export const artists = artiverseSchema.table('artists', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  image: text('image').notNull(),
  featured: boolean('featured').default(false).notNull(),
  styles: text('styles')
    .array()
    .default(sql`'{}'::text[]`)
    .notNull(),
  biography: text('biography').notNull(),
  specialization: varchar('specialization').notNull(),
  location: varchar('location').notNull(),
  email: varchar('email').notNull(),
  website: varchar('website'),
  exhibitions: text('exhibitions')
    .array()
    .default(sql`'{}'::text[]`)
    .notNull(),
  statement: text('statement').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at')
})

export const products = artiverseSchema.table(
  'products',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sku: serial('sku').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    stock: integer('stock').notNull(),
    featureImage: text('feature_image'),
    images: text('images').array(),
    sales: decimal('sales', { precision: 10, scale: 2 }).notNull(),
    featured: boolean('featured').default(false).notNull(),
    productType: varchar('product_type', { length: 50 })
      .default('physical')
      .notNull(),
    category: varchar('category', { length: 50 }).notNull(),
    artistId: uuid('artist_id').references(() => artists.id),
    yearCreated: integer('year_created'),
    medium: varchar('medium', { length: 100 }),
    dimensions: varchar('dimensions', { length: 100 }),
    weight: varchar('weight', { length: 50 }),
    style: varchar('style', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at')
  },
  (table) => {
    return {
      skuIdx: uniqueIndex('products_sku_key').on(table.sku)
    }
  }
)

export const media = artiverseSchema.table('media', {
  id: uuid('id').defaultRandom().primaryKey(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 50 }).notNull(),
  fileSize: integer('file_size').notNull(),
  data: bytea('data').notNull(),
  altText: varchar('alt_text', { length: 255 }),
  contentHash: varchar('content_hash', { length: 64 }),
  tags: text('tags')
    .array()
    .default(sql`ARRAY[]::text[]`),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// Define Relations
export const productsRelations = relations(products, ({ one }) => ({
  artist: one(artists, {
    fields: [products.artistId],
    references: [artists.id]
  })
}))

export const artistsRelations = relations(artists, ({ many }) => ({
  products: many(products)
}))

// Type definitions
export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export type Artist = InferSelectModel<typeof artists>
export type NewArtist = InferInsertModel<typeof artists>

export type Product = InferSelectModel<typeof products>
export type NewProduct = InferInsertModel<typeof products>

export type Media = InferSelectModel<typeof media>
export type NewMedia = InferInsertModel<typeof media>
