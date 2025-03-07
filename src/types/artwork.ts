import { Artist } from './artist'

export type Artwork = {
  id: string
  title: string
  artist: Artist
  description: string
  price: number
  images: string[]
  yearCreated: number
  medium: string
  dimensions: string
  weight: string
  category: string
  style: string
  availability: 'Available' | 'Sold' | 'Reserved'
  featured?: boolean
}
