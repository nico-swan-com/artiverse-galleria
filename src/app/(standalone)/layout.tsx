import { auth } from '@/features/authentication/lib/next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function StandaloneLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return <>{children}</>
}
