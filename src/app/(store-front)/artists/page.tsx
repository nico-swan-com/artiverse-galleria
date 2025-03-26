'use client' // Marks this module as a client component

import { useState } from 'react'
import { artists } from '@/data/artists'
import ArtistCard from '@/components/artist/artist-card.component'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredArtists, setFilteredArtists] = useState(artists)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim() === '') {
      setFilteredArtists(artists)
    } else {
      const filtered = artists.filter(
        (artist) =>
          artist.name.toLowerCase().includes(term.toLowerCase()) ||
          artist.location.toLowerCase().includes(term.toLowerCase()) ||
          artist.specialization.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredArtists(filtered)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Our Artists</h1>
            <p className='mt-2 text-gray-600'>
              Discover the talented creators behind our exclusive artworks
            </p>
          </div>

          <div className='relative w-full md:w-80'>
            <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Search artists...'
              value={searchTerm}
              onChange={handleSearch}
              className='pl-10'
            />
          </div>
        </div>

        {filteredArtists.length > 0 ? (
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {filteredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <p className='mb-4 text-xl text-gray-600'>
              No artists match your search
            </p>
            <Button variant='outline' onClick={() => setSearchTerm('')}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Artists
