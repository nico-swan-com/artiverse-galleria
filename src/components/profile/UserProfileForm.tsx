'use client'

import React, {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState
} from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AvatarImageInput from '@/components/admin/media/AvatarImageInput'
import { PasswordInput } from '@/components/admin/users/create-user/PasswordInput'
import { updateProfileAction } from '@/lib/users/profile.actions'
import { getAvatarUrl } from '@/lib/utilities/get-avatar-url'
import { User } from '@/types/users/user.schema'
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'

interface UserProfileFormProps {
  user: User
}

const initialFormState = {
  success: false,
  message: ''
}

const UserProfileForm = ({ user }: UserProfileFormProps) => {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialFormState
  )

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    user.avatar || undefined
  )

  const [name, setName] = useState(user.name)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)

  // Client-side Validation
  const isFormValid = useMemo(() => {
    const isNameValid = name.trim().length >= 2
    const isPasswordOk = !showPasswordFields || isPasswordValid
    const isAvatarOk = !avatarError
    return isNameValid && isPasswordOk && isAvatarOk
  }, [name, showPasswordFields, isPasswordValid, avatarError])

  // Toast notifications
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
      } else if (!state.errors) {
        toast.error(state.message)
      }
    }
  }, [state])

  // Update avatar preview on success
  useEffect(() => {
    if (state.success && state.avatar) {
      setAvatarPreview(state.avatar)
    }
  }, [state.success, state.avatar])

  const handleAvatarChange = (file: File | string | null) => {
    if (file instanceof File) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
      setAvatarError(null)
    } else {
      setAvatarFile(null) // Keep preview if it was cleared/reset? user experience choice.
      // Reset to original if cancelled/cleared?
      // For now, let's keep it simple.
      setAvatarError(null)
    }
  }

  const handleSubmit = (formData: FormData) => {
    if (avatarFile) {
      formData.set('avatarFile', avatarFile)
    }

    // Using startTransition to wrap the server action call
    // Although useActionState handles this, explicit wrapping can sometimes help with reset logic if needed
    // But here formAction is enough.
    formAction(formData)
  }

  return (
    <form action={handleSubmit} className='max-w-xl space-y-6'>
      {/* Avatar Section */}
      <div className='flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0'>
        <div className='shrink-0'>
          <Label htmlFor='avatarFile' className='sr-only'>
            Avatar
          </Label>
          <AvatarImageInput
            url={avatarPreview || getAvatarUrl(user.email, user.name)}
            onChangeAction={handleAvatarChange}
            error={avatarError || state.errors?.avatarFile?.[0]}
          />
        </div>
        <div>
          <h3 className='text-lg font-medium'>Profile Photo</h3>
          <p className='text-sm text-muted-foreground'>
            Click the avatar to upload a new one. crop and zoom tools included.
          </p>
        </div>
      </div>

      <div className='grid gap-4'>
        {/* Name */}
        <div className='space-y-2'>
          <Label htmlFor='name'>
            Name <span className='text-destructive'>*</span>
          </Label>
          <Input
            id='name'
            name='name'
            placeholder='Your name'
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {state.errors?.name && (
            <p className='text-sm font-medium text-destructive'>
              {state.errors.name.join(', ')}
            </p>
          )}
        </div>

        {/* Email (Read Only) */}
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            type='email'
            value={user.email}
            disabled
            className='bg-muted text-muted-foreground'
          />
          <p className='text-[0.8rem] text-muted-foreground'>
            Email cannot be changed directly. Contact support for assistance.
          </p>
        </div>

        {/* Change Password Section */}
        <div className='rounded-lg border p-4'>
          <Collapsible
            open={showPasswordFields}
            onOpenChange={setShowPasswordFields}
            className='space-y-2'
          >
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='font-medium'>Password</h4>
                <p className='text-sm text-muted-foreground'>
                  Update your password securely.
                </p>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant='ghost' size='sm' className='w-9 p-0'>
                  {showPasswordFields ? (
                    <ChevronDown className='size-4' />
                  ) : (
                    <ChevronRight className='size-4' />
                  )}
                  <span className='sr-only'>Toggle password fields</span>
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className='space-y-4 pt-4'>
              <div className='space-y-2'>
                <Label htmlFor='password'>New Password</Label>
                <PasswordInput
                  asChild
                  id='password'
                  name='password'
                  onValidChange={setIsPasswordValid}
                  required={showPasswordFields}
                />
                {state.errors?.password && (
                  <p className='text-sm font-medium text-destructive'>
                    {state.errors.password.join(', ')}
                  </p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Submit Button */}
      <div className='flex justify-end'>
        <Button type='submit' disabled={isPending || !isFormValid}>
          {isPending ? (
            <>
              <Loader2 className='mr-2 size-4 animate-spin' />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  )
}

export default UserProfileForm
