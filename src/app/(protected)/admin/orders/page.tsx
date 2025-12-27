import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { getAdminOrdersAction } from '@/features/billing/actions/billing.actions'
import OrdersList from '@/components/admin/orders/OrdersList'
import { Order } from '@/features/billing/types/billing.types'

export const metadata: Metadata = {
  title: 'Orders | Admin Dashboard',
  description: 'Manage customer orders'
}

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string
    status?: string
  }>
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = 10
  const status = params.status

  const { success, orders, total } = await getAdminOrdersAction(
    page,
    limit,
    status
  )

  if (!success) {
    return (
      <div className='p-6 text-destructive'>
        Error loading orders. Please try again.
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Orders</h1>
        <p className='mt-1 text-muted-foreground'>
          Manage and track customer orders.
        </p>
      </div>

      <Suspense fallback={<div>Loading orders...</div>}>
        <OrdersList
          orders={(orders as Order[]) || []}
          total={total || 0}
          page={page}
          limit={limit}
          status={status}
        />
      </Suspense>
    </div>
  )
}
