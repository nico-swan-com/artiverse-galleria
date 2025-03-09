'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { toast } from 'sonner'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })

      toast('Message sent successfully!', {
        description: "We'll get back to you as soon as possible."
      })
    }, 1500)
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Contact Header */}
      <section className='relative bg-gray-50 px-4 py-20 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          <div className='text-center'>
            <h1 className='mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl'>
              Get in Touch
            </h1>
            <p className='mx-auto max-w-3xl text-lg text-gray-600'>
              Have questions about our artworks, artists, or services?
              We&apos;re here to help. Reach out to us using the form below or
              through our contact details.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className='px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
            {/* Contact Information */}
            <div className='rounded-lg bg-gray-50 p-8'>
              <h2 className='mb-6 text-2xl font-bold text-gray-900'>
                Contact Information
              </h2>

              <div className='space-y-6'>
                <div className='flex items-start'>
                  <div className='mr-4 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    <MapPin className='size-5' />
                  </div>
                  <div>
                    <h3 className='text-lg font-medium text-gray-900'>
                      Location
                    </h3>
                    <p className='mt-1 text-gray-600'>
                      123 Gallery Street
                      <br />
                      Someplace City, ST 12345
                      <br />
                      The best country
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div className='mr-4 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    <Phone className='size-5' />
                  </div>
                  <div>
                    <h3 className='text-lg font-medium text-gray-900'>Phone</h3>
                    <p className='mt-1 text-gray-600'>+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div className='mr-4 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    <Mail className='size-5' />
                  </div>
                  <div>
                    <h3 className='text-lg font-medium text-gray-900'>Email</h3>
                    <p className='mt-1 text-gray-600'>info@artgallery.com</p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div className='mr-4 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    <Clock className='size-5' />
                  </div>
                  <div>
                    <h3 className='text-lg font-medium text-gray-900'>Hours</h3>
                    <p className='mt-1 text-gray-600'>
                      Monday - Friday: 10am - 6pm
                      <br />
                      Saturday: 11am - 5pm
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className='mt-10'>
                <h3 className='mb-4 text-lg font-medium text-gray-900'>
                  Follow Us
                </h3>
                <div className='flex space-x-4'>
                  {['facebook', 'twitter', 'instagram', 'linkedin'].map(
                    (social) => (
                      <a
                        key={social}
                        href={`#${social}`}
                        className='flex size-10 items-center justify-center rounded-full bg-gray-200 transition-colors duration-300 hover:bg-primary hover:text-white'
                        aria-label={`Follow us on ${social}`}
                      >
                        <span className='capitalize'>{social.charAt(0)}</span>
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className='rounded-lg bg-white p-8 shadow-sm'>
              <h2 className='mb-6 text-2xl font-bold text-gray-900'>
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Your Name</Label>
                  <Input
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email'>Email Address</Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='subject'>Subject</Label>
                  <Input
                    id='subject'
                    name='subject'
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='message'>Message</Label>
                  <Textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full'
                >
                  {isSubmitting ? (
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
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className='bg-gray-50 px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          <div className='mb-8 text-center'>
            <h2 className='text-2xl font-bold text-gray-900'>Find Us</h2>
            <p className='mt-2 text-gray-600'>Visit our gallery in person</p>
          </div>

          <div className='h-96 overflow-hidden rounded-lg bg-white shadow-sm'>
            {/* Placeholder for a map - in a real app, you'd integrate Google Maps or similar */}
            <div className='flex size-full items-center justify-center bg-gray-200'>
              <p className='text-gray-600'>
                Interactive Map Would Be Displayed Here
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
