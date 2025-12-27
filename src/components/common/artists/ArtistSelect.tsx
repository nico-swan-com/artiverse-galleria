import React, { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Artist } from '@/features/artists/types/artist.schema'

interface ArtistSelectProps {
  artistId?: string
  onChange: (value: string) => void
  loading?: boolean
}

export function ArtistSelect({
  artistId,
  onChange,
  loading
}: ArtistSelectProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [artists, setArtists] = useState<Artist[]>([])
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchArtists() {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/artists/all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          //TODO work on caching
          cache: 'no-cache'
        })
        const data = await res.json()
        setArtists(data.artists)
        if (artistId) {
          const foundArtist = data.artists.find(
            (a: Artist) => a.id === artistId
          )
          setSelectedArtist(foundArtist || null)
        } else {
          setSelectedArtist(null)
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchArtists()
  }, [artistId])

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredArtists(artists)
    } else {
      const lowerSearch = search.toLowerCase()
      const filtered = artists.filter((artist) =>
        artist.name.toLowerCase().includes(lowerSearch)
      )
      setFilteredArtists(filtered || [])
    }
  }, [search, artists])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between'
          type='button'
        >
          {selectedArtist ? selectedArtist.name : 'Select artist...'}
          <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full min-w-[200px] p-0'>
        <Command>
          <CommandInput
            placeholder='Search artist...'
            value={search}
            onValueChange={setSearch}
            className='h-9'
            disabled={loading || isLoading}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading
                ? 'Loading...'
                : filteredArtists.length === 0
                  ? 'No artist found.'
                  : null}
            </CommandEmpty>
            {filteredArtists.length > 0 && (
              <CommandGroup>
                {filteredArtists.map((artist) => (
                  <CommandItem
                    key={artist.id}
                    value={artist.id}
                    onSelect={(currentValue: string) => {
                      onChange(currentValue)
                      const artist = artists.find((a) => a.id === currentValue)
                      if (artist) {
                        setSelectedArtist(artist)
                      }
                      setOpen(false)
                    }}
                  >
                    {artist.name}
                    <Check
                      className={cn(
                        'ml-auto',
                        artistId === artist.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
