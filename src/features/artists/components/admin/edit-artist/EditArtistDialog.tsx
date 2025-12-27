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
import { Pencil } from 'lucide-react'
import { useState, Suspense } from 'react'
import EditArtistForm from './EditArtistForm'
import { Artist } from '@/features/artists'
import { Skeleton } from '@/components/ui/skeleton'

type EditArtistProps = {
  artist: Artist | null
}

const EditArtistSheet = ({ artist }: EditArtistProps) => {
  const [isOpen, setOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Pencil className='size-4' />
        </Button>
      </SheetTrigger>
      <SheetContent className='overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Update artist</SheetTitle>
          <SheetDescription>Update artist details</SheetDescription>
        </SheetHeader>
        <Suspense
          fallback={<Skeleton className='h-[20px] w-full rounded-full' />}
        >
          {artist && (
            <EditArtistForm artist={artist} onClose={() => setOpen(false)} />
          )}
        </Suspense>
      </SheetContent>
    </Sheet>
  )
}

export default EditArtistSheet
