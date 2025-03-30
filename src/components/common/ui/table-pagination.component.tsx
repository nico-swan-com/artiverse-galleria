'use client'

import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext
} from '@/components/ui/pagination'
import { useRouter } from 'next/navigation'

interface PaginationProps {
  page: number
  pages: number
  limitPages: number
  searchParamsUrl: URLSearchParams
}

const TablePagination = ({
  page,
  pages,
  limitPages,
  searchParamsUrl
}: PaginationProps) => {
  const router = useRouter()

  const createPageURL = (page: number) => {
    const current = searchParamsUrl
    current.set('page', `${page}`)
    return `?${current.toString()}`
  }

  const getPaginationItems = () => {
    const items = []
    if (pages <= limitPages) {
      // Show all pages
      for (let i = 1; i <= pages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => router.push(createPageURL(i))}
              isActive={page === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      const startPage = Math.max(1, page - limitPages)
      const endPage = Math.min(pages, page + limitPages)

      if (startPage > 1) {
        items.push(
          <PaginationItem key='ellipsis-start'>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => router.push(createPageURL(i))}
              isActive={page === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      if (endPage < pages) {
        items.push(
          <PaginationItem key='ellipsis-end'>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
    }
    return items
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={page === 1 ? 'cursor-not-allowed opacity-50' : ''}
            {...(page === 1
              ? {}
              : { onClick: () => router.push(createPageURL(page - 1)) })}
          />
        </PaginationItem>
        {getPaginationItems()}
        <PaginationItem>
          <PaginationNext
            className={page === pages ? 'cursor-not-allowed opacity-50' : ''}
            {...(page === pages
              ? {}
              : { onClick: () => router.push(createPageURL(page + 1)) })}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default TablePagination
