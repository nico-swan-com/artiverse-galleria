import { Suspense } from 'react'
import { Metadata } from 'next'
import { getOrder } from '@/features/billing/actions/billing.actions'
import OrderDetails from '@/features/orders/components/admin/OrderDetails'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Order Details | Admin Dashboard',
  description: 'View order details'
}

interface OrderPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params
  const { success, order } = await getOrder(id)

  if (!success || !order) {
    notFound()
  }

  return (
    <Suspense fallback={<div>Loading order details...</div>}>
      <OrderDetails order={order} />
    </Suspense>
  )
}
