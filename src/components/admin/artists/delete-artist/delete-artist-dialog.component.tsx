'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { Trash } from 'lucide-react'
import { useState, Suspense } from 'react'
import DeleteArtistForm from './delete-artist-form.component'
import { Artist } from '@/lib/artists'

type EditArtistProps = {
  artist: Artist | null
}

const DeleteArtistDialog = ({ artist }: EditArtistProps) => {
  const [isOpen, setOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Trash className='size-4 text-red-500' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Remove artist</DialogTitle>
          <DialogDescription className='text-red-500'>
            Are you sure you want to remove {artist?.name || 'this artist'}?
          </DialogDescription>
        </DialogHeader>
        <Suspense>
          {artist && (
            <DeleteArtistForm artist={artist} onClose={() => setOpen(false)} />
          )}
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteArtistDialog
