import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '@/lib/utils'
import { ButtonProps, buttonVariants } from '@/components/ui/button'

type PaginationVariant = 'dots' | 'numbers'

type PaginationProps = React.ComponentProps<'nav'> & {
  variant?: PaginationVariant
  total?: number // For number type
  current?: number // For number type
  siblings?: number // Number of siblings to show around current page
  onPageChange?: (page: number) => void // Callback for page change
}

const Pagination = ({
  className,
  variant = 'dots',
  total = 0,
  current = 1,
  siblings = 1,
  onPageChange,
  ...props
}: PaginationProps) => {
  const [currentPage, setCurrentPage] = React.useState(current)

  React.useEffect(() => {
    setCurrentPage(current)
  }, [current])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    onPageChange?.(page)
  }

  const getPageNumbers = () => {
    if (!total) return []
    const pages = Array.from({ length: total }, (_, i) => i + 1)

    if (total <= 5 + 2 * siblings) {
      return pages
    }

    const startPages = pages.slice(0, 1 + siblings)
    const endPages = pages.slice(total - siblings, total)
    const middlePages = pages.slice(
      Math.max(0, currentPage - siblings - 1),
      Math.min(total, currentPage + siblings)
    )

    if (currentPage <= 2 + siblings) {
      return [...startPages, '...', ...endPages]
    }

    if (currentPage >= total - 1 - siblings) {
      return [...startPages, '...', ...endPages]
    }

    return [...startPages, '...', ...middlePages, '...', ...endPages]
  }

  const pageNumbers = variant === 'numbers' ? getPageNumbers() : []

  return (
    <nav
      role='navigation'
      aria-label='pagination'
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    >
      <PaginationContent>
        {variant === 'numbers' && total > 1 && (
          <PaginationPrevious
            href='#'
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) handlePageChange(currentPage - 1)
            }}
          />
        )}
        {variant === 'dots' &&
          Array.from({ length: 7 }, (_, i) => (
            <PaginationItem key={i}>
              <button
                className={cn(
                  'h-2 w-2 rounded-full transition-colors',
                  i === 2
                    ? 'bg-gray-900 dark:bg-gray-50'
                    : 'bg-gray-300 dark:bg-gray-700'
                )}
                aria-label={`Go to page ${i + 1}`}
                onClick={() => console.log(`Go to page ${i + 1}`)} // Replace with your logic
              />
            </PaginationItem>
          ))}
        {variant === 'numbers' &&
          pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href='#'
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(page as number)
                  }}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        {variant === 'numbers' && total > 1 && (
          <PaginationNext
            href='#'
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < total) handlePageChange(currentPage + 1)
            }}
          />
        )}
      </PaginationContent>
    </nav>
  )
}
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label='Go to previous page'
    size='default'
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className='size-4' />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label='Go to next page'
    size='default'
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className='size-4' />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className='size-4' />
    <span className='sr-only'>More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
}
