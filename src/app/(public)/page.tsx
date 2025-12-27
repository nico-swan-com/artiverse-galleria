import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, Paintbrush, ShoppingCart, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import ArtistCard from '@/components/public/artists/ArtistCard'
import ArtworkCard from '@/components/public/artwork/ArtworkCard'
import Hero from '@/components/public/sections/hero/Hero'
import ProductsService from '@/lib/products/products.service'
import ArtistsService from '@/lib/artists/artists.service'

export const metadata: Metadata = {
  title: 'Artiverse Galleria | Discover Unique Art from World Artists',
  description:
    'Explore our curated collection of original artworks from talented artists around the world. Find unique paintings, sculptures, and more. Each piece comes with its own story and identity.',
  keywords: [
    'art gallery',
    'original artworks',
    'buy art online',
    'paintings',
    'sculptures',
    'artists',
    'art collection'
  ],
  openGraph: {
    title: 'Artiverse Galleria | Discover Unique Art from World Artists',
    description:
      'Explore our curated collection of original artworks from talented artists around the world.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Artiverse Galleria',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Artiverse Galleria - Original Art Collection'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artiverse Galleria | Discover Unique Art',
    description:
      'Explore our curated collection of original artworks from talented artists around the world.',
    images: ['/og-image.jpg']
  },
  alternates: {
    canonical: '/'
  }
}

function JsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': '#website',
        name: 'Artiverse Galleria',
        description:
          'Curated collection of original artworks from talented artists around the world.',
        url: '/'
      },
      {
        '@type': 'Organization',
        '@id': '#organization',
        name: 'Artiverse Galleria',
        url: '/',
        logo: '/logo.png',
        sameAs: []
      },
      {
        '@type': 'WebPage',
        '@id': '#webpage',
        url: '/',
        name: 'Artiverse Galleria | Discover Unique Art from World Artists',
        description:
          'Explore our curated collection of original artworks from talented artists around the world.',
        isPartOf: { '@id': '#website' },
        about: { '@id': '#organization' }
      }
    ]
  }

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

const Home = async () => {
  const productsService = new ProductsService()
  const artistsService = new ArtistsService()

  const featuredArtworks = await productsService.getFeaturedProducts()
  const { artists } = await artistsService.getAll('createdAt', 'DESC')
  const featuredArtists = artists.slice(0, 3)

  return (
    <>
      <JsonLd />
      <main className='-mt-20'>
        <div className='relative flex min-h-screen flex-col overflow-hidden'>
          <Hero />

          {/* Featured Artworks */}
          <section
            className='bg-white px-4 py-16 sm:px-6 lg:px-8'
            aria-labelledby='featured-artworks-heading'
          >
            <div className='mx-auto max-w-7xl'>
              <div className='mb-10 flex items-center justify-between'>
                <h2
                  id='featured-artworks-heading'
                  className='text-3xl font-bold text-gray-900'
                >
                  Featured Artworks
                </h2>
                <Button asChild variant='ghost'>
                  <Link
                    href='/artworks'
                    className='flex items-center'
                    aria-label='View all artworks in the gallery'
                  >
                    View All{' '}
                    <ArrowRight className='ml-2 h-4 w-4' aria-hidden='true' />
                  </Link>
                </Button>
              </div>
              {featuredArtworks.length > 0 ? (
                <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                  {featuredArtworks.slice(0, 3).map((artwork) => (
                    <ArtworkCard key={artwork.id} artwork={artwork} />
                  ))}
                </div>
              ) : (
                <div className='rounded-lg border-2 border-dashed border-gray-300 p-12 text-center'>
                  <Paintbrush
                    className='mx-auto h-12 w-12 text-gray-400'
                    aria-hidden='true'
                  />
                  <h3 className='mt-4 text-lg font-medium text-gray-900'>
                    No artworks available yet
                  </h3>
                  <p className='mt-2 text-sm text-gray-500'>
                    Check back soon for amazing pieces from talented artists.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Featured Artists */}
          <section
            className='bg-gray-50 px-4 py-16 sm:px-6 lg:px-8'
            aria-labelledby='featured-artists-heading'
          >
            <div className='mx-auto max-w-7xl'>
              <div className='mb-10 flex items-center justify-between'>
                <h2
                  id='featured-artists-heading'
                  className='text-3xl font-bold text-gray-900'
                >
                  Featured Artists
                </h2>
                <Button asChild variant='ghost'>
                  <Link
                    href='/artists'
                    className='flex items-center'
                    aria-label='View all artists'
                  >
                    View All{' '}
                    <ArrowRight className='ml-2 h-4 w-4' aria-hidden='true' />
                  </Link>
                </Button>
              </div>
              {featuredArtists.length > 0 ? (
                <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                  {featuredArtists.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              ) : (
                <div className='rounded-lg border-2 border-dashed border-gray-300 p-12 text-center'>
                  <User
                    className='mx-auto h-12 w-12 text-gray-400'
                    aria-hidden='true'
                  />
                  <h3 className='mt-4 text-lg font-medium text-gray-900'>
                    No artists to feature yet
                  </h3>
                  <p className='mt-2 text-sm text-gray-500'>
                    Artists will appear here once they join our gallery.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Call to Action */}
          <section
            className='bg-white px-4 py-16 sm:px-6 lg:px-8'
            aria-labelledby='cta-heading'
          >
            <div className='mx-auto max-w-7xl'>
              <div className='rounded-lg bg-primary p-8 shadow-lg md:p-12'>
                <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-2'>
                  <div>
                    <h2
                      id='cta-heading'
                      className='mb-4 text-3xl font-bold text-white'
                    >
                      Ready to transform your space?
                    </h2>
                    <p className='mb-6 text-lg text-primary-foreground/80'>
                      Find the perfect artwork that speaks to you and enhances
                      your environment.
                    </p>
                    <Button asChild size='lg' variant='secondary'>
                      <Link
                        href='/artworks'
                        aria-label='Start exploring artworks'
                      >
                        Start Exploring
                      </Link>
                    </Button>
                  </div>
                  <div
                    className='grid grid-cols-3 gap-3'
                    role='list'
                    aria-label='Our value propositions'
                  >
                    <div
                      className='flex flex-col items-center rounded-lg bg-white/10 p-4 text-center'
                      role='listitem'
                    >
                      <Paintbrush
                        className='mb-2 h-10 w-10 text-white'
                        aria-hidden='true'
                      />
                      <p className='font-medium text-white'>Unique Artworks</p>
                    </div>
                    <div
                      className='flex flex-col items-center rounded-lg bg-white/10 p-4 text-center'
                      role='listitem'
                    >
                      <User
                        className='mb-2 h-10 w-10 text-white'
                        aria-hidden='true'
                      />
                      <p className='font-medium text-white'>Talented Artists</p>
                    </div>
                    <div
                      className='flex flex-col items-center rounded-lg bg-white/10 p-4 text-center'
                      role='listitem'
                    >
                      <ShoppingCart
                        className='mb-2 h-10 w-10 text-white'
                        aria-hidden='true'
                      />
                      <p className='font-medium text-white'>Secure Shopping</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default Home
