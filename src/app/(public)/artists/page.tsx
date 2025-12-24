import ArtistsList from '@/components/public/artists/ArtistList'
import { Artist } from '@/lib/artists'
import ArtistsService from '@/lib/artists/artists.service'

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ [key: string]: string | undefined }>

const ArtistsPage = async (props: { searchParams: SearchParams }) => {
  const params = await props.searchParams
  const searchQuery = params?.searchQuery || undefined

  try {
    const { artists, total } = await new ArtistsService().getAll('name', 'DESC')

    return (
      <ArtistsList
        artists={artists as Artist[]}
        total={total}
        searchQuery={searchQuery}
      ></ArtistsList>
    )
  } catch (error) {
    console.error('Error fetching artists:', error)
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-2 text-xl font-semibold text-gray-900'>
            Error Loading Artists
          </h2>
          <p className='text-gray-600'>
            Unable to load artists at this time. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}

export default ArtistsPage
