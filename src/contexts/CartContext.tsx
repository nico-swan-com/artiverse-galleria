import React, { createContext, useContext, useState, useEffect } from 'react'
import { Artwork } from '@/types/artwork'
import { toast } from '@/hooks/use-toast'

// Define cart item type
export type CartItem = {
  artwork: Artwork
  quantity: number
}

// Define context type
type CartContextType = {
  cart: CartItem[]
  addToCart: (artwork: Artwork, quantity?: number) => void
  removeFromCart: (artworkId: string) => void
  updateQuantity: (artworkId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getCartTotal: () => number
  addItem: (artwork: Artwork, quantity?: number) => void
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
  addItem: () => {},
  isInCart: () => false,
  itemCount: 0
})

// Custom hook to use cart context
export const useCart = () => useContext(CartContext)

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  // Try to get initial cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('art-gallery-cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  const [itemCount, setItemCount] = useState(0)

  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('art-gallery-cart', JSON.stringify(cart))
    setItemCount(getItemCount())
  }, [cart])

  // Add item to cart
  const addToCart = (artwork: Artwork, quantity = 1) => {
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

    toast({
      title: 'Added to cart',
      description: `${artwork.title} has been added to your cart.`
    })
  }

  // Add alias for addToCart for compatibility
  const addItem = addToCart

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

  // Get total number of items
  const getItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
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
    addItem,
    isInCart,
    itemCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
