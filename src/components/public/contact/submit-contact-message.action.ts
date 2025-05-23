'use server'

import { sendMail } from '@/lib/mailer/sendMail'
import { MessageSchema } from './message.schema'
import { z } from 'zod'

export type ContactFormErrors = {
  name?: string[]
  email?: string[]
  subject?: string[]
  content?: string[]
}

export type ContactFormState = {
  success: boolean
  message: string
  name: string
  email: string
  subject: string
  content: string
  errors: ContactFormErrors
}

async function submitContactMessage(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get('name')?.toString() || ''
  const email = formData.get('email')?.toString() || ''
  const subject = formData.get('subject')?.toString() || ''
  const content = formData.get('content')?.toString() || ''

  const state: ContactFormState = {
    success: false,
    message: '',
    name,
    email,
    subject,
    content,
    errors: {}
  }

  try {
    const values = MessageSchema.parse(state)

    const emailOptions = {
      email: values.email,
      subject: values.subject,
      text: `From: ${values.name} <${values.email}>\n\n${values.content}`
    }

    await sendMail(emailOptions)

    return {
      ...state,
      success: true,
      message: 'Message sent successfully!'
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: ContactFormErrors = {}
      error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactFormErrors
        if (field) {
          fieldErrors[field] = fieldErrors[field] || []
          fieldErrors[field]!.push(err.message)
        }
      })
      return {
        ...state,
        success: false,
        message: 'Failed to send message',
        errors: fieldErrors
      }
    } else if (error instanceof Error) {
      return {
        ...state,
        success: false,
        message: 'Failed to send message',
        errors: {
          content: [error.message]
        }
      }
    }
  }

  return {
    ...state,
    success: false,
    message: 'An unknown error occurred.',
    errors: state.errors
  }
}

export default submitContactMessage
