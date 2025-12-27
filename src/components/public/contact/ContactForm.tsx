'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Send } from 'lucide-react'

import submitContactMessage, {
  ContactFormState
} from './submit-contact-message.action'
import { toast } from 'sonner'

const formInitialState: ContactFormState = {
  success: false,
  message: '',
  name: '',
  email: '',
  subject: '',
  content: '',
  errors: {}
}

const ContactForm = () => {
  const [state, formAction, isPending] = useActionState(
    submitContactMessage,
    formInitialState
  )

  if (!isPending && state?.success) {
    toast('Message sent successfully!', {
      description: "We'll get back to you as soon as possible."
    })
  }

  return (
    <>
      {/* Contact Form */}
      <div className='rounded-lg bg-white p-8 shadow-sm'>
        <h2 className='mb-6 text-2xl font-bold text-gray-900'>
          Send Us a Message
        </h2>

        <form action={formAction} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Your Name</Label>
            <Input id='name' name='name' required />
            {state?.errors?.name && (
              <p className='text-red-500'>{state.errors.name.join(', ')}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>Email Address</Label>
            <Input id='email' name='email' type='email' required />
            {state?.errors?.email && (
              <p className='text-red-500'>{state.errors.email.join(', ')}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='subject'>Subject</Label>
            <Input id='subject' name='subject' required />
            {state?.errors?.subject && (
              <p className='text-red-500'>{state.errors.subject.join(', ')}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='content'>Message</Label>
            <Textarea id='content' name='content' rows={5} required />
            {state?.errors?.content && (
              <p className='text-red-500'>{state.errors.content.join(', ')}</p>
            )}
          </div>

          <Button type='submit' disabled={isPending} className='w-full'>
            {isPending ? (
              'Sending...'
            ) : (
              <>
                <Send className='mr-2 size-4' />
                Send Message
              </>
            )}
          </Button>
        </form>
      </div>
    </>
  )
}

export default ContactForm
