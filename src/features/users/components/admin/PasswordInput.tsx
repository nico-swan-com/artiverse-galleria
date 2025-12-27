'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EyeIcon, EyeOffIcon, RefreshCw, Check, X } from 'lucide-react'
import React, { useState, useMemo, useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface PasswordValidation {
  minLength: boolean
  maxLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSpecial: boolean
}

export const validatePassword = (password: string): PasswordValidation => ({
  minLength: password.length >= 8,
  maxLength: password.length <= 20,
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
  hasNumber: /[0-9]/.test(password),
  hasSpecial: /[!@#$%^&*()_+\-=`~[\]{}|;':",.<>?/]/.test(password)
})

export const isPasswordValid = (password: string): boolean => {
  const validation = validatePassword(password)
  return Object.values(validation).every(Boolean)
}

const getStrength = (validation: PasswordValidation): number => {
  return Object.values(validation).filter(Boolean).length
}

const getStrengthLabel = (strength: number): string => {
  if (strength <= 2) return 'Weak'
  if (strength <= 4) return 'Fair'
  if (strength <= 5) return 'Good'
  return 'Strong'
}

const getStrengthColor = (strength: number): string => {
  if (strength <= 2) return 'bg-red-500'
  if (strength <= 4) return 'bg-yellow-500'
  if (strength <= 5) return 'bg-blue-500'
  return 'bg-green-500'
}

const ValidationHint = ({
  valid,
  children
}: {
  valid: boolean
  children: React.ReactNode
}) => (
  <div
    className={cn(
      'flex items-center gap-1.5 text-xs transition-colors',
      valid ? 'text-green-600' : 'text-muted-foreground'
    )}
  >
    {valid ? (
      <Check className='size-3' />
    ) : (
      <X className='size-3 text-muted-foreground/50' />
    )}
    {children}
  </div>
)

interface PasswordInputProps extends React.ComponentProps<'input'> {
  showHints?: boolean
  onValidChange?: (isValid: boolean) => void
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showHints = true, onValidChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const validation = useMemo(() => validatePassword(password), [password])
    const strength = useMemo(() => getStrength(validation), [validation])
    const isValid = useMemo(
      () => Object.values(validation).every(Boolean),
      [validation]
    )
    const showValidation = showHints && (isFocused || password.length > 0)

    // Notify parent of validity changes
    useEffect(() => {
      onValidChange?.(isValid)
    }, [isValid, onValidChange])

    const generatePassword = () => {
      const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
      const numberChars = '0123456789'
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

      const allChars =
        uppercaseChars + lowercaseChars + numberChars + specialChars
      const minLength = 12
      const maxLength = 16

      let pwd = ''

      // Ensure at least one of each character type
      pwd += uppercaseChars.charAt(
        Math.floor(Math.random() * uppercaseChars.length)
      )
      pwd += lowercaseChars.charAt(
        Math.floor(Math.random() * lowercaseChars.length)
      )
      pwd += numberChars.charAt(Math.floor(Math.random() * numberChars.length))
      pwd += specialChars.charAt(
        Math.floor(Math.random() * specialChars.length)
      )

      // Add remaining characters randomly
      const targetLength =
        minLength + Math.floor(Math.random() * (maxLength - minLength + 1))
      while (pwd.length < targetLength) {
        pwd += allChars.charAt(Math.floor(Math.random() * allChars.length))
      }

      // Shuffle the password to mix the character types
      pwd = pwd
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('')

      setPassword(pwd)
    }

    return (
      <div className='space-y-2'>
        <div className='flex flex-row gap-1'>
          <div className='relative grow'>
            <Input
              type={showPassword ? 'text' : 'password'}
              className={cn('hide-password-toggle pr-10', className)}
              value={password}
              ref={ref}
              {...props}
              onChange={(e) => {
                setPassword(e.target.value)
                props.onChange?.(e)
              }}
              onFocus={(e) => {
                setIsFocused(true)
                props.onFocus?.(e)
              }}
              onBlur={(e) => {
                setIsFocused(false)
                props.onBlur?.(e)
              }}
            />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeIcon className='size-4' aria-hidden='true' />
              ) : (
                <EyeOffIcon className='size-4' aria-hidden='true' />
              )}
              <span className='sr-only'>
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </Button>
          </div>
          <Button
            type='button'
            variant='outline'
            size='icon'
            className='shrink-0'
            onClick={generatePassword}
            title='Generate secure password'
          >
            <RefreshCw className='size-4' aria-hidden='true' />
          </Button>
        </div>

        {/* Strength indicator */}
        {showValidation && (
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-muted'>
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    getStrengthColor(strength)
                  )}
                  style={{ width: `${(strength / 6) * 100}%` }}
                />
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  strength <= 2
                    ? 'text-red-500'
                    : strength <= 4
                      ? 'text-yellow-500'
                      : strength <= 5
                        ? 'text-blue-500'
                        : 'text-green-500'
                )}
              >
                {getStrengthLabel(strength)}
              </span>
            </div>

            {/* Validation hints */}
            <div className='grid grid-cols-2 gap-x-4 gap-y-1'>
              <ValidationHint valid={validation.minLength}>
                At least 8 characters
              </ValidationHint>
              <ValidationHint valid={validation.hasUppercase}>
                Uppercase letter
              </ValidationHint>
              <ValidationHint valid={validation.hasLowercase}>
                Lowercase letter
              </ValidationHint>
              <ValidationHint valid={validation.hasNumber}>
                Number
              </ValidationHint>
              <ValidationHint valid={validation.hasSpecial}>
                Special character
              </ValidationHint>
              <ValidationHint valid={validation.maxLength}>
                Max 20 characters
              </ValidationHint>
            </div>
          </div>
        )}

        {/* hides browsers password toggles */}
        <style>{`
        .hide-password-toggle::-ms-reveal,
        .hide-password-toggle::-ms-clear {
          visibility: hidden;
          pointer-events: none;
          display: none;
        }
      `}</style>
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
