'use client'

import { useEffect } from 'react'
import { Order } from '@/features/billing/types/billing.types'
import { format } from 'date-fns'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

interface InvoiceProps {
  order: Order
}

const Invoice = ({ order }: InvoiceProps) => {
  useEffect(() => {
    // Add print styles dynamically or rely on global CSS @media print
  }, [])

  const handlePrint = () => {
    setTimeout(() => {
      window.print()
    }, 100)
  }

  return (
    <div className='mx-auto max-w-[800px] bg-white p-8 md:p-12 print:max-w-none print:p-0'>
      {/* Print Button - Hidden in Print Mode */}
      <div className='mb-8 flex justify-end print:hidden'>
        <Button onClick={handlePrint} variant='outline'>
          <Printer className='mr-2 size-4' />
          Print Invoice
        </Button>
      </div>

      {/* Header */}
      <div className='mb-8 flex items-start justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
            INVOICE
          </h1>
          <p className='mt-1 text-sm text-gray-500'>#{order.id}</p>
        </div>
        <div className='text-right'>
          <h2 className='text-lg font-semibold'>Artiverse Galleria</h2>
          <address className='mt-2 text-sm not-italic text-gray-500'>
            123 Art Avenue
            <br />
            Creative District
            <br />
            Cape Town, 8001
            <br />
            South Africa
          </address>
        </div>
      </div>

      <Separator className='my-8' />

      {/* Details Grid */}
      <div className='mb-8 grid grid-cols-2 gap-8'>
        <div>
          <h3 className='mb-2 text-sm font-medium text-gray-900'>Bill To</h3>
          <address className='text-sm not-italic text-gray-500'>
            <p className='font-medium text-gray-900'>
              {order.customer.firstName} {order.customer.lastName}
            </p>
            {order.customer.address}
            <br />
            {order.customer.city}, {order.customer.state} {order.customer.zip}
            <br />
            {order.customer.country}
            <br />
            {order.customer.email}
          </address>
        </div>
        <div className='text-right'>
          <div className='mb-2'>
            <span className='text-sm font-medium text-gray-900'>
              Invoice Date:
            </span>
            <span className='ml-2 text-sm text-gray-500'>
              {format(new Date(order.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
          <div className='mb-2'>
            <span className='text-sm font-medium text-gray-900'>Status:</span>
            <span className='ml-2 text-sm capitalize text-gray-500'>
              {order.status === 'paid' ? 'Paid' : 'Unpaid'}
            </span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className='mb-8'>
        <table className='w-full text-left text-sm'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='py-3 font-medium text-gray-900'>Item</th>
              <th className='py-3 text-right font-medium text-gray-900'>
                Quantity
              </th>
              <th className='py-3 text-right font-medium text-gray-900'>
                Price
              </th>
              <th className='py-3 text-right font-medium text-gray-900'>
                Total
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td className='py-4'>
                  <p className='font-medium text-gray-900'>
                    {item.product.title}
                  </p>
                  <p className='text-xs text-gray-500'>
                    SKU: {item.product.sku}
                  </p>
                </td>
                <td className='py-4 text-right'>{item.quantity}</td>
                <td className='py-4 text-right'>
                  R{item.unitPrice.toLocaleString()}
                </td>
                <td className='py-4 text-right font-medium'>
                  R{item.totalPrice.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className='mb-12 flex justify-end'>
        <div className='w-64 space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-500'>Subtotal</span>
            <span className='font-medium text-gray-900'>
              R{order.subtotal.toLocaleString()}
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-500'>Shipping</span>
            <span className='font-medium text-gray-900'>
              R{order.shipping.toLocaleString()}
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-500'>Tax</span>
            <span className='font-medium text-gray-900'>
              R{order.tax.toLocaleString()}
            </span>
          </div>
          <Separator className='my-2' />
          <div className='flex justify-between text-base font-bold'>
            <span className='text-gray-900'>Total</span>
            <span className='text-gray-900'>
              R{order.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='border-t border-gray-200 pt-8 text-center text-xs text-gray-500'>
        <p>Thank you for your business!</p>
        <p className='mt-2'>
          For questions concerning this invoice, please contact
          info@artiverse.com
        </p>
      </div>
    </div>
  )
}

export default Invoice
