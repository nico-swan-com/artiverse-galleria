import PageTransition from '@/components/common/utility/PageTransition'
import { FindOptionsOrderValue } from '@/types/common/db.type'
import ArtistsList from './ArtistsList'
import { Artist, ArtistsSortBy } from '@/features/artists'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

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
          <Link href='/admin/artists/new'>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Add Artist
            </Button>
          </Link>
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
