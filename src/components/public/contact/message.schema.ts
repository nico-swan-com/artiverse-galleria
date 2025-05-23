import { z } from 'zod'

export const MessageSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),

  subject: z
    .string()
    .min(2, { message: 'Subject must be at least 2 characters.' }),
  content: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters.' })
})
