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

// Orders table
export const orders = artiverseSchema.table('orders', {
  id: varchar('id', { length: 50 }).primaryKey(), // ORD-xxx format
  userId: uuid('user_id').references(() => users.id),
  // Customer info (for guest checkout)
  customerFirstName: varchar('customer_first_name', { length: 100 }).notNull(),
  customerLastName: varchar('customer_last_name', { length: 100 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 50 }),
  // Shipping address
  shippingAddress: text('shipping_address').notNull(),
  shippingCity: varchar('shipping_city', { length: 100 }).notNull(),
  shippingState: varchar('shipping_state', { length: 100 }).notNull(),
  shippingZip: varchar('shipping_zip', { length: 20 }).notNull(),
  shippingCountry: varchar('shipping_country', { length: 100 }).notNull(),
  // Order totals
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  shipping: decimal('shipping', { precision: 10, scale: 2 }).notNull(),
  tax: decimal('tax', { precision: 10, scale: 2 }).notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  // Status and payment
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentId: varchar('payment_id', { length: 100 }),
  notes: text('notes'),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// Order items table
export const orderItems = artiverseSchema.table('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: varchar('order_id', { length: 50 })
    .references(() => orders.id)
    .notNull(),
  productId: uuid('product_id')
    .references(() => products.id)
    .notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  // Store product snapshot for historical accuracy
  productTitle: varchar('product_title', { length: 255 }).notNull(),
  productSku: integer('product_sku'),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// Order events table for audit trail
export const orderEvents = artiverseSchema.table('order_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: varchar('order_id', { length: 50 })
    .references(() => orders.id)
    .notNull(),
  eventType: varchar('event_type', { length: 50 }).notNull(), // order_placed, payment_initiated, payment_completed, etc.
  status: varchar('status', { length: 50 }).notNull(), // pending, processing, paid, etc.
  description: text('description').notNull(),
  metadata: text('metadata'), // JSON string for additional data
  createdAt: timestamp('created_at').defaultNow().notNull()
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

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id]
  }),
  items: many(orderItems),
  events: many(orderEvents)
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
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

export type Order = InferSelectModel<typeof orders>
export type NewOrder = InferInsertModel<typeof orders>

export type OrderItem = InferSelectModel<typeof orderItems>
export type NewOrderItem = InferInsertModel<typeof orderItems>

export type OrderEvent = InferSelectModel<typeof orderEvents>
export type NewOrderEvent = InferInsertModel<typeof orderEvents>

// Analytics events table for tracking user activity
export const analyticsEvents = artiverseSchema.table('analytics_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  userId: uuid('user_id').references(() => users.id),
  sessionId: varchar('session_id', { length: 100 }),
  path: varchar('path', { length: 255 }),
  metadata: text('metadata'), // JSON string for additional data
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export type AnalyticsEventDb = InferSelectModel<typeof analyticsEvents>
export type NewAnalyticsEvent = InferInsertModel<typeof analyticsEvents>
