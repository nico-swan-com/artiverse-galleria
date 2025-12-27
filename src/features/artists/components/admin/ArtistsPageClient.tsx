'use client'

import PageTransition from '@/components/common/utility/PageTransition'
import { FindOptionsOrderValue } from '@/types/common/db.type'
import ArtistsList from './ArtistsList'
import { Artist, ArtistsSortBy } from '@/features/artists'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import Link from 'next/link'

interface ArtistsPageClientProps {
  artists: Artist[]
  page: number
  limit: number
  total: number
  sortBy: ArtistsSortBy
  order: FindOptionsOrderValue
}

const ArtistsPageClient = ({
  artists,
  page,
  limit,
  total,
  sortBy,
  order
}: ArtistsPageClientProps) => {
  return (
    <PageTransition>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold tracking-tight'>Artists</h1>
          <Button asChild>
            <Link href='/admin/artists/new'>
              <UserPlus className='mr-2 size-4' />
              Add artist
            </Link>
          </Button>
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

export default ArtistsPageClient
