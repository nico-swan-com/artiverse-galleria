'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import React from 'react'
import { Home } from 'lucide-react'

const routeNameMap: Record<string, string> = {
  admin: 'Dashboard',
  users: 'Users',
  artists: 'Artists',
  products: 'Products',
  media: 'Media',
  profile: 'Profile',
  create: 'Create',
  edit: 'Edit'
}

export const Breadcrumbs = () => {
  const pathname = usePathname()

  // Don't show on dashboard root
  if (pathname === '/admin') return null

  const paths = pathname.split('/').filter(Boolean)

  return (
    <Breadcrumb className='mb-6 hidden md:flex'>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/admin' className='flex items-center gap-1'>
              <Home className='h-3 w-3' />
              Dashboard
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {paths.map((path, index) => {
          // Skip 'admin' in the loop since we hardcoded Dashboard
          if (path === 'admin') return null

          // Reconstruct path up to this point
          const href = `/${paths.slice(0, index + 1).join('/')}`
          const isLast = index === paths.length - 1

          // Format name: use map or capitalize
          const name =
            routeNameMap[path] ||
            (path.length > 20
              ? '...'
              : path.charAt(0).toUpperCase() + path.slice(1))

          return (
            <React.Fragment key={path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
