'use client'

import ArtistCard from '@/components/public/artists/ArtistCard'
import { Artist } from '@/lib/artists/model'
import { startTransition, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface ArtistsListProps {
  artists: Artist[]
  total: number
  searchQuery?: string
}

const ArtistsList = (params: ArtistsListProps) => {
  const [searchQuery, setSearchQuery] = useState(params.searchQuery)
  const [artists, setArtists] = useState(params.artists)

  useEffect(() => {
    setArtists(params.artists)
  }, [params.artists])

  useEffect(() => {
    if (params.searchQuery !== searchQuery) {
      setSearchQuery(params.searchQuery)
    }
  }, [params.searchQuery, searchQuery])

  useEffect(() => {
    startTransition(() => {
      const filtered = !searchQuery
        ? params.artists
        : params.artists.filter((artist) => {
            return (
              artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              artist.specialization
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              artist.location.toLowerCase().includes(searchQuery.toLowerCase())
            )
          })
      setArtists(filtered)
    })
  }, [params.artists, searchQuery])

  return (
    <div className='mx-auto max-w-7xl'>
      <div className='mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
        <div className='flex grow flex-row items-end'>
          <div className='flex grow flex-col'>
            <h1 className='text-3xl font-bold text-gray-900'>Our Artists</h1>
            <p className='mt-2 text-gray-600'>
              Discover the talented creators behind our exclusive artworks
            </p>
          </div>
          <div className='relative w-full md:w-80'>
            <Search
              className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400'
              aria-hidden='true'
            />
            <label htmlFor='artist-search' className='sr-only'>
              Search artists
            </label>
            <Input
              id='artist-search'
              type='text'
              placeholder='Search artists...'
              aria-label='Search artists by name, specialization, or location'
              onChange={(e) => {
                const query = e.target.value
                startTransition(() => {
                  setSearchQuery(query)
                })
              }}
              className='pl-10'
            />
          </div>
        </div>
      </div>

      {artists.length > 0 ? (
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {artists.map((artist: Artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <p className='mb-4 text-xl text-gray-600'>
            No artists match your search
          </p>
        </div>
      )}
    </div>
  )
}

export default ArtistsList
