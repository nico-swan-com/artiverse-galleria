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
import EditUserForm from './EditUserForm'
import { User } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'

type EditUserProps = {
  user: User | null
}

const EditUserDialog = ({ user }: EditUserProps) => {
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
          <DialogTitle>Update user</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Suspense
          fallback={<Skeleton className='h-[20px] w-full rounded-full' />}
        >
          {user && <EditUserForm user={user} onClose={() => setOpen(false)} />}
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}

export default EditUserDialog
