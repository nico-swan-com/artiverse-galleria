'use server'

import { auth } from '@/lib/authentication/next-auth'
import { ordersRepository } from '@/features/billing/lib/orders.repository'
import { db } from '@/lib/database/drizzle'
import { orders, orderItems, orderEvents } from '@/lib/database/schema'
import { eq, desc } from 'drizzle-orm'

export interface OrderSummary {
  id: string
  total: number
  status: string
  itemCount: number
  createdAt: Date
}

export interface OrderWithItems {
  id: string
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingCountry: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: string
  paymentMethod: string | null
  createdAt: Date
  items: {
    productId: string
    productTitle: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }[]
}

export interface ActivityEvent {
  id: string
  type: string
  orderId: string
  status: string
  description: string
  date: Date
}

/**
 * Get all orders for the current user
 */
export async function getUserOrders(): Promise<{
  success: boolean
  orders?: OrderSummary[]
  error?: string
}> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, session.user.id))
      .orderBy(desc(orders.createdAt))

    // Get item counts for each order
    const orderSummaries: OrderSummary[] = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id))

        return {
          id: order.id,
          total: parseFloat(order.total),
          status: order.status,
          itemCount: items.length,
          createdAt: order.createdAt
        }
      })
    )

    return { success: true, orders: orderSummaries }
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return { success: false, error: 'Failed to fetch orders' }
  }
}

/**
 * Get a specific order with items for the current user
 */
export async function getUserOrder(
  orderId: string
): Promise<{ success: boolean; order?: OrderWithItems; error?: string }> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId))

    if (!order) {
      return { success: false, error: 'Order not found' }
    }

    // Verify order belongs to user
    if (order.userId !== session.user.id) {
      return { success: false, error: 'Order not found' }
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))

    const orderWithItems: OrderWithItems = {
      id: order.id,
      customerFirstName: order.customerFirstName,
      customerLastName: order.customerLastName,
      customerEmail: order.customerEmail,
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingState: order.shippingState,
      shippingCountry: order.shippingCountry,
      subtotal: parseFloat(order.subtotal),
      shipping: parseFloat(order.shipping),
      tax: parseFloat(order.tax),
      total: parseFloat(order.total),
      status: order.status,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      items: items.map((item) => ({
        productId: item.productId,
        productTitle: item.productTitle,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice),
        totalPrice: parseFloat(item.totalPrice)
      }))
    }

    return { success: true, order: orderWithItems }
  } catch (error) {
    console.error('Error fetching user order:', error)
    return { success: false, error: 'Failed to fetch order' }
  }
}

/**
 * Get activity events for the current user from order_events table
 */
export async function getUserActivity(): Promise<{
  success: boolean
  activity?: ActivityEvent[]
  error?: string
}> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user's orders first
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, session.user.id))

    if (userOrders.length === 0) {
      return { success: true, activity: [] }
    }

    // Get all events for user's orders
    const allEvents: ActivityEvent[] = []
    for (const order of userOrders) {
      const events = await db
        .select()
        .from(orderEvents)
        .where(eq(orderEvents.orderId, order.id))
        .orderBy(desc(orderEvents.createdAt))

      for (const event of events) {
        allEvents.push({
          id: event.id,
          type: event.eventType,
          orderId: event.orderId,
          status: event.status,
          description: event.description,
          date: event.createdAt
        })
      }
    }

    // Sort by date descending
    allEvents.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return { success: true, activity: allEvents }
  } catch (error) {
    console.error('Error fetching user activity:', error)
    return { success: false, error: 'Failed to fetch activity' }
  }
}
