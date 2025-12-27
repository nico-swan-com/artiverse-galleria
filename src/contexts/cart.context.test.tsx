import '@testing-library/jest-dom'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from './cart.context'
import { Product } from '@/types/products/product.schema'
import React from 'react'

// Mock toast
jest.mock('sonner', () => ({
  toast: jest.fn()
}))

// Mock analytics actions - must be resolved immediately for dynamic imports
const mockTrackCartAdd = jest.fn()
jest.mock(
  '@/features/analytics/actions/analytics.actions',
  () => ({
    trackCartAdd: mockTrackCartAdd
  }),
  { virtual: false }
)

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Cart Context', () => {
  const mockProduct: Product = {
    id: 'product-1',
    title: 'Test Artwork',
    price: 100,
    description: 'Test description',
    stock: 10,
    sales: 0,
    productType: 'physical',
    category: 'painting',
    featured: false
  }

  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
    mockTrackCartAdd.mockResolvedValue(undefined)
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  )

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.cart).toEqual([])
    expect(result.current.getItemCount()).toBe(0)
    expect(result.current.getCartTotal()).toBe(0)
  })

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct, 1)
    })

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0]?.artwork).toEqual(mockProduct)
    expect(result.current.cart[0]?.quantity).toBe(1)
    expect(result.current.getItemCount()).toBe(1)
  })

  it('should update quantity when adding same item', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct, 1)
    })

    act(() => {
      result.current.addToCart(mockProduct, 2)
    })

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0]?.quantity).toBe(3)
    expect(result.current.getItemCount()).toBe(3)
  })

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct, 1)
    })

    expect(result.current.cart).toHaveLength(1)

    act(() => {
      result.current.removeFromCart(mockProduct.id)
    })

    expect(result.current.cart).toHaveLength(0)
    expect(result.current.getItemCount()).toBe(0)
  })

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct, 1)
    })

    act(() => {
      result.current.updateQuantity(mockProduct.id, 5)
    })

    expect(result.current.cart[0]?.quantity).toBe(5)
    expect(result.current.getItemCount()).toBe(5)
  })

  it('should not update quantity below 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct, 2)
    })

    act(() => {
      result.current.updateQuantity(mockProduct.id, 0)
    })

    // Quantity should remain 2
    expect(result.current.cart[0]?.quantity).toBe(2)
  })

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct, 1)
    })

    act(() => {
      result.current.clearCart()
    })

    expect(result.current.cart).toHaveLength(0)
    expect(result.current.getItemCount()).toBe(0)
  })

  it('should calculate cart total correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    const product2: Product = {
      ...mockProduct,
      id: 'product-2',
      price: 200
    }

    act(() => {
      result.current.addToCart(mockProduct, 2) // 100 * 2 = 200
      result.current.addToCart(product2, 1) // 200 * 1 = 200
    })

    expect(result.current.getCartTotal()).toBe(400)
  })

  it('should check if item is in cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.isInCart(mockProduct.id)).toBe(false)

    act(() => {
      result.current.addToCart(mockProduct, 1)
    })

    expect(result.current.isInCart(mockProduct.id)).toBe(true)
  })
})
