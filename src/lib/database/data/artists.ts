import { type Artist } from '../schema'

export const artists: Artist[] = [
  {
    id: 'c9de4b7f-5765-460a-9528-e86a12784777',
    name: 'Sophia Chen',
    image: '/api/media/01c7bbb5-ad6d-4413-9f84-d4281d93be58',
    featured: true,
    styles: ['Abstract', 'Contemporary', 'Mixed Media'],
    biography:
      'Sophia Chen is a contemporary abstract artist based in San Francisco. Her work explores the relationship between urban environments and natural elements, creating harmonious compositions that bridge the gap between the man-made and the organic.',
    specialization: 'Contemporary Abstract Art',
    location: 'San Francisco, CA',
    email: 'sophia@example.com',
    website: 'https://example.com/sophia',
    exhibitions: [
      'San Francisco Modern Art Gallery, 2023',
      'Urban Perspectives, New York, 2022',
      'Nature and Artifice, Los Angeles, 2021'
    ],
    statement:
      'My work investigates the intersection between constructed urban environments and the natural world. I seek to create harmony between seemingly opposing elements through layered compositions that invite viewers to find their own connections and interpretations.',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: 'd073bf5c-4369-40b3-b47f-ff500d079e97',
    name: 'Marcus Rivera',
    image: '/api/media/7e6fa39c-938e-493c-b1e3-80cfdd123491',
    featured: true,
    styles: ['Photography', 'Minimalist', 'Architectural'],
    biography:
      'Marcus Rivera is a minimalist photographer who captures the essence of architectural forms through his lens. His work emphasizes clean lines, geometric patterns, and the interplay of light and shadow in urban spaces.',
    specialization: 'Architectural Photography',
    location: 'Chicago, IL',
    email: 'marcus@example.com',
    website: 'https://example.com/marcus',
    exhibitions: [
      'Chicago Architecture Biennial, 2023',
      'Light & Form, Milan, 2022',
      'Urban Geometries, Berlin, 2021'
    ],
    statement:
      'I aim to reveal the hidden beauty in architectural structures through my lens. By focusing on minimalist compositions, I strip away distractions and highlight the essential elements of design - line, shape, light, and shadow.',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: 'c5a30a5f-cd8e-4715-8a3f-762a32e6e6ff',
    name: 'Amara Johnson',
    image: '/api/media/fdc003d8-b3bb-4d8c-ae0d-bbb01bf490ac',
    featured: false,
    styles: ['Sculpture', 'Mixed Media', 'Modern'],
    biography:
      "Amara Johnson's sculptures blend traditional craftsmanship with contemporary concepts. Working primarily with wood and metal, she creates pieces that challenge perceptions of form and space while honoring the intrinsic qualities of her materials.",
    specialization: 'Contemporary Sculpture',
    location: 'Portland, OR',
    email: 'amara@example.com',
    website: 'https://example.com/amara',
    exhibitions: [
      'Form & Function, Portland Museum of Art, 2023',
      'Material Matters, Seattle Art Gallery, 2022'
    ],
    statement:
      'Through my work, I explore the dialogue between traditional craftsmanship and contemporary aesthetics, seeking to bridge the gap between functional design and artistic expression.',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: 'bce3d76c-f26b-4dd2-8c46-84f19ee8fcb2',
    name: 'Hiroshi Tanaka',
    image: '/api/media/394e1656-e089-4fd5-b488-af1933fb9650',
    featured: true,
    styles: ['Digital', 'Traditional', 'Landscape'],
    biography:
      'Hiroshi Tanaka merges traditional Japanese painting techniques with digital media to create ethereal landscapes that exist between reality and imagination. His work invites viewers to contemplate the boundaries between natural and digital worlds.',
    specialization: 'Digital Japanese Art',
    location: 'Tokyo, Japan',
    email: 'hiroshi@example.com',
    website: 'https://example.com/hiroshi',
    exhibitions: [
      'Digital Horizons, Tokyo Contemporary Art Museum, 2023',
      'Nature & Technology, Kyoto Gallery, 2022'
    ],
    statement:
      'My work explores the intersection of traditional Japanese artistry and modern digital techniques, creating a bridge between our cultural heritage and technological future.',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: '66321c80-625b-47bb-a194-2aee8b80978d',
    name: 'Elena Petrov',
    image: '/api/media/b32a9d7f-e43e-460a-a3fb-e40c7b6af3b6',
    featured: false,
    styles: ['Portraiture', 'Oil Painting', 'Figurative'],
    biography:
      "Elena Petrov's oil paintings capture the emotional essence of human experiences through masterful use of color and light. Her portraits and figurative works reveal the complexities of human psychology with both sensitivity and boldness.",
    specialization: 'Portrait Oil Painting',
    location: 'Paris, France',
    email: 'elena@example.com',
    website: 'https://example.com/elena',
    exhibitions: [
      'Human Nature, Louvre Contemporary Wing, 2023',
      'Colors of Emotion, Berlin Gallery, 2022'
    ],
    statement:
      'Through portraiture, I seek to reveal the hidden depths of human emotion and experience, using color and light to illuminate the complex psychology of my subjects.',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: '615641d0-1aea-4eb8-8730-2c82b7b1f29d',
    name: 'James Wilson',
    image: '/api/media/fc8939d4-15ff-4ca4-a77c-99e9d5ce758f',
    featured: false,
    styles: ['Installation', 'Eco-Art', 'Conceptual'],
    biography:
      'James Wilson transforms reclaimed materials into thought-provoking installations that comment on environmental issues and consumer culture. His work challenges viewers to reconsider their relationship with everyday objects and waste.',
    specialization: 'Environmental Installation Art',
    location: 'London, UK',
    email: 'james@example.com',
    website: 'https://example.com/james',
    exhibitions: [
      'Waste Not, Tate Modern, 2023',
      'Consumer Culture, Manchester Art Gallery, 2022'
    ],
    statement:
      'My installations aim to provoke dialogue about our relationship with consumption and waste, transforming discarded materials into powerful statements about environmental responsibility.',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  }
]

export const getArtistById = (id: string): Artist | undefined => {
  return artists.find((artist) => artist.id === id)
}
