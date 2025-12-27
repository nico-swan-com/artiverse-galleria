import { Product } from '@/features/products/types/product.schema'

// Order status enum
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

// Order item (cart item with calculated totals)
export interface OrderItem {
  productId: string
  product: Product
  quantity: number
  unitPrice: number
  totalPrice: number
}

// Customer information for order
export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

// Order type
export interface Order {
  id: string
  customerId?: string // Optional - for guest checkout
  customer: CustomerInfo
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  paymentMethod?: string
  paymentId?: string // External payment provider reference
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Create order input
export interface CreateOrderInput {
  customer: CustomerInfo
  items: OrderItem[]
  notes?: string
  userId?: string // Optional - for authenticated users
}
