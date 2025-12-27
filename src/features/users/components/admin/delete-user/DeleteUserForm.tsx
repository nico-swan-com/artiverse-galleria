'use client'

import { useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { formInitialState } from '@/types'
import deleteUserAction from '../delete-user.action'
import { User } from '@/types/users/user.schema'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAvatarUrl } from '@/lib/utilities'
import { Badge } from '@/components/ui/badge'

interface DeleteUserFormProps {
  user: User
  onClose: () => void
}

const DeleteUserForm = ({ user, onClose }: DeleteUserFormProps) => {
  const [state, formAction, isPending] = useActionState(
    deleteUserAction,
    formInitialState
  )

  useEffect(() => {
    if (state.success && !!state.message && !isPending) {
      toast.success(state.message)
      state.message = ''
      onClose()
    }
  }, [state, isPending, onClose])

  return (
    <form action={formAction} className='mt-4 space-y-4'>
      <Input id='userId' name='userId' type='hidden' defaultValue={user.id} />

      {/* User summary card */}
      <div className='flex items-center gap-4 rounded-lg border bg-muted/50 p-4'>
        <Avatar className='size-12'>
          <AvatarImage
            src={user.avatar || getAvatarUrl(user.email, user.name)}
            alt={user.name}
          />
          <AvatarFallback>
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='flex-1'>
          <p className='font-medium'>{user.name}</p>
          <p className='text-sm text-muted-foreground'>{user.email}</p>
          <div className='mt-1 flex gap-2'>
            <Badge variant='outline'>{user.role}</Badge>
            <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
              {user.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className='flex justify-end gap-2 pt-4'>
        <Button type='button' variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button type='submit' variant='destructive' disabled={isPending}>
          {isPending ? 'Removing user...' : 'Remove user'}
        </Button>
      </div>
    </form>
  )
}

export default DeleteUserForm
