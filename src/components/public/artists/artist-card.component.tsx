'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Artist } from '@/lib/artists/model'

interface ArtistCardProps {
  artist: Artist
  className?: string
}

const ArtistCard = ({ artist, className }: ArtistCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>()
  return (
    <Link
      href={`/artists/${artist.id}`}
      className={cn('artist-card group block', className)}
    >
      {/* Artist Photo */}
      <div className='lazy-image-container relative mb-4 aspect-square overflow-hidden rounded-full'>
        <Image
          src={artist.photoUrl}
          alt={artist.name}
          className={cn(
            'lazy-image h-full w-full object-cover transition-all duration-400',
            isImageLoaded ? 'scale-100 blur-0' : 'scale-105 blur-xl'
          )}
          onLoad={() => setIsImageLoaded(true)}
          width={800}
          height={800}
        />

        {/* Hover overlay */}
        <div className='absolute inset-0 rounded-full bg-gallery-black/0 transition-all duration-400 ease-swift-out group-hover:bg-gallery-black/20' />
      </div>

      {/* Artist info */}
      <div className='text-center'>
        <h3 className='font-display text-lg font-medium text-gallery-black transition-colors group-hover:text-black'>
          {artist.name}
        </h3>
        <p className='mt-1 text-sm text-gallery-dark-gray/90'>
          {artist.styles.join(' • ')}
        </p>
      </div>
    </Link>
  )
}

export default ArtistCard
