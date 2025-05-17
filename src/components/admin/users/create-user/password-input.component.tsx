'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EyeIcon, EyeOffIcon, Recycle } from 'lucide-react'
import React, { useState } from 'react'

import { Input } from '@/components/ui/input'

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [suggestedPassword, setSuggestedPassword] = useState('')
  const disabled =
    props.value === '' || props.value === undefined || props.disabled
  const generatePassword = () => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const numberChars = '0123456789'
    const specialChars = '!@#$%^&*()_+=-`~[]\\{}|;\':",./<>?'

    const allChars =
      uppercaseChars + lowercaseChars + numberChars + specialChars
    const minLength = 8
    const maxLength = 19

    let password = ''

    // Ensure at least one of each character type
    password += uppercaseChars.charAt(
      Math.floor(Math.random() * uppercaseChars.length)
    )
    password += lowercaseChars.charAt(
      Math.floor(Math.random() * lowercaseChars.length)
    )
    password += numberChars.charAt(
      Math.floor(Math.random() * numberChars.length)
    )
    password += specialChars.charAt(
      Math.floor(Math.random() * specialChars.length)
    )

    // Add remaining characters randomly
    const remainingLength = Math.max(
      0,
      Math.floor(Math.random() * (maxLength - password.length + 1)) +
        (minLength - password.length)
    )
    for (let i = 0; i < remainingLength; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length))
    }

    // Shuffle the password to mix the character types
    password = password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('')

    return setSuggestedPassword(password)
  }

  return (
    <div>
      <div className='flex flex-row'>
        <div className='relative grow'>
          <Input
            type={showPassword ? 'text' : 'password'}
            className={cn('hide-password-toggle pr-10', className)}
            value={suggestedPassword}
            ref={ref}
            {...props}
            onChange={(e) => {
              setSuggestedPassword(e.target.value)
            }}
          />
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword && !disabled ? (
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
          variant='ghost'
          size='sm'
          className='right-0 h-full p-3 hover:bg-transparent'
          onClick={() => generatePassword()}
        >
          <Recycle className='size-4' aria-hidden='true' />
        </Button>
      </div>

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
})
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
// '

// const PasswordGenerator = () => {
//   const [suggestedPassword, setSuggestedPassword] = useState('')

//   useEffect(() => {
//     generatePassword() // Generate a password on component mount
//   }, [])

//   return (
//     <div className='space-y-2'>
//       <Label htmlFor='suggested-password'>Suggested Password:</Label>
//       <Input
//         type='text'
//         id='suggested-password'
//         value={suggestedPassword}
//         readOnly
//       >
//         <Button onClick={generatePassword}>
//           <Recycle />
//         </Button>
//       </Input>
//     </div>
//   )
// }

// export default PasswordGenerator
