'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/cart.context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { toast } from 'sonner'
import { ChevronLeft, CreditCard, Check } from 'lucide-react'
import Image from 'next/image'

const Checkout = () => {
  const { cart, clearCart } = useCart()
  const router = useRouter()
  const [subtotal, setSubtotal] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    notes: ''
  })

  useEffect(() => {
    // If cart is empty and not after successful checkout, redirect to cart
    if (cart.length === 0 && !success) {
      router.push('/cart')
    }

    const total = cart.reduce(
      (sum, item) => sum + item.artwork.price * item.quantity,
      0
    )
    setSubtotal(total)
  }, [cart, router, success])

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: React.FocusEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    // Simulating API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)
      clearCart()

      // Display success message
      toast('Order placed successfully!', {
        description: 'Thank you for your purchase.'
      })
    }, 2000)
  }

  if (success) {
    return (
      <div className='min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <div className='mb-6 inline-flex size-16 items-center justify-center rounded-full bg-green-100'>
            <Check className='size-8 text-green-600' />
          </div>
          <h1 className='mb-4 text-3xl font-bold text-gray-900'>
            Thank you for your order!
          </h1>
          <p className='mb-8 text-lg text-gray-600'>
            Your order has been confirmed and is now being processed. You will
            receive an email confirmation shortly.
          </p>
          <div className='space-y-4'>
            <Button asChild size='lg'>
              <Link href='/artworks'>Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6'>
          <Button variant='ghost' asChild size='sm'>
            <Link href='/cart' className='flex items-center text-gray-600'>
              <ChevronLeft className='mr-1 size-4' /> Back to Cart
            </Link>
          </Button>
        </div>

        <h1 className='mb-8 text-2xl font-bold text-gray-900'>Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-8 lg:flex-row'>
            <div className='w-full space-y-8 lg:w-2/3'>
              {/* Contact Information */}
              <div className='rounded-lg bg-white p-6 shadow-sm'>
                <h2 className='mb-4 text-lg font-medium text-gray-900'>
                  Contact Information
                </h2>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='firstName'>First Name</Label>
                    <Input
                      id='firstName'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='lastName'>Last Name</Label>
                    <Input
                      id='lastName'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='phone'>Phone (optional)</Label>
                    <Input
                      id='phone'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className='rounded-lg bg-white p-6 shadow-sm'>
                <h2 className='mb-4 text-lg font-medium text-gray-900'>
                  Shipping Address
                </h2>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='address'>Address</Label>
                    <Input
                      id='address'
                      name='address'
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='city'>City</Label>
                      <Input
                        id='city'
                        name='city'
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='state'>State/Province</Label>
                      <Input
                        id='state'
                        name='state'
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='zip'>ZIP/Postal Code</Label>
                      <Input
                        id='zip'
                        name='zip'
                        value={formData.zip}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='country'>Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) =>
                          handleSelectChange('country', value)
                        }
                      >
                        <SelectTrigger id='country'>
                          <SelectValue placeholder='Select Country' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='United States'>
                            United States
                          </SelectItem>
                          <SelectItem value='Canada'>Canada</SelectItem>
                          <SelectItem value='United Kingdom'>
                            United Kingdom
                          </SelectItem>
                          <SelectItem value='Australia'>Australia</SelectItem>
                          <SelectItem value='Germany'>Germany</SelectItem>
                          <SelectItem value='France'>France</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className='rounded-lg bg-white p-6 shadow-sm'>
                <h2 className='mb-4 text-lg font-medium text-gray-900'>
                  Payment Information
                </h2>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='cardNumber'>Card Number</Label>
                    <Input
                      id='cardNumber'
                      name='cardNumber'
                      placeholder='**** **** **** ****'
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='cardName'>Name on Card</Label>
                    <Input
                      id='cardName'
                      name='cardName'
                      value={formData.cardName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='expiry'>Expiry Date</Label>
                      <Input
                        id='expiry'
                        name='expiry'
                        placeholder='MM/YY'
                        value={formData.expiry}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='cvv'>CVV</Label>
                      <Input
                        id='cvv'
                        name='cvv'
                        placeholder='***'
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className='rounded-lg bg-white p-6 shadow-sm'>
                <h2 className='mb-4 text-lg font-medium text-gray-900'>
                  Order Notes (Optional)
                </h2>
                <div className='space-y-2'>
                  <Label htmlFor='notes'>Special Instructions</Label>
                  <Textarea
                    id='notes'
                    name='notes'
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder='Add any special instructions or delivery preferences here'
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className='w-full lg:w-1/3'>
              <div className='sticky top-6 rounded-lg bg-white p-6 shadow-sm'>
                <h2 className='mb-6 text-lg font-medium text-gray-900'>
                  Order Summary
                </h2>

                <div className='mb-6 max-h-60 space-y-4 divide-y overflow-y-auto'>
                  {cart.map((item) => (
                    <div
                      key={item.artwork.id}
                      className='flex items-start pt-4 first:pt-0'
                    >
                      <div className='relative size-16 shrink-0 overflow-hidden rounded-md'>
                        <Image
                          src={item.artwork.featureImage! as string}
                          alt={item.artwork.title}
                          layout='fill'
                          objectFit='cover'
                        />
                      </div>
                      <div className='ml-4 grow'>
                        <h4 className='text-sm font-medium text-gray-900'>
                          {item.artwork.title}
                        </h4>
                        <p className='text-xs text-gray-500'>
                          Qty: {item.quantity}
                        </p>
                        <p className='text-sm font-medium'>
                          ${item.artwork.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

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
                  type='submit'
                  disabled={isSubmitting}
                  className='mt-6 w-full'
                  size='lg'
                >
                  {isSubmitting ? (
                    'Processing...'
                  ) : (
                    <>
                      <CreditCard className='mr-2 size-4' />
                      Complete Order
                    </>
                  )}
                </Button>

                <p className='mt-4 text-center text-xs text-gray-500'>
                  By placing your order, you agree to our Terms of Service and
                  Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
