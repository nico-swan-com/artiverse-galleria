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
import { UserPlus } from 'lucide-react'
import { useState, Suspense } from 'react'
import CreateArtistForm from './CreateArtistForm'

const CreateArtistSheet = () => {
  const [isOpen, setOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <UserPlus className='mr-2 size-4' />
          Add artist
        </Button>
      </SheetTrigger>
      <SheetContent className='overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Add new artist</SheetTitle>
          <SheetDescription>Add a new artist to the platform</SheetDescription>
        </SheetHeader>
        <Suspense>
          <CreateArtistForm onClose={() => setOpen(false)} />
        </Suspense>
      </SheetContent>
    </Sheet>
  )
}

export default CreateArtistSheet
