'use client'

import { Product } from '@/types/products/product.schema'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

interface ChildrenProps {
  children: React.ReactNode
}

// Define cart item type
export type CartItem = {
  artwork: Product
  quantity: number
}

// Define context type
type CartContextType = {
  cart: CartItem[]
  addToCart: (artwork: Product, quantity?: number) => void
  removeFromCart: (artworkId: string) => void
  updateQuantity: (artworkId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getCartTotal: () => number
  isInCart: (artworkId: string) => boolean
  itemCount: number
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getItemCount: () => 0,
  getCartTotal: () => 0,
  isInCart: () => false,
  itemCount: 0
})

// Custom hook to use cart context
export const useCart = () => useContext(CartContext)

// Provider component
export const CartProvider = ({ children }: ChildrenProps) => {
  // Try to get initial cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('art-gallery-cart')
        return savedCart ? JSON.parse(savedCart) : []
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        return []
      }
    }
    return [] // Return empty array on server-side rendering
  })

  const [itemCount, setItemCount] = useState(0)

  // Get total number of items
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Update localStorage when cart changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('art-gallery-cart', JSON.stringify(cart))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
    setItemCount(getItemCount())
  }, [cart, getItemCount]) // Removed getItemCount from dependency array.

  // Add item to cart
  const addToCart = (artwork: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.artwork.id === artwork.id
      )

      if (existingItem) {
        // Update quantity if item already exists
        return prevCart.map((item) =>
          item.artwork.id === artwork.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new item
        return [...prevCart, { artwork, quantity }]
      }
    })

    toast('Added to cart', {
      description: `${artwork.title} has been added to your cart.`
    })
  }

  // Check if item is in cart
  const isInCart = (artworkId: string) => {
    return cart.some((item) => item.artwork.id === artworkId)
  }

  // Remove item from cart
  const removeFromCart = (artworkId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.artwork.id !== artworkId)
    )
  }

  // Update item quantity
  const updateQuantity = (artworkId: string, quantity: number) => {
    if (quantity < 1) return

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.artwork.id === artworkId ? { ...item, quantity } : item
      )
    )
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
  }

  // Get cart total price
  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + item.artwork.price * item.quantity,
      0
    )
  }

  // Context provider value
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getCartTotal,
    isInCart,
    itemCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
