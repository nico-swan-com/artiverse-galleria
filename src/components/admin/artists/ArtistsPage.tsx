import PageTransition from '@/components/common/utility/PageTransition'
import { FindOptionsOrderValue } from 'typeorm'
import ArtistsList from './ArtistsList'
import CreateArtistDialog from './create-artist/CreateArtistDialog'
import { Artist, ArtistsSortBy } from '@/lib/artists'

interface ArtistsPageProps {
  artists: Artist[]
  page: number
  limit: number
  total: number
  sortBy: ArtistsSortBy
  order: FindOptionsOrderValue
}

const ArtistsPage = ({
  artists,
  page,
  limit,
  total,
  sortBy,
  order
}: ArtistsPageProps) => {
  return (
    <PageTransition>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold tracking-tight'>Artists</h1>
          <CreateArtistDialog />
        </div>

        <ArtistsList
          artists={artists}
          total={total}
          page={page}
          limit={limit}
          sortBy={sortBy}
          order={order}
        />
      </div>
    </PageTransition>
  )
}

export default ArtistsPage
