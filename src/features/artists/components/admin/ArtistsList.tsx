'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { FindOptionsOrderValue } from '@/types/common/db.type'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowDown, ArrowUp, Pencil } from 'lucide-react'
import TablePagination from '@/components/common/ui/TablePagination'
import DeleteArtistDialog from './delete-artist/DeleteArtistDialog'
import { Artist, ArtistsSortBy } from '@/features/artists'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ArtistsListProps {
  artists: Artist[]
  total: number
  page: number
  limit: number
  sortBy: ArtistsSortBy
  order: FindOptionsOrderValue
}

const ArtistsList = ({
  artists,
  total,
  page,
  limit,
  sortBy,
  order
}: ArtistsListProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paramsURL = new URLSearchParams(Array.from(searchParams.entries()))

  const pages = Math.ceil(total / limit)

  const createSortURL = (newSortBy: keyof Artist) => {
    const current = new URLSearchParams(paramsURL)

    current.set('page', '1')
    current.set('sortBy', newSortBy)
    current.set(
      'order',
      sortBy === newSortBy && order === 'ASC' ? 'DESC' : 'ASC'
    )

    return `?${current.toString()}`
  }

  if (artists.length === 0) {
    return (
      <div className='py-10 text-center'>
        <p className='text-muted-foreground'>No artists found</p>
      </div>
    )
  }

  return (
    <>
      <div className='overflow-hidden rounded-md border'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => router.push(createSortURL('name'))}
                  className='cursor-pointer'
                >
                  Artist
                  {sortBy === 'name' &&
                    (order === 'ASC' ? (
                      <ArrowUp className='ml-2 inline-block size-4' />
                    ) : (
                      <ArrowDown className='ml-2 inline-block size-4' />
                    ))}
                </TableHead>
                <TableHead
                  onClick={() => router.push(createSortURL('featured'))}
                  className='cursor-pointer'
                >
                  Featured
                  {sortBy === 'featured' &&
                    (order === 'ASC' ? (
                      <ArrowUp className='ml-2 inline-block size-4' />
                    ) : (
                      <ArrowDown className='ml-2 inline-block size-4' />
                    ))}
                </TableHead>
                <TableHead
                  onClick={() => router.push(createSortURL('createdAt'))}
                  className='cursor-pointer'
                >
                  Created
                  {sortBy === 'createdAt' &&
                    (order === 'ASC' ? (
                      <ArrowUp className='ml-2 inline-block size-4' />
                    ) : (
                      <ArrowDown className='ml-2 inline-block size-4' />
                    ))}
                </TableHead>
                <TableHead>
                  <span className='sr-only'>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artists.map((artist) => (
                <TableRow key={artist.id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='size-20 rounded shadow-md shadow-gray-400'>
                        <AvatarImage
                          className='object-cover'
                          src={
                            typeof artist.image === 'string'
                              ? artist.image
                              : undefined
                          }
                          alt={artist.name}
                        />
                        <AvatarFallback>
                          {artist.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-medium'>{artist.name}</p>
                        <p className='text-xs text-muted-foreground'>
                          {artist.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {artist.featured ? (
                      <span className='inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800'>
                        Featured
                      </span>
                    ) : (
                      <span className='inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800'>
                        Not Featured
                      </span>
                    )}
                  </TableCell>
                  <TableCell className='px-4 py-3 text-muted-foreground'>
                    {artist.createdAt
                      ? format(new Date(artist.createdAt), 'MMM d, yyyy')
                      : ''}
                  </TableCell>
                  <TableCell className='text-end'>
                    <Button variant='ghost' size='sm' asChild>
                      <Link href={`/admin/artists/${artist.id}/edit`}>
                        <Pencil className='size-4' />
                        <span className='sr-only'>Edit {artist.name}</span>
                      </Link>
                    </Button>
                    <DeleteArtistDialog artist={artist} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination
        page={page}
        pages={pages}
        limitPages={2}
        searchParamsUrl={paramsURL}
      />
    </>
  )
}

export default ArtistsList
