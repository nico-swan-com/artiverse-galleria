'use client'

import { useState, useEffect } from 'react'
import { artists } from '@/lib/database/data/artists'
import { artworks } from '@/lib/database/data/artworks'
import { Button } from '@/components/ui/button'
import ArtworkCard from '@/components/public/artwork/artwork-card.component'
import { ChevronLeft, Mail, ExternalLink, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'

const ArtistDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [artist] = useState(artists.find((a) => a.id === id))
  const [artistArtworks] = useState(artworks.filter((a) => a.artist.id === id))

  useEffect(() => {
    if (!artist) {
      console.error('Artist not found')
    }
  }, [id, artist])

  if (!artist) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-4 text-2xl font-bold'>Artist Not Found</h2>
          <Button asChild>
            <Link href='/artists'>Back to Artists</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6'>
          <Button variant='ghost' asChild size='sm'>
            <Link href='/artists' className='flex items-center text-gray-600'>
              <ChevronLeft className='mr-1 size-4' /> Back to Artists
            </Link>
          </Button>
        </div>

        <div className='mb-12 grid grid-cols-1 gap-12 lg:grid-cols-3'>
          <div className='lg:col-span-1'>
            <div className='mb-6 overflow-hidden rounded-lg bg-gray-100'>
              <Image
                src={artist.profileImage}
                alt={artist.name}
                className='aspect-square h-auto w-full object-cover'
                width={500}
                height={500}
              />
            </div>

            <div className='space-y-4'>
              <div className='flex items-center'>
                <MapPin className='mr-2 size-5 text-gray-500' />
                <span>{artist.location}</span>
              </div>

              <Button asChild variant='outline' className='w-full'>
                <a
                  href={`mailto:${artist.email}`}
                  className='flex items-center justify-center'
                >
                  <Mail className='mr-2 size-4' />
                  Contact Artist
                </a>
              </Button>

              {artist.website && (
                <Button asChild variant='ghost' className='w-full'>
                  <a
                    href={artist.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center justify-center'
                  >
                    <ExternalLink className='mr-2 size-4' />
                    Visit Website
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className='lg:col-span-2'>
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>
              {artist.name}
            </h1>
            <p className='mb-4 text-lg text-primary'>{artist.specialization}</p>

            <div className='mb-6'>
              <h2 className='mb-3 text-xl font-semibold'>Biography</h2>
              <p className='whitespace-pre-line text-gray-700'>
                {artist.biography}
              </p>
            </div>

            {artist.statement && (
              <div className='mb-6'>
                <h2 className='mb-3 text-xl font-semibold'>Artist Statement</h2>
                <p className='whitespace-pre-line text-gray-700'>
                  {artist.statement}
                </p>
              </div>
            )}

            {artist.exhibitions && artist.exhibitions.length > 0 && (
              <div>
                <h2 className='mb-3 text-xl font-semibold'>Exhibitions</h2>
                <ul className='list-inside list-disc space-y-1 text-gray-700'>
                  {artist.exhibitions.map((exhibition, index) => (
                    <li key={index}>{exhibition}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className='mb-6 text-2xl font-bold text-gray-900'>
            Artworks by {artist.name}
          </h2>

          {artistArtworks.length > 0 ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {artistArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <div className='py-12 text-center'>
              <p className='text-lg text-gray-600'>
                No artworks currently available from this artist.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArtistDetail
