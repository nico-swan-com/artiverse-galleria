'use client'

import { useActionState, useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { toast } from 'sonner'
import { userFormAction, UserFormState } from './user-form.action'
import { User } from '@/types/users/user.schema'
import { UserRoles } from '@/types/users/user-roles.enum'
import { UserStatus } from '@/types/users/user-status.enum'
import { useRouter } from 'next/navigation'
import { PasswordInput } from './PasswordInput'
import AvatarImageInput from '@/features/media/components/admin/AvatarImageInput'
import { getAvatarUrl } from '@/lib/utilities'

interface UserFormProps {
  initialUser?: User
  isEdit?: boolean
}

const initialFormState: UserFormState = {
  success: false,
  message: '',
  errors: {}
}

const MAX_FILE_SIZE = 1024 * 1024 // 1MB

// Simple email validation regex
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function UserForm({
  initialUser,
  isEdit = false
}: UserFormProps) {
  const router = useRouter()
  const [name, setName] = useState(initialUser?.name || '')
  const [email, setEmail] = useState(initialUser?.email || '')
  const [role, setRole] = useState(initialUser?.role || UserRoles.Client)
  const [status, setStatus] = useState(
    initialUser?.status || UserStatus.Pending
  )
  const [showPasswordFields, setShowPasswordFields] = useState(!isEdit)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined
  )

  const [state, formAction, isPending] = useActionState<
    UserFormState,
    FormData
  >(
    userFormAction,
    isEdit && initialUser
      ? {
          ...initialFormState,
          id: initialUser.id!,
          name: initialUser.name,
          email: initialUser.email,
          password: initialUser.password!,
          role: initialUser.role,
          status: initialUser.status,
          avatar: initialUser.avatar || undefined
        }
      : initialFormState
  )

  // Compute form validity
  const isFormValid = useMemo(() => {
    const isNameValid = name.trim().length >= 2
    const isEmailValid = isValidEmail(email)
    const isPasswordOk = isEdit
      ? !showPasswordFields || isPasswordValid
      : isPasswordValid
    return isNameValid && isEmailValid && isPasswordOk && !avatarError
  }, [name, email, showPasswordFields, isPasswordValid, avatarError, isEdit])

  useEffect(() => {
    if (state.success && !!state.message && !isPending) {
      toast.success(state.message)
      router.push('/admin/users')
    }
  }, [state.success, state.message, isPending, router])

  useEffect(() => {
    if (state.success && state.avatar) {
      setAvatarPreview((prev) => {
        if (prev !== state.avatar) {
          return state.avatar
        }
        return prev
      })
    }
  }, [state.success, state.avatar])

  useEffect(() => {
    if (avatarFile) {
      setAvatarError(null)
    }
  }, [avatarFile])

  const handleFormAction = (formData: FormData) => {
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
    <form
      action={handleFormAction}
      className='min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8'
    >
      <div className='mx-auto max-w-7xl'>
        <Input type='hidden' name='isEdit' value={isEdit ? 'true' : 'false'} />
        {isEdit && initialUser && (
          <Input type='hidden' name='id' value={initialUser.id} />
        )}

        <div className='mb-8'>
          <h1 className='text-3xl font-bold tracking-tight'>
            {isEdit ? 'Edit User' : 'Add New User'}
          </h1>
          <p className='mt-2 text-muted-foreground'>
            {isEdit ? 'Update user information' : 'Create a new user account'}
          </p>
        </div>

        <div className='grid grid-cols-1 gap-12 lg:grid-cols-3'>
          {/* Avatar Section */}
          <div className='space-y-6'>
            <div>
              <Label className='mb-2 block text-lg font-semibold'>Avatar</Label>
              <AvatarImageInput
                url={
                  avatarPreview ||
                  state.avatar ||
                  (initialUser?.avatar && initialUser.updatedAt
                    ? `${initialUser.avatar}?v=${new Date(initialUser.updatedAt).getTime()}`
                    : getAvatarUrl(email, name))
                }
                onChangeAction={handleAvatarChange}
                maxFileSize={MAX_FILE_SIZE}
                error={avatarError || state.errors?.avatarFile?.[0]}
              />
            </div>
          </div>

          {/* User Details Section */}
          <div className='space-y-6 lg:col-span-2'>
            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='name'
              >
                Name <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='name'
                name='name'
                placeholder='John Doe'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='mb-1'
              />
              {state?.errors?.name && (
                <p className='text-xs text-red-500'>
                  {state.errors.name.join(', ')}
                </p>
              )}
            </div>

            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='email'
              >
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
                className='mb-1'
              />
              {email && !isValidEmail(email) && (
                <p className='text-xs text-red-500'>
                  Please enter a valid email address
                </p>
              )}
              {state.errors?.email && (
                <p className='text-xs text-red-500'>
                  {state.errors.email.join(', ')}
                </p>
              )}
            </div>

            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='role'
              >
                Role <span className='text-destructive'>*</span>
              </Label>
              <Select
                name='role'
                value={role}
                onValueChange={(value) => setRole(value as UserRoles)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select role' />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserRoles).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.role && (
                <p className='text-xs text-red-500'>
                  {state.errors.role.join(', ')}
                </p>
              )}
            </div>

            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='status'
              >
                Status <span className='text-destructive'>*</span>
              </Label>
              <Select
                name='status'
                value={status}
                onValueChange={(value) => setStatus(value as UserStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserStatus).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.status && (
                <p className='text-xs text-red-500'>
                  {state.errors.status.join(', ')}
                </p>
              )}
            </div>

            {/* Password Section */}
            {!isEdit && (
              <div>
                <Label
                  className='mb-2 block text-lg font-semibold'
                  htmlFor='password'
                >
                  Password <span className='text-destructive'>*</span>
                </Label>
                <PasswordInput
                  id='password'
                  name='password'
                  required
                  onValidChange={setIsPasswordValid}
                />
              </div>
            )}

            {isEdit && !showPasswordFields && (
              <Button
                type='button'
                className='w-full'
                variant='secondary'
                onClick={() => setShowPasswordFields(true)}
              >
                Change Password
              </Button>
            )}

            {isEdit && showPasswordFields && (
              <div>
                <Label
                  className='mb-2 block text-lg font-semibold'
                  htmlFor='newPassword'
                >
                  New Password
                </Label>
                <PasswordInput
                  id='newPassword'
                  name='newPassword'
                  required
                  onValidChange={setIsPasswordValid}
                />
              </div>
            )}

            {state?.success === false && state.message && (
              <p className='text-sm font-medium text-destructive'>
                {state.message}
              </p>
            )}

            <div className='mt-6 flex gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/admin/users')}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={isPending || !isFormValid}
                className='flex-1'
              >
                {isPending
                  ? isEdit
                    ? 'Updating user...'
                    : 'Adding user...'
                  : isEdit
                    ? 'Update User'
                    : 'Add User'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
