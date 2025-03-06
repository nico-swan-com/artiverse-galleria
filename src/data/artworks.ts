import { Artwork } from '@/types/artwork'
import { Artist } from '@/types/artist'
import { artists, getArtistById } from './artists'

export const artworks: Artwork[] = [
  {
    id: 'art-1',
    title: 'Abstract Harmony',
    artist: artists[0],
    description:
      'A vibrant expression of color and movement, this abstract piece creates a sense of harmony through contrasting elements. Layers of acrylic paint build depth and texture, inviting the viewer to discover new details with each viewing.',
    price: 1200,
    images: [
      'https://images.unsplash.com/photo-1602738328654-51ab2ae6c4ff?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      'https://images.unsplash.com/photo-1576769267141-f07a5f2ffd6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      'https://images.unsplash.com/photo-1552355757-88196237badc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    ],
    yearCreated: 2023,
    medium: 'Acrylic on Canvas',
    dimensions: '36 × 48 inches',
    weight: '3.5 lbs',
    category: 'Abstract',
    style: 'Contemporary',
    availability: 'Available',
    featured: true
  },
  {
    id: 'art-2',
    title: 'Urban Solitude',
    artist: artists[1],
    description:
      'This urban landscape captures the paradoxical solitude one can experience in a crowded city. The use of muted colors and sharp lines creates a mood of quiet contemplation amid the bustling cityscape.',
    price: 1800,
    images: [
      'https://images.unsplash.com/photo-1494522358652-f30e61a60313?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1748&q=80',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1744&q=80'
    ],
    yearCreated: 2022,
    medium: 'Oil on Canvas',
    dimensions: '30 × 40 inches',
    weight: '4 lbs',
    category: 'Cityscape',
    style: 'Modern Realism',
    availability: 'Available',
    featured: true
  },
  {
    id: 'art-3',
    title: 'Coastal Serenity',
    artist: artists[2],
    description:
      'Inspired by the tranquil beaches of the Pacific Northwest, this landscape evokes the peaceful feeling of standing by the ocean at dawn. The cool color palette and soft brushwork create a meditative atmosphere.',
    price: 950,
    images: [
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    ],
    yearCreated: 2023,
    medium: 'Watercolor on Paper',
    dimensions: '24 × 36 inches',
    weight: '1.5 lbs (framed)',
    category: 'Landscape',
    style: 'Impressionistic',
    availability: 'Available',
    featured: true
  },
  {
    id: 'art-4',
    title: 'Geometric Fusion',
    artist: artists[0],
    description:
      'A bold exploration of geometric shapes and color relationships. This piece plays with perception and spatial relationships, creating a dynamic visual experience that changes as you move around it.',
    price: 1400,
    images: [
      'https://images.unsplash.com/photo-1584285405429-136507257dal?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      'https://images.unsplash.com/photo-1620503374956-c942862f0372?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    ],
    yearCreated: 2022,
    medium: 'Acrylic on Canvas',
    dimensions: '40 × 40 inches',
    weight: '3 lbs',
    category: 'Abstract',
    style: 'Geometric',
    availability: 'Sold',
    featured: false
  },
  {
    id: 'art-5',
    title: 'Whispers of Nature',
    artist: artists[3],
    description:
      "Delicate botanical elements intertwine with abstract forms in this mixed media piece. Inspired by the artist's daily walks in the forest, it captures the ephemeral beauty of nature and its constant state of transformation.",
    price: 875,
    images: [
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      'https://images.unsplash.com/photo-1508343919546-4a5d6c83ba67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    ],
    yearCreated: 2023,
    medium: 'Mixed Media on Wood Panel',
    dimensions: '24 × 30 inches',
    weight: '2.5 lbs',
    category: 'Botanical',
    style: 'Mixed Media',
    availability: 'Available',
    featured: false
  },
  {
    id: 'art-6',
    title: 'Reflections in Blue',
    artist: artists[1],
    description:
      'An exploration of light, water, and reflection. This piece draws the viewer into a contemplative space where reality and illusion merge. The deep blue tones create a sense of depth and mystery.',
    price: 2100,
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1758&q=80',
      'https://images.unsplash.com/photo-1604871000636-074fa5117945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80'
    ],
    yearCreated: 2021,
    medium: 'Oil on Canvas',
    dimensions: '48 × 60 inches',
    weight: '5 lbs',
    category: 'Abstract',
    style: 'Contemporary',
    availability: 'Available',
    featured: false
  },
  {
    id: 'art-7',
    title: 'Cultural Tapestry',
    artist: artists[4],
    description:
      'A vibrant celebration of cultural diversity and heritage. This mixed media piece incorporates traditional patterns and symbols from various cultures, creating a rich tapestry of human experience and connection.',
    price: 1650,
    images: [
      'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1744&q=80',
      'https://images.unsplash.com/photo-1555580168-9fb9646cb237?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    ],
    yearCreated: 2022,
    medium: 'Mixed Media on Canvas',
    dimensions: '36 × 48 inches',
    weight: '3.5 lbs',
    category: 'Cultural',
    style: 'Folk Art',
    availability: 'Available',
    featured: false
  },
  {
    id: 'art-8',
    title: 'Digital Dreamscape',
    artist: artists[5],
    description:
      'This digital artwork explores the intersection of technology and imagination. Created using advanced 3D modeling and rendering techniques, it presents a surreal landscape that could not exist in the physical world.',
    price: 800,
    images: [
      'https://images.unsplash.com/photo-1558865869-c93d6f8c8152?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
      'https://images.unsplash.com/photo-1611532736597-8bc40fea3fe4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80'
    ],
    yearCreated: 2023,
    medium: 'Digital Art, Limited Edition Print',
    dimensions: '24 × 36 inches',
    weight: '1 lb (framed)',
    category: 'Digital',
    style: 'Surrealism',
    availability: 'Available',
    featured: false
  },
  {
    id: 'art-9',
    title: 'Sculptural Elegance',
    artist: artists[6] || artists[0], // Fallback to first artist if artists[6] is undefined
    description:
      'This minimalist sculpture explores the beauty of form and negative space. Crafted from a single piece of marble, its flowing lines and smooth surfaces invite both visual appreciation and tactile exploration.',
    price: 3200,
    images: [
      'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80',
      'https://images.unsplash.com/photo-1535589327191-8dcf0945e8a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    ],
    yearCreated: 2021,
    medium: 'Marble Sculpture',
    dimensions: '18 × 12 × 8 inches',
    weight: '20 lbs',
    category: 'Sculpture',
    style: 'Minimalist',
    availability: 'Available',
    featured: false
  }
]

// Helper function to format price
export const formatPrice = (price: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price)
}

// Helper function to get related artworks
export const getRelatedArtworks = (
  artwork: Artwork,
  limit: number = 3
): Artwork[] => {
  return artworks
    .filter(
      (a) =>
        a.id !== artwork.id &&
        (a.category === artwork.category ||
          a.style === artwork.style ||
          a.artist.id === artwork.artist.id)
    )
    .slice(0, limit)
}

// Re-export getArtistById from artists.ts to maintain backward compatibility
export { getArtistById }
