'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/cart.context'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  Trash2,
  ShoppingCart,
  MinusCircle,
  PlusCircle
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Cart = () => {
  const router = useRouter()
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const [subtotal, setSubtotal] = useState(0)

  useEffect(() => {
    const total = cart.reduce(
      (sum, item) => sum + item.artwork.price * item.quantity,
      0
    )
    setSubtotal(total)
  }, [cart])

  const handleQuantityChange = (artworkId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(artworkId, newQuantity)
  }

  const handleRemove = (artworkId: string) => {
    removeFromCart(artworkId)
    toast('Item removed from cart')
  }

  const handleClearCart = () => {
    clearCart()
    toast('Cart has been cleared')
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast('Your cart is empty')
      return
    }
    router.push('/checkout')
  }

  return (
    <div className='min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6'>
          <Button variant='ghost' asChild size='sm'>
            <Link href='/artworks' className='flex items-center text-gray-600'>
              <ChevronLeft className='mr-1 size-4' /> Continue Shopping
            </Link>
          </Button>
        </div>

        <div className='flex flex-col gap-8 md:flex-row'>
          <div className='w-full md:w-2/3'>
            <div className='overflow-hidden rounded-lg bg-white shadow-sm'>
              <div className='border-b p-6'>
                <div className='flex items-center justify-between'>
                  <h1 className='text-2xl font-bold text-gray-900'>
                    Your Shopping Cart
                  </h1>
                  <span className='text-gray-500'>
                    {cart.length} {cart.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>

              {cart.length > 0 ? (
                <div className='divide-y'>
                  {cart.map((item) => (
                    <div
                      key={item.artwork.id}
                      className='flex flex-col p-6 sm:flex-row'
                    >
                      <div className='mb-4 shrink-0 overflow-hidden rounded-md sm:mb-0 sm:size-24'>
                        <Image
                          src={item.artwork.featureImage! as string}
                          alt={item.artwork.title}
                          className='size-full object-cover'
                          width={200}
                          height={200}
                        />
                      </div>

                      <div className='grow sm:ml-6'>
                        <div className='mb-4 flex flex-col sm:flex-row sm:justify-between'>
                          <div>
                            <h3 className='text-lg font-medium text-gray-900'>
                              <Link
                                href={`/artworks/${item.artwork.id}`}
                                className='hover:text-primary'
                              >
                                {item.artwork.title}
                              </Link>
                            </h3>
                          </div>
                          <div className='mt-2 sm:mt-0'>
                            <p className='font-medium'>
                              ${item.artwork.price.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className='flex items-center justify-between'>
                          <div className='flex items-center'>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.artwork.id,
                                  item.quantity - 1
                                )
                              }
                              className='text-gray-500 hover:text-primary focus:outline-none'
                              aria-label='Decrease quantity'
                            >
                              <MinusCircle className='size-5' />
                            </button>
                            <span className='mx-3 w-6 text-center'>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.artwork.id,
                                  item.quantity + 1
                                )
                              }
                              className='text-gray-500 hover:text-primary focus:outline-none'
                              aria-label='Increase quantity'
                            >
                              <PlusCircle className='size-5' />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item.artwork.id)}
                            className='text-gray-500 hover:text-red-600 focus:outline-none'
                            aria-label='Remove item'
                          >
                            <Trash2 className='size-5' />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='p-12 text-center'>
                  <ShoppingCart className='mx-auto mb-4 size-12 text-gray-400' />
                  <h2 className='mb-2 text-xl font-medium text-gray-900'>
                    Your cart is empty
                  </h2>
                  <p className='mb-6 text-gray-500'>
                    Looks like you haven&apos;t added any artworks to your cart
                    yet.
                  </p>
                  <Button asChild>
                    <Link href='/artworks'>Browse Artworks</Link>
                  </Button>
                </div>
              )}

              {cart.length > 0 && (
                <div className='border-t p-6'>
                  <Button
                    variant='outline'
                    onClick={handleClearCart}
                    className='text-gray-500'
                  >
                    <Trash2 className='mr-2 size-4' />
                    Clear Cart
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className='w-full md:w-1/3'>
            <div className='sticky top-6 rounded-lg bg-white p-6 shadow-sm'>
              <h2 className='mb-6 text-lg font-medium text-gray-900'>
                Order Summary
              </h2>

              <div className='space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='font-medium'>
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Shipping</span>
                  <span className='font-medium'>Free</span>
                </div>
                <div className='flex justify-between border-t pt-4'>
                  <span className='text-lg font-medium'>Total</span>
                  <span className='text-lg font-bold'>
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className='mt-6 w-full'
                size='lg'
              >
                Proceed to Checkout
              </Button>

              <p className='mt-4 text-center text-xs text-gray-500'>
                Taxes and shipping calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
