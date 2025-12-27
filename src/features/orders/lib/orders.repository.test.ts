import { OrdersRepository } from './orders.repository'
import { db } from '@/lib/database/drizzle'
import { logger } from '@/lib/utilities/logger'

// Mock dependencies
jest.mock('@/lib/database/drizzle', () => ({
  db: {
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn()
  }
}))

jest.mock('@/lib/utilities/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}))

// Helper to create a chainable mock object
const createChainableMock = () => {
  const mock = {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis()
  }
  return mock
}

describe('OrdersRepository', () => {
  let repository: OrdersRepository
  let mockDb: ReturnType<typeof createChainableMock>

  beforeEach(() => {
    jest.clearAllMocks()
    repository = new OrdersRepository()

    // Setup db mocks
    mockDb = createChainableMock()
    ;(db.insert as jest.Mock).mockImplementation(mockDb.insert)
    ;(db.select as jest.Mock).mockImplementation(mockDb.select)
    ;(db.update as jest.Mock).mockImplementation(mockDb.update)
  })

  describe('create', () => {
    it('should create an order and items', async () => {
      const orderData = {
        userId: 'user1',
        total: '100.00',
        subtotal: '90.00',
        shipping: '5.00',
        tax: '5.00',
        status: 'pending',
        shippingAddress: '123 St',
        shippingCity: 'City',
        shippingState: 'St',
        shippingCountry: 'Country',
        shippingZip: '12345',
        customerEmail: 'test@example.com',
        customerFirstName: 'John',
        customerLastName: 'Doe'
      }
      const items = [
        {
          productId: 'prod1',
          productTitle: 'Product 1',
          quantity: 1,
          unitPrice: '90.00',
          totalPrice: '90.00'
        }
      ]

      const mockOrder = { id: 'order1', ...orderData }

      // Setup chain returns
      mockDb.insert.mockReturnValue(mockDb) // insert
      mockDb.values.mockReturnValue(mockDb) // values
      mockDb.returning.mockResolvedValueOnce([mockOrder]) // insert order returning

      // For logEvent which calls insert->values
      // We need to handle subsequent calls.
      // The implementation calls db.insert(orders)... then db.insert(orderItems)...
      // It's easier if we mock the repository methods if we want to isolate 'create' vs 'logEvent',
      // but here we are testing the repository itself, so we mock the db calls.

      // db.insert(orders) -> mockDb chain
      // db.insert(orderItems) -> mockDb chain
      // db.insert(orderEvents) -> mockDb chain

      // Since we use the same mockDb object for all calls, we need to be careful about return values if they differ.
      // But typically we can just assume the chain works.
      // However, `returning` is called for orders, but NOT for items or events.
      // And `values` is called differently.

      // Let's refine the mock strategy.
      const mockInsertOrder = createChainableMock()
      mockInsertOrder.returning.mockResolvedValue([mockOrder])

      const mockInsertItems = createChainableMock()
      mockInsertItems.values.mockResolvedValue(undefined)

      const mockInsertEvent = createChainableMock()
      mockInsertEvent.values.mockResolvedValue(undefined)
      ;(db.insert as jest.Mock)
        .mockReturnValueOnce(mockInsertOrder) // 1. insert order
        .mockReturnValueOnce(mockInsertItems) // 2. insert items
        .mockReturnValueOnce(mockInsertEvent) // 3. log event

      const result = await repository.create(
        orderData as Parameters<typeof repository.create>[0],
        items as Parameters<typeof repository.create>[1]
      )

      expect(result).toEqual(mockOrder)
      expect(db.insert).toHaveBeenCalledTimes(3)
      expect(logger.info).toHaveBeenCalled()
    })
  })

  describe('findById', () => {
    it('should return null if order not found', async () => {
      const mockSelect = createChainableMock()
      mockSelect.where.mockResolvedValue([])
      ;(db.select as jest.Mock).mockReturnValue(mockSelect)

      const result = await repository.findById('non-existent')
      expect(result).toBeNull()
    })

    it('should return order if found', async () => {
      const mockOrder = { id: 'order1' }
      const mockSelect = createChainableMock()
      mockSelect.where.mockResolvedValue([mockOrder])
      ;(db.select as jest.Mock).mockReturnValue(mockSelect)

      const result = await repository.findById('order1')
      expect(result).toEqual(mockOrder)
    })
  })

  describe('findByUserId', () => {
    it('should return orders for user', async () => {
      const mockOrders = [{ id: 'order1' }, { id: 'order2' }]
      const mockSelect = createChainableMock()
      mockSelect.where.mockResolvedValue(mockOrders)
      ;(db.select as jest.Mock).mockReturnValue(mockSelect)

      const result = await repository.findByUserId('user1')
      expect(result).toEqual(mockOrders)
    })
  })

  describe('updateStatus', () => {
    it('should update status and log event', async () => {
      const mockUpdatedOrder = { id: 'order1', status: 'shipped' }

      const mockUpdate = createChainableMock()
      mockUpdate.returning.mockResolvedValue([mockUpdatedOrder])
      ;(db.update as jest.Mock).mockReturnValue(mockUpdate)

      const mockInsertEvent = createChainableMock()
      mockInsertEvent.values.mockResolvedValue(undefined)
      ;(db.insert as jest.Mock).mockReturnValue(mockInsertEvent)

      const result = await repository.updateStatus('order1', 'shipped')

      expect(result).toEqual(mockUpdatedOrder)
      expect(db.update).toHaveBeenCalled()
      expect(db.insert).toHaveBeenCalled() // logEvent
    })
  })
})
