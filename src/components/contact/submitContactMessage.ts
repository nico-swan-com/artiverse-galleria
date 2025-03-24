'use server'

import { sendMail } from '@/lib/mailer/sendMail'
import { z } from 'zod'

const MessageSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  subject: z
    .string()
    .min(2, { message: 'Subject must be at least 2 characters.' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters.' })
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function submitContactMessage(prevState: any, formData: FormData) {
  try {
    const values = MessageSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    })

    const emailOptions = {
      email: values.email,
      subject: values.subject,
      text: `From: ${values.name} <${values.email}>\n\n${values.message}`
    }

    await sendMail(emailOptions)

    return { success: true, message: 'Message sent successfully!' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Return the errors to the form
      return {
        success: false,
        errors: error.flatten().fieldErrors,
        message: 'Validation error. Please check the fields.'
      }
    } else {
      console.error(error)
      return { success: false, message: 'Failed to send message.' }
    }
  }
}

export default submitContactMessage
