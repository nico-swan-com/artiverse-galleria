import { Product } from './../../products/model/product.schema'

import { artists, getArtistById } from './artists'

export const artworks: Product[] = [
  {
    id: 'c9de4b7f-5765-460a-9528-e86a12784777',
    title: 'Abstract Harmony',
    featureImage:
      'https://images.unsplash.com/photo-1602738328654-51ab2ae6c4ff?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    artistId: artists[0].id,
    description:
      'A vibrant expression of color and movement, this abstract piece creates a sense of harmony through contrasting elements. Layers of acrylic paint build depth and texture, inviting the viewer to discover new details with each viewing.',
    price: 1200,
    images: [],
    yearCreated: 2023,
    medium: 'Acrylic on Canvas',
    dimensions: '36 × 48 inches',
    weight: '3.5 lbs',
    category: 'Abstract',
    style: 'Contemporary',
    featured: true,
    stock: 1,
    sales: 0,
    productType: 'physical',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'd073bf5c-4369-40b3-b47f-ff500d079e97',
    title: 'Urban Solitude',
    featureImage:
      'https://images.unsplash.com/photo-1494522358652-f30e61a60313?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1748&q=80',
    artistId: artists[1].id,
    description:
      'This urban landscape captures the paradoxical solitude one can experience in a crowded city. The use of muted colors and sharp lines creates a mood of quiet contemplation amid the bustling cityscape.',
    price: 1800,
    images: [
      'https://images.unsplash.com/photo-1494522358652-f30e61a60313?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1748&q=80'
    ],
    yearCreated: 2022,
    medium: 'Oil on Canvas',
    dimensions: '30 × 40 inches',
    weight: '4 lbs',
    category: 'Cityscape',
    style: 'Modern Realism',
    featured: true,
    stock: 1,
    sales: 0,
    productType: 'physical',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'e1a1b2c3-d4e5-6789-0123-456789abcdef',
    title: 'Coastal Serenity',
    featureImage:
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    artistId: artists[2].id,
    description:
      'Inspired by the tranquil beaches of the Pacific Northwest, this landscape evokes the peaceful feeling of standing by the ocean at dawn. The cool color palette and soft brushwork create a meditative atmosphere.',
    price: 950,
    images: [
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    ],
    yearCreated: 2023,
    medium: 'Watercolor on Paper',
    dimensions: '24 × 36 inches',
    weight: '1.5 lbs (framed)',
    category: 'Landscape',
    style: 'Impressionistic',
    featured: true,
    stock: 1,
    sales: 0,
    productType: 'physical',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'f2b2c3d4-e5f6-7890-1234-56789abcdef0',
    title: 'Geometric Fusion',
    featureImage:
      'https://images.unsplash.com/photo-1515155075601-23009d0cb6d4?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    artistId: artists[0].id,
    description:
      'A bold exploration of geometric shapes and color relationships. This piece plays with perception and spatial relationships, creating a dynamic visual experience that changes as you move around it.',
    price: 1400,
    images: [
      'https://images.unsplash.com/photo-1515155075601-23009d0cb6d4?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    yearCreated: 2022,
    medium: 'Acrylic on Canvas',
    dimensions: '40 × 40 inches',
    weight: '3 lbs',
    category: 'Abstract',
    style: 'Geometric',
    featured: false,
    stock: 1,
    sales: 0,
    productType: 'physical',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'a3b3c4d5-e6f7-8901-2345-6789abcdef01',
    title: 'Whispers of Nature',
    featureImage:
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    artistId: artists[3].id,
    description:
      "Delicate botanical elements intertwine with abstract forms in this mixed media piece. Inspired by the artist's daily walks in the forest, it captures the ephemeral beauty of nature and its constant state of transformation.",
    price: 875,
    images: [
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    ],
    yearCreated: 2023,
    medium: 'Mixed Media on Wood Panel',
    dimensions: '24 × 30 inches',
    weight: '2.5 lbs',
    category: 'Botanical',
    style: 'Mixed Media',
    featured: false,
    stock: 1,
    sales: 0,
    productType: 'physical',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'b4c4d5e6-f7a8-9012-3456-789abcdef012',
    title: 'Reflections in Blue',
    featureImage:
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1758&q=80',
    artistId: artists[1].id,
    description:
      'An exploration of light, water, and reflection. This piece draws the viewer into a contemplative space where reality and illusion merge. The deep blue tones create a sense of depth and mystery.',
    price: 2100,
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1758&q=80'
    ],
    yearCreated: 2021,
    medium: 'Oil on Canvas',
    dimensions: '48 × 60 inches',
    weight: '5 lbs',
    category: 'Abstract',
    style: 'Contemporary',
    featured: false,
    stock: 1,
    sales: 0,
    productType: 'physical',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'c5d5e6f7-a8b9-0123-4567-89abcdef0123',
    title: 'Cultural Tapestry',
    featureImage:
      'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1744&q=80',
    artistId: artists[4].id,
    description:
      'A vibrant celebration of cultural diversity and heritage. This mixed media piece incorporates traditional patterns and symbols from various cultures, creating a rich tapestry of human experience and connection.',
    price: 1650,
    images: [
      'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1744&q=80'
    ],
    yearCreated: 2022,
    medium: 'Mixed Media on Canvas',
    dimensions: '36 × 48 inches',
    weight: '3.5 lbs',
    category: 'Cultural',
    style: 'Folk Art',
    featured: false,
    stock: 1,
    sales: 0,
    productType: 'physical',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'd6e6f7a8-b9c0-1234-5678-9abcdef01234',
    title: 'Digital Dreamscape',
    featureImage:
      'https://images.unsplash.com/photo-1660480904370-a5dcd0be395b?q=80&w=2018&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    artistId: artists[5].id,
    description:
      'This digital artwork explores the intersection of technology and imagination. Created using advanced 3D modeling and rendering techniques, it presents a surreal landscape that could not exist in the physical world.',
    price: 800,
    images: [
      'https://images.unsplash.com/photo-1660480904370-a5dcd0be395b?q=80&w=2018&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    yearCreated: 2023,
    medium: 'Digital Art, Limited Edition Print',
    dimensions: '24 × 36 inches',
    weight: '1 lb (framed)',
    category: 'Digital',
    style: 'Surrealism',
    featured: false,
    stock: 1,
    sales: 0,
    productType: 'physical',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'e7f7a8b9-c0d1-2345-6789-abcdef012345',
    title: 'Sculptural Elegance',
    featureImage:
      'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80',
    artistId: artists[6]?.id || artists[0].id, // Fallback to first artist if artists[6] is undefined
    description:
      'This minimalist sculpture explores the beauty of form and negative space. Crafted from a single piece of marble, its flowing lines and smooth surfaces invite both visual appreciation and tactile exploration.',
    price: 3200,
    images: [
      'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80'
    ],
    yearCreated: 2021,
    medium: 'Marble Sculpture',
    dimensions: '18 × 12 × 8 inches',
    weight: '20 lbs',
    category: 'Sculpture',
    style: 'Minimalist',
    featured: false,
    stock: 1,
    sales: 0,
    productType: 'physical',
    createdAt: new Date(),
    updatedAt: new Date()
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
  artwork: Product,
  limit: number = 3
): Product[] => {
  return artworks
    .filter(
      (a) =>
        a.id !== artwork.id &&
        (a.category === artwork.category ||
          a.style === artwork.style ||
          a.artistId === artwork.artistId)
    )
    .slice(0, limit)
}

// Re-export getArtistById from artists.ts to maintain backward compatibility
export { getArtistById }
