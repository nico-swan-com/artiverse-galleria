'use client'

import React, { useActionState, useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import editUserAction, { EditUserState } from './edit-user.action'
import { User } from '@/types/users/user.schema'
import { UserRoles } from '@/types/users/user-roles.enum'
import { UserStatus } from '@/types/users/user-status.enum'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { PasswordInput } from '../create-user/PasswordInput'
import AvatarImageInput from '../../media/AvatarImageInput'
import { getAvatarUrl } from '@/lib/utilities'

interface EditUserFormProps {
  user: User
  onClose: () => void
}

const initialFormState: EditUserState = {
  id: '',
  success: false,
  message: '',
  name: '',
  email: '',
  password: '',
  newPassword: '',
  role: '',
  status: '',
  avatar: undefined,
  avatarFile: undefined,
  errors: {}
}

const MAX_FILE_SIZE = 1024 * 1024 // 1MB in bytes

// Simple email validation regex
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const EditUserForm = ({ user, onClose }: EditUserFormProps) => {
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [state, formAction, isPending] = useActionState<
    EditUserState,
    FormData
  >(editUserAction, {
    ...initialFormState,
    id: user.id!,
    name: user.name,
    email: user.email,
    password: user.password!,
    role: user.role,
    avatar: user.avatar,
    status: user.status
  })
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined
  )

  // Compute form validity
  const isFormValid = useMemo(() => {
    const isNameValid = name.trim().length >= 2
    const isEmailValid = isValidEmail(email)
    const isPasswordOk = !showPasswordFields || isPasswordValid
    return isNameValid && isEmailValid && isPasswordOk && !avatarError
  }, [name, email, showPasswordFields, isPasswordValid, avatarError])

  useEffect(() => {
    if (state.success && !!state.message && !isPending) {
      toast.success(state.message)
      onClose()
    }
  }, [state.success, state.message, isPending, onClose])

  useEffect(() => {
    if (state.success && state.avatar) {
      setAvatarPreview((prev) => {
        if (prev !== state.avatar) {
          return state.avatar
        }
        return prev
      })
    }
    // Only run when state.success or state.avatar changes
  }, [state.success, state.avatar])

  // Clear avatar error when avatarFile changes
  useEffect(() => {
    if (avatarFile) {
      setAvatarError(null)
    }
  }, [avatarFile])

  const handleFormAction = (formData: FormData) => {
    // Clear any previous errors
    setAvatarError(null)

    // Validate file size before submission
    if (avatarFile && avatarFile.size > MAX_FILE_SIZE) {
      const sizeInMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(1)
      const fileSizeInMB = (avatarFile.size / (1024 * 1024)).toFixed(1)
      setAvatarError(
        `File size (${fileSizeInMB}MB) exceeds the maximum allowed size of ${sizeInMB}MB`
      )
      return
    }

    if (avatarFile) {
      formData.set('avatarFile', avatarFile)
    } else {
      formData.delete('avatarFile')
    }
    formAction(formData)
  }

  const handleAvatarChange = (file: File | string | null) => {
    if (file instanceof File) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
      setAvatarError(null)
    } else {
      setAvatarFile(null)
      setAvatarPreview(undefined)
      setAvatarError(null)
    }
  }

  return (
    <form action={handleFormAction} className='mt-4 space-y-4'>
      <Input id='userId' name='userId' type='hidden' defaultValue={user.id} />
      <div className='space-y-2'>
        <Label htmlFor='avatarFile'>Avatar</Label>
        <AvatarImageInput
          url={
            avatarPreview || state.avatar || getAvatarUrl(user.email, user.name)
          }
          onChangeAction={handleAvatarChange}
          maxFileSize={MAX_FILE_SIZE}
          error={avatarError || state.errors?.avatarFile?.[0]}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='name'>
          Name <span className='text-destructive'>*</span>
        </Label>
        <Input
          id='name'
          name='name'
          placeholder='John Doe'
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {!state.success && state.errors?.name && (
          <p className='text-sm font-medium text-destructive'>
            {state.errors.name.join(', ')}
          </p>
        )}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='email'>
          Email <span className='text-destructive'>*</span>
        </Label>
        <Input
          id='email'
          name='email'
          type='email'
          placeholder='john@example.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {email && !isValidEmail(email) && (
          <p className='text-sm font-medium text-destructive'>
            Please enter a valid email address
          </p>
        )}
        {!state.success && state.errors?.email && (
          <p className='text-sm font-medium text-destructive'>
            {state.errors.email.join(', ')}
          </p>
        )}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='role'>
          Role <span className='text-destructive'>*</span>
        </Label>
        <Select name='role' defaultValue={user.role}>
          <SelectTrigger>
            <SelectValue placeholder='Select role' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(UserRoles).map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!state.success && state.errors?.role && (
          <p className='text-sm font-medium text-destructive'>
            {state.errors.role.join(', ')}
          </p>
        )}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='status'>
          Status <span className='text-destructive'>*</span>
        </Label>
        <Select name='status' defaultValue={user.status}>
          <SelectTrigger>
            <SelectValue placeholder='Select status' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(UserStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!state.success && state.errors?.status && (
          <p className='text-sm font-medium text-destructive'>
            {state.errors.status.join(', ')}
          </p>
        )}
      </div>

      {!showPasswordFields && (
        <Button
          type='button'
          className='w-full'
          variant='secondary'
          onClick={() => setShowPasswordFields(true)}
        >
          Change Password
        </Button>
      )}

      {showPasswordFields && (
        <div className='space-y-2'>
          <Label htmlFor='newPassword'>Password</Label>
          <PasswordInput
            id='newPassword'
            name='newPassword'
            required
            onValidChange={setIsPasswordValid}
          />
        </div>
      )}

      <div className='flex justify-end pt-4'>
        <Button
          type='submit'
          disabled={isPending || !isFormValid}
          className='w-full'
        >
          {isPending ? 'Updating user...' : 'Update user'}
        </Button>
      </div>
    </form>
  )
}

export default EditUserForm
