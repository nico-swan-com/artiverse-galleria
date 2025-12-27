'use client'

import { Product } from '@/types/products/product.schema'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

interface ChildrenProps {
  children: React.ReactNode
}

export type CartItem = {
  artwork: Product
  quantity: number
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (artwork: Product, quantity?: number) => void
  removeFromCart: (artworkId: string) => void
  updateQuantity: (artworkId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getCartTotal: () => number
  isInCart: (artworkId: string) => boolean
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getItemCount: () => 0,
  getCartTotal: () => 0,
  isInCart: () => false
})

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }: ChildrenProps) => {
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
    return []
  })

  const getItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('art-gallery-cart', JSON.stringify(cart))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [cart])

  const addToCart = (artwork: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.artwork.id === artwork.id
      )

      if (existingItem) {
        return prevCart.map((item) =>
          item.artwork.id === artwork.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prevCart, { artwork, quantity }]
      }
    })

    toast('Added to cart', {
      description: `${artwork.title} has been added to your cart.`
    })

    import('@/features/analytics/actions/analytics.actions').then(
      ({ trackCartAdd }) => {
        trackCartAdd(artwork.id, artwork.title).catch(console.error)
      }
    )
  }

  const isInCart = (artworkId: string) => {
    return cart.some((item) => item.artwork.id === artworkId)
  }

  const removeFromCart = (artworkId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.artwork.id !== artworkId)
    )
  }

  const updateQuantity = (artworkId: string, quantity: number) => {
    if (quantity < 1) return

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.artwork.id === artworkId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + item.artwork.price * item.quantity,
      0
    )
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getCartTotal,
    isInCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
