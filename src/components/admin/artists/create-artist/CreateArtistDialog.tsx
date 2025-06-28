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
import { UserPlus } from 'lucide-react'
import { useState, Suspense } from 'react'
import CreateArtistForm from './CreateArtistForm'

const CreateArtistDialog = () => {
  const [isOpen, setOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className='mr-2 size-4' />
          Add artist
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add new artist</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Suspense>
          <CreateArtistForm onClose={() => setOpen(false)} />
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}

export default CreateArtistDialog
