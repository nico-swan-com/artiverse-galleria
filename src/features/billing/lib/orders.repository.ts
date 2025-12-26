/**
 * Orders Repository
 *
 * Database access layer for orders, order items, and order events.
 */

import { db } from '@/lib/database'
import {
  orders,
  orderItems,
  orderEvents,
  Order as DbOrder,
  NewOrder,
  OrderItem as DbOrderItem,
  NewOrderItem,
  OrderEvent as DbOrderEvent,
  NewOrderEvent
} from '@/lib/database/schema'
import { eq, desc } from 'drizzle-orm'
import { logger } from '@/lib/utilities/logger'

export class OrdersRepository {
  /**
   * Create a new order with items
   */
  async create(
    orderData: NewOrder,
    items: Omit<NewOrderItem, 'orderId'>[]
  ): Promise<DbOrder> {
    // Insert order
    const [order] = await db.insert(orders).values(orderData).returning()

    // Insert order items
    if (items.length > 0) {
      const orderItemsData = items.map((item) => ({
        ...item,
        orderId: order.id
      }))
      await db.insert(orderItems).values(orderItemsData)
    }

    // Log order created event
    await this.logEvent({
      orderId: order.id,
      eventType: 'order_placed',
      status: 'pending',
      description: `Order placed - R${parseFloat(order.total).toLocaleString()}`
    })

    logger.info('Order created in database', {
      orderId: order.id,
      itemCount: items.length
    })

    return order
  }

  /**
   * Find order by ID
   */
  async findById(orderId: string): Promise<DbOrder | null> {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId))
    return order || null
  }

  /**
   * Find order with items
   */
  async findByIdWithItems(
    orderId: string
  ): Promise<{ order: DbOrder; items: DbOrderItem[] } | null> {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId))

    if (!order) return null

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))

    return { order, items }
  }

  /**
   * Find orders by user ID
   */
  async findByUserId(userId: string): Promise<DbOrder[]> {
    return db.select().from(orders).where(eq(orders.userId, userId))
  }

  /**
   * Update order status and log event
   */
  async updateStatus(
    orderId: string,
    status: string,
    eventType?: string,
    description?: string
  ): Promise<DbOrder | null> {
    const [updated] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning()

    if (updated) {
      // Log status change event
      await this.logEvent({
        orderId,
        eventType: eventType || `status_${status}`,
        status,
        description: description || `Order status changed to ${status}`
      })
    }

    return updated || null
  }

  /**
   * Update order payment info
   */
  async updatePayment(
    orderId: string,
    paymentId: string,
    paymentMethod: string
  ): Promise<DbOrder | null> {
    const [updated] = await db
      .update(orders)
      .set({ paymentId, paymentMethod, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning()

    if (updated) {
      // Log payment initiated event
      await this.logEvent({
        orderId,
        eventType: 'payment_initiated',
        status: 'processing',
        description: `Payment initiated via ${paymentMethod}`
      })
    }

    return updated || null
  }

  /**
   * Log an order event
   */
  async logEvent(
    event: Omit<NewOrderEvent, 'id' | 'createdAt'>
  ): Promise<void> {
    await db.insert(orderEvents).values(event)
  }

  /**
   * Get events for an order
   */
  async getEventsByOrderId(orderId: string): Promise<DbOrderEvent[]> {
    return db
      .select()
      .from(orderEvents)
      .where(eq(orderEvents.orderId, orderId))
      .orderBy(desc(orderEvents.createdAt))
  }

  /**
   * Get events for a user (across all their orders)
   */
  async getEventsByUserId(userId: string): Promise<DbOrderEvent[]> {
    const userOrders = await this.findByUserId(userId)
    const orderIds = userOrders.map((o) => o.id)

    if (orderIds.length === 0) return []

    // Get all events for user's orders
    const allEvents: DbOrderEvent[] = []
    for (const orderId of orderIds) {
      const events = await db
        .select()
        .from(orderEvents)
        .where(eq(orderEvents.orderId, orderId))
      allEvents.push(...events)
    }

    // Sort by createdAt descending
    return allEvents.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }
}

export const ordersRepository = new OrdersRepository()
