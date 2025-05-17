import React from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import ContactForm from '@/components/public/contact/contact-form.component'

const Contact = () => {
  return (
    <div className='container mx-auto min-h-screen bg-white px-4 sm:px-6 lg:px-8'>
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
            <ContactForm></ContactForm>
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
