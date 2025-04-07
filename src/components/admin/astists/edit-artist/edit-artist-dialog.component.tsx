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
import { Pencil } from 'lucide-react'
import { useState, Suspense } from 'react'
import EditArtistForm from './edit-artist-form.component'
import { Artist } from '@/lib/artists'

type EditArtistProps = {
  artist: Artist | null
}

const EditArtistDialog = ({ artist }: EditArtistProps) => {
  const [isOpen, setOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Pencil className='size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Update artist</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Suspense>
          {artist && (
            <EditArtistForm artist={artist} onClose={() => setOpen(false)} />
          )}
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}

export default EditArtistDialog
