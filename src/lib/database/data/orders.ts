import { NewOrder, NewOrderItem } from '../schema'
import { artworks } from './artworks'

// Client User ID from users.ts
const CLIENT_USER_ID = 'b2c3d4e5-f6a7-8901-2345-6789abcdef01'

// Helper to calculate totals
const calculateOrderTotals = (items: { price: number; quantity: number }[]) => {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
  const shipping = 50.0 // Flat rate for example
  const taxRate = 0.1 // 10%
  const tax = subtotal * taxRate
  const total = subtotal + shipping + tax
  return {
    subtotal: subtotal.toFixed(2),
    shipping: shipping.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2)
  }
}

const order1Items = [
  {
    product: artworks[0],
    quantity: 1
  }
]
const order1Totals = calculateOrderTotals(
  order1Items.map((i) => ({ price: i.product.price, quantity: i.quantity }))
)

const order2Items = [
  {
    product: artworks[2],
    quantity: 1
  },
  {
    product: artworks[4],
    quantity: 1
  }
]
const order2Totals = calculateOrderTotals(
  order2Items.map((i) => ({ price: i.product.price, quantity: i.quantity }))
)

export const orders: NewOrder[] = [
  {
    id: 'ORD-2023-001',
    userId: CLIENT_USER_ID,
    customerFirstName: 'Client',
    customerLastName: 'User',
    customerEmail: 'client@example.com',
    customerPhone: '123-456-7890',
    shippingAddress: '123 Main St',
    shippingCity: 'New York',
    shippingState: 'NY',
    shippingZip: '10001',
    shippingCountry: 'USA',
    subtotal: order1Totals.subtotal,
    shipping: order1Totals.shipping,
    tax: order1Totals.tax,
    total: order1Totals.total,
    status: 'delivered',
    paymentMethod: 'credit_card',
    paymentId: 'pi_mock_1234567890',
    createdAt: new Date('2023-01-15T10:00:00Z'),
    updatedAt: new Date('2023-01-17T14:30:00Z')
  },
  {
    id: 'ORD-2023-005',
    userId: CLIENT_USER_ID,
    customerFirstName: 'Client',
    customerLastName: 'User',
    customerEmail: 'client@example.com',
    customerPhone: '123-456-7890',
    shippingAddress: '123 Main St',
    shippingCity: 'New York',
    shippingState: 'NY',
    shippingZip: '10001',
    shippingCountry: 'USA',
    subtotal: order2Totals.subtotal,
    shipping: order2Totals.shipping,
    tax: order2Totals.tax,
    total: order2Totals.total,
    status: 'processing',
    paymentMethod: 'paypal',
    paymentId: 'PAYID-mock-0987654321',
    createdAt: new Date(), // Recent order
    updatedAt: new Date()
  }
]

export const orderItems: NewOrderItem[] = [
  // Items for Order 1
  {
    orderId: 'ORD-2023-001',
    productId: artworks[0].id,
    quantity: 1,
    unitPrice: artworks[0].price.toFixed(2),
    totalPrice: artworks[0].price.toFixed(2),
    productTitle: artworks[0].title,
    productSku: 1001, // Mock SKU
    createdAt: new Date('2023-01-15T10:00:00Z')
  },
  // Items for Order 2
  {
    orderId: 'ORD-2023-005',
    productId: artworks[2].id,
    quantity: 1,
    unitPrice: artworks[2].price.toFixed(2),
    totalPrice: artworks[2].price.toFixed(2),
    productTitle: artworks[2].title,
    productSku: 1003,
    createdAt: new Date()
  },
  {
    orderId: 'ORD-2023-005',
    productId: artworks[4].id,
    quantity: 1,
    unitPrice: artworks[4].price.toFixed(2),
    totalPrice: artworks[4].price.toFixed(2),
    productTitle: artworks[4].title,
    productSku: 1005,
    createdAt: new Date()
  }
]
