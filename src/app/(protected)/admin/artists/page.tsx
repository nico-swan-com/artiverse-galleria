import ArtistsPageClient from '@/components/admin/artists/ArtistsPageClient'
import { Artist, ArtistsSortBy, isValidArtistsSortKey } from '@/lib/artists'
import ArtistsService from '@/lib/artists/artists.service'
import { instanceToPlain } from 'class-transformer'
import { FindOptionsOrderValue } from 'typeorm'

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const ArtistServerPage = async (props: { searchParams: SearchParams }) => {
  const params = await props.searchParams

  const sortBy = (
    typeof params.sortBy === 'string' && isValidArtistsSortKey(params.sortBy)
      ? params.sortBy
      : 'createdAt'
  ) as ArtistsSortBy
  const page = Math.max(1, parseInt((params.page as string) || '1', 10) || 1)
  const limit = Math.min(50, Math.max(1, Number(params.limit || 5) || 5))
  const order = (
    params.order === 'ASC' || params.order === 'DESC' ? params.order : 'DESC'
  ) as FindOptionsOrderValue

  try {
    const { artists, total } = await new ArtistsService().getPaged(
      { page, limit },
      sortBy,
      order
    )

    console.log(artists)

    return (
      <ArtistsPageClient
        artists={instanceToPlain(artists) as Artist[]}
        page={page}
        limit={limit}
        total={total}
        sortBy={sortBy}
        order={order}
      />
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

export default ArtistServerPage
