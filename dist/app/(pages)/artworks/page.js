'use client'
import { useState, useEffect } from 'react'
import { artworks } from '@/data/artworks'
import ArtworkCard from '@/components/artwork/ArtworkCard'
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
const Artworks = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [filteredArtworks, setFilteredArtworks] = useState(artworks)
  const categories = [...new Set(artworks.map((artwork) => artwork.category))]
  const styles = [...new Set(artworks.map((artwork) => artwork.style))]
  useEffect(() => {
    let filtered = artworks
    if (searchTerm) {
      filtered = filtered.filter(
        (artwork) =>
          artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artwork.artist.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (selectedCategory) {
      filtered = filtered.filter(
        (artwork) => artwork.category === selectedCategory
      )
    }
    if (selectedStyle) {
      filtered = filtered.filter((artwork) => artwork.style === selectedStyle)
    }
    filtered = filtered.filter(
      (artwork) =>
        artwork.price >= priceRange[0] && artwork.price <= priceRange[1]
    )
    setFilteredArtworks(filtered)
  }, [searchTerm, selectedCategory, selectedStyle, priceRange])
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedStyle('')
    setPriceRange([0, 10000])
  }
  return (
    <div className='min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Explore Artworks
            </h1>
            <p className='mt-2 text-gray-600'>
              {filteredArtworks.length}{' '}
              {filteredArtworks.length === 1 ? 'artwork' : 'artworks'} available
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
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger id='category'>
                        <SelectValue placeholder='All Categories' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=''>All Categories</SelectItem>
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
                      onValueChange={setSelectedStyle}
                    >
                      <SelectTrigger id='style'>
                        <SelectValue placeholder='All Styles' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=''>All Styles</SelectItem>
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

        {filteredArtworks.length > 0 ? (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredArtworks.map((artwork) => (
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
      </div>
    </div>
  )
}
export default Artworks
