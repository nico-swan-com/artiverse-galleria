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
import { useState, Suspense, useCallback } from 'react'
import EditUserForm from './EditUserForm'
import { Skeleton } from '@/components/ui/skeleton'
import { User } from '@/types/users/user.schema'

type EditUserProps = {
  user: User | null
}

const EditUserSheet = ({ user }: EditUserProps) => {
  const [isOpen, setOpen] = useState(false)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size='icon' variant='ghost' aria-label='Edit user'>
          <Pencil className='size-4' />
        </Button>
      </SheetTrigger>
      <SheetContent className='overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Update user</SheetTitle>
          <SheetDescription>
            Update user profile, role, and status
          </SheetDescription>
        </SheetHeader>
        <Suspense
          fallback={<Skeleton className='h-[20px] w-full rounded-full' />}
        >
          {user && <EditUserForm user={user} onClose={handleClose} />}
        </Suspense>
      </SheetContent>
    </Sheet>
  )
}

export default EditUserSheet
