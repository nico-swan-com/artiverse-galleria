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
import DeleteUserForm from './delete-user-form.component'
import { User } from '@/types'

type EditUserProps = {
  user: User | null
}

const DeleteUserDialog = ({ user }: EditUserProps) => {
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
          <DialogTitle>Remove user</DialogTitle>
          <DialogDescription className='text-red-500'>
            Are you sure you want to remove {user?.name || 'this user'}?
          </DialogDescription>
        </DialogHeader>
        <Suspense>
          {user && (
            <DeleteUserForm user={user} onClose={() => setOpen(false)} />
          )}
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteUserDialog
