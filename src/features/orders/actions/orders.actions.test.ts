import { getUserOrders, getUserOrder, getUserActivity } from './orders.actions'
import { auth } from '@/features/authentication/lib/next-auth'
import { db } from '@/lib/database/drizzle'

// Mock dependencies
jest.mock('@/features/authentication/lib/next-auth', () => ({
  auth: jest.fn()
}))

jest.mock('@/lib/database/drizzle', () => ({
  db: {
    select: jest.fn()
  }
}))

// Mock schema tables to avoid import issues if they are used in queries
jest.mock('@/lib/database/schema', () => ({
  orders: {
    userId: 'orders.userId',
    id: 'orders.id',
    createdAt: 'orders.createdAt'
  },
  orderItems: { orderId: 'orderItems.orderId' },
  orderEvents: {
    orderId: 'orderEvents.orderId',
    createdAt: 'orderEvents.createdAt'
  }
  // Add other necessary fields as string mocks
}))

// Helper to create a chainable mock object
const createChainableMock = () => {
  const mock = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis()
  }
  return mock
}

describe('Orders Actions', () => {
  let mockDb: ReturnType<typeof createChainableMock>

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb = createChainableMock()
    ;(db.select as jest.Mock).mockImplementation(mockDb.select)
  })

  describe('getUserOrders', () => {
    it('should return error if not authenticated', async () => {
      ;(auth as jest.Mock).mockResolvedValue(null)
      const result = await getUserOrders()
      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authenticated')
    })

    it('should return orders for user', async () => {
      ;(auth as jest.Mock).mockResolvedValue({ user: { id: 'user1' } })

      const mockOrders = [
        {
          id: 'order1',
          total: '100',
          status: 'pending',
          createdAt: new Date()
        },
        { id: 'order2', total: '200', status: 'shipped', createdAt: new Date() }
      ]

      const mockItems = [
        { orderId: 'order1' },
        { orderId: 'order1' },
        { orderId: 'order2' }
      ]

      // Mock chain for orders
      const mockSelectOrders = createChainableMock()
      mockSelectOrders.orderBy.mockResolvedValue(mockOrders)

      // Mock chain for items
      const mockSelectItems = createChainableMock()
      mockSelectItems.where.mockResolvedValue(mockItems)
      ;(db.select as jest.Mock)
        .mockReturnValueOnce(mockSelectOrders) // 1. select orders
        .mockReturnValueOnce(mockSelectItems) // 2. select items

      const result = await getUserOrders()

      expect(result.success).toBe(true)
      expect(result.orders).toHaveLength(2)
      expect(result.orders![0].itemCount).toBe(2)
      expect(result.orders![1].itemCount).toBe(1)
    })
  })

  describe('getUserOrder', () => {
    it('should return error if not authenticated', async () => {
      ;(auth as jest.Mock).mockResolvedValue(null)
      const result = await getUserOrder('order1')
      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authenticated')
    })

    it('should return order with items', async () => {
      ;(auth as jest.Mock).mockResolvedValue({ user: { id: 'user1' } })

      const mockOrder = {
        id: 'order1',
        userId: 'user1',
        total: '100',
        subtotal: '90',
        shipping: '5',
        tax: '5',
        customerFirstName: 'John',
        customerLastName: 'Doe',
        customerEmail: 'test@example.com',
        shippingAddress: '123 St',
        shippingCity: 'City',
        shippingState: 'St',
        shippingCountry: 'Country',
        status: 'pending',
        paymentMethod: 'card',
        createdAt: new Date()
      }
      const mockItems = [
        {
          productId: 'p1',
          productTitle: 'P1',
          quantity: 1,
          unitPrice: '90',
          totalPrice: '90'
        }
      ]

      const mockSelectOrder = createChainableMock()
      mockSelectOrder.where.mockResolvedValue([mockOrder])

      const mockSelectItems = createChainableMock()
      mockSelectItems.where.mockResolvedValue(mockItems)
      ;(db.select as jest.Mock)
        .mockReturnValueOnce(mockSelectOrder)
        .mockReturnValueOnce(mockSelectItems)

      const result = await getUserOrder('order1')

      expect(result.success).toBe(true)
      expect(result.order!.id).toBe('order1')
      expect(result.order!.items).toHaveLength(1)
    })
  })
})
