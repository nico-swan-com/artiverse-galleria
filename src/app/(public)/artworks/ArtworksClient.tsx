'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import ArtworkCard from '@/components/public/artwork/ArtworkCard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Product } from '@/types/products/product.schema'
import TablePagination from '@/components/common/ui/TablePagination'

type ArtworksClientProps = {
  artworks: Product[]
  categories: string[]
  styles: string[]
  total: number
  totalPages: number
  currentPage: number
}

export default function ArtworksClient({
  artworks,
  categories,
  styles,
  total,
  totalPages,
  currentPage
}: ArtworksClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize state from URL params
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('searchQuery') || ''
  )
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  )
  const [selectedStyle, setSelectedStyle] = useState(
    searchParams.get('style') || ''
  )
  // Price range default [0, 10000]
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get('minPrice')) || 0,
    Number(searchParams.get('maxPrice')) || 10000
  ])

  // Debounce search term update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (searchParams.get('searchQuery') || '')) {
        updateFilter('searchQuery', searchTerm)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Debounce price update - checking implementation of slider
  // Slider onValueChange updates state instantly, we need to debounce the URL update
  // or only update URL on commit (onValueCommit) if Slider supports it.
  // shadcn Slider passes value to onValueChange.
  // Let's use useEffect for price range with debounce too.
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentMin = Number(searchParams.get('minPrice')) || 0
      const currentMax = Number(searchParams.get('maxPrice')) || 10000
      if (priceRange[0] !== currentMin || priceRange[1] !== currentMax) {
        updateFilters({
          minPrice: priceRange[0].toString(),
          maxPrice: priceRange[1].toString()
        })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [priceRange])

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === '') {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, value)
        }
      }

      // Always reset to page 1 when filters change
      if (Object.keys(params).some((key) => key !== 'page')) {
        newSearchParams.set('page', '1')
      }

      return newSearchParams.toString()
    },
    [searchParams]
  )

  const updateFilter = (key: string, value: string | null) => {
    router.push(`${pathname}?${createQueryString({ [key]: value })}`)
  }

  const updateFilters = (params: Record<string, string | null>) => {
    router.push(`${pathname}?${createQueryString(params)}`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedStyle('')
    setPriceRange([0, 10000])
    router.push(pathname)
  }

  // Effect to sync state if URL changes externally (e.g. back button)
  useEffect(() => {
    setSearchTerm(searchParams.get('searchQuery') || '')
    setSelectedCategory(searchParams.get('category') || '')
    setSelectedStyle(searchParams.get('style') || '')
    setPriceRange([
      Number(searchParams.get('minPrice')) || 0,
      Number(searchParams.get('maxPrice')) || 10000
    ])
  }, [searchParams])

  return (
    <div className='mx-auto max-w-7xl'>
      <div className='mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Explore Artworks</h1>
          <p className='mt-2 text-gray-600'>
            {total} {total === 1 ? 'artwork' : 'artworks'} available
          </p>
        </div>

        <div className='flex w-full flex-col gap-3 sm:flex-row md:w-auto'>
          <div className='relative w-full sm:w-80'>
            <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Search artworks or artists...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon' className='shrink-0'>
                <SlidersHorizontal className='size-4' />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Artworks</SheetTitle>
                <SheetDescription>
                  Refine your search using the filters below
                </SheetDescription>
              </SheetHeader>
              <div className='mt-6 space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='category'>Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(val) => {
                      setSelectedCategory(val)
                      updateFilter('category', val === 'all' ? '' : val)
                    }}
                  >
                    <SelectTrigger id='category'>
                      <SelectValue placeholder='All Categories' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='style'>Style</Label>
                  <Select
                    value={selectedStyle}
                    onValueChange={(val) => {
                      setSelectedStyle(val)
                      updateFilter('style', val === 'all' ? '' : val)
                    }}
                  >
                    <SelectTrigger id='style'>
                      <SelectValue placeholder='All Styles' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Styles</SelectItem>
                      {styles.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-4'>
                  <div className='flex justify-between'>
                    <Label>Price Range</Label>
                    <span className='text-sm text-gray-500'>
                      ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 10000]}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                </div>

                <Button
                  variant='outline'
                  onClick={clearFilters}
                  className='w-full'
                >
                  Clear Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {artworks.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <p className='mb-4 text-xl text-gray-600'>
            No artworks match your filters
          </p>
          <Button variant='outline' onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}

      {totalPages > 1 && (
        <div className='mt-8 flex justify-center'>
          <TablePagination
            page={currentPage}
            pages={totalPages}
            limitPages={5}
            searchParamsUrl={new URLSearchParams(searchParams.toString())}
          />
        </div>
      )}
    </div>
  )
}
