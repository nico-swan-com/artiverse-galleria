'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { ArtistSelect } from '@/components/common/artists/ArtistSelect'
import { Input } from '@/components/ui/input'

interface ProductArtistSelectProps {
  artistId?: string
  onChange: (artistId: string) => void
  error?: string
  required?: boolean
}

const ProductArtistSelect: React.FC<ProductArtistSelectProps> = ({
  artistId = '',
  onChange,
  error,
  required = false
}) => {
  return (
    <div className='space-y-2'>
      <Label htmlFor='artist-select' className='text-base font-semibold'>
        Artist {required && '*'}
      </Label>
      <div className='relative'>
        <ArtistSelect artistId={artistId} onChange={onChange} />
        <Input
          id='artist-select'
          type='hidden'
          name='artistId'
          value={artistId}
          aria-describedby={error ? 'artist-error' : undefined}
        />
      </div>
      {error && (
        <p id='artist-error' className='text-xs text-red-500'>
          {error}
        </p>
      )}
      <p className='text-xs text-muted-foreground'>
        Select the artist who created this product
      </p>
    </div>
  )
}

export default ProductArtistSelect
