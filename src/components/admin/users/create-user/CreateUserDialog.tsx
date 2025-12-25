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
import CreateUserForm from './CreateUserForm'

const CreateUserSheet = () => {
  const [isOpen, setOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <UserPlus className='mr-2 size-4' />
          Add user
        </Button>
      </SheetTrigger>
      <SheetContent className='overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Add new user</SheetTitle>
          <SheetDescription>
            Create a new user account with email and password
          </SheetDescription>
        </SheetHeader>
        <Suspense>
          <CreateUserForm onClose={() => setOpen(false)} />
        </Suspense>
      </SheetContent>
    </Sheet>
  )
}

export default CreateUserSheet
