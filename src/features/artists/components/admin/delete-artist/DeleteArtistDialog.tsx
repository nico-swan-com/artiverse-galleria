'use client'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

import { Trash } from 'lucide-react'
import { useState, Suspense } from 'react'
import DeleteArtistForm from './DeleteArtistForm'
import { Artist } from '@/features/artists'

type DeleteArtistProps = {
  artist: Artist | null
}

const DeleteArtistDialog = ({ artist }: DeleteArtistProps) => {
  const [isOpen, setOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Trash className='size-4 text-red-500' />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Remove artist</SheetTitle>
          <SheetDescription>
            <div className='rounded-md bg-red-100 p-4 text-sm text-red-500'>
              <p>
                Warning: This action cannot be undone. The artist and all
                associated data will be permanently deleted.
              </p>
              <p className='mt-3'>
                <strong>Are you sure you want to remove this artist?</strong>
              </p>
            </div>
          </SheetDescription>
        </SheetHeader>
        <Suspense
          fallback={
            <div className='py-4 text-center text-sm text-muted-foreground'>
              Loading...
            </div>
          }
        >
          {artist && (
            <DeleteArtistForm artist={artist} onClose={() => setOpen(false)} />
          )}
        </Suspense>
      </SheetContent>
    </Sheet>
  )
}

export default DeleteArtistDialog
