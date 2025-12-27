import React from 'react'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/authentication/next-auth'
import { getOrder } from '@/features/billing/actions/billing.actions'
import Invoice from '@/components/billing/Invoice'

export const metadata: Metadata = {
  title: 'Invoice | Artiverse Galleria',
  description: 'Order Invoice'
}

interface InvoicePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const { id } = await params
  const { success, order } = await getOrder(id)

  if (!success || !order) {
    notFound()
  }

  const isAdmin = session.user?.role === 'Admin'
  const isOwner = session.user?.id === order.customerId

  if (!isAdmin && !isOwner) {
    return (
      <div className='flex h-screen flex-col items-center justify-center gap-4'>
        <h1 className='text-2xl font-bold'>Unauthorized</h1>
        <p>You do not have permission to view this invoice.</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 print:bg-white print:py-0'>
      <Invoice order={order} />
    </div>
  )
}
