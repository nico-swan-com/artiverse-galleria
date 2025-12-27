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
import DeleteUserForm from './DeleteUserForm'
import { User } from '@/types/users/user.schema'

type DeleteUserProps = {
  user: User | null
}

const DeleteUserSheet = ({ user }: DeleteUserProps) => {
  const [isOpen, setOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          aria-label='Delete user'
          className='hover:bg-destructive/10 hover:text-destructive'
        >
          <Trash className='size-4 text-destructive' />
        </Button>
      </SheetTrigger>
      <SheetContent className='overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Remove user</SheetTitle>
          <SheetDescription asChild>
            <div className='rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive'>
              <p>
                Warning: This action cannot be undone. The user and all
                associated data will be permanently deleted.
              </p>
              <p className='mt-3'>
                <strong>Are you sure you want to remove this user?</strong>
              </p>
            </div>
          </SheetDescription>
        </SheetHeader>
        <Suspense>
          {user && (
            <DeleteUserForm user={user} onClose={() => setOpen(false)} />
          )}
        </Suspense>
      </SheetContent>
    </Sheet>
  )
}

export default DeleteUserSheet
