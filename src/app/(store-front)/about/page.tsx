import { Button } from '@/components/ui/button'
import Link from 'next/link'

const About = () => {
  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='relative bg-gray-50 px-4 py-20 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          <div className='text-center'>
            <h1 className='mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl'>
              About Our Gallery
            </h1>
            <p className='mx-auto max-w-3xl text-lg text-gray-600'>
              Connecting art lovers with unique pieces and talented artists
              since 2010.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className='px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
            <div>
              <h2 className='mb-6 text-3xl font-bold text-gray-900'>
                Our Story
              </h2>
              <div className='space-y-4 text-gray-600'>
                <p>
                  Our gallery was founded in 2010 with a simple mission: to make
                  exceptional art accessible to everyone. What began as a small
                  physical gallery has evolved into a global online platform
                  showcasing talented artists from around the world.
                </p>
                <p>
                  We believe that art has the power to transform spaces and
                  lives. Our curated collection represents diverse styles,
                  mediums, and price points, ensuring that everyone can find
                  something that resonates with them.
                </p>
                <p>
                  As an artist-first gallery, we prioritize fair compensation
                  and recognition for our creators. We work closely with each
                  artist to ensure their work is presented authentically and
                  reaches the right collectors.
                </p>
              </div>
            </div>
            <div className='relative overflow-hidden rounded-lg shadow-xl'>
              <img
                src='https://images.unsplash.com/photo-1594732832278-abd644401426?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
                alt='Gallery interior'
                className='aspect-[4/3] size-full object-cover'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className='bg-gray-50 px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
            <div className='relative order-2 overflow-hidden rounded-lg shadow-xl lg:order-1'>
              <img
                src='https://images.unsplash.com/photo-1629010307583-f27ae0f9662e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                alt='Artist working'
                className='aspect-[4/3] size-full object-cover'
              />
            </div>
            <div className='order-1 lg:order-2'>
              <h2 className='mb-6 text-3xl font-bold text-gray-900'>
                Our Mission
              </h2>
              <div className='space-y-4 text-gray-600'>
                <p>
                  We&apos;re dedicated to democratizing the art world by making
                  it more accessible, diverse, and transparent. Our mission is
                  three-fold:
                </p>
                <ul className='list-disc space-y-2 pl-6'>
                  <li>
                    <strong>Support Artists:</strong> We provide a platform for
                    both established and emerging artists to showcase their work
                    to a global audience.
                  </li>
                  <li>
                    <strong>Connect Collectors:</strong> We help art enthusiasts
                    discover pieces that speak to them, whether they&apos;re
                    seasoned collectors or first-time buyers.
                  </li>
                  <li>
                    <strong>Educate & Inspire:</strong> We share the stories
                    behind the art, fostering a deeper appreciation for the
                    creative process and the artists&apos; journeys.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className='px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900'>
              Meet Our Team
            </h2>
            <p className='mx-auto max-w-3xl text-lg text-gray-600'>
              Our passionate team of art enthusiasts, curators, and technology
              experts work together to bring you an exceptional art experience.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {[
              {
                name: 'Elena Rodriguez',
                title: 'Founder & Lead Curator',
                image:
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
                bio: 'With over 15 years of experience in the art world, Elena founded our gallery with a vision to make art more accessible.'
              },
              {
                name: 'Marcus Chen',
                title: 'Artist Relations Manager',
                image:
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
                bio: 'Marcus works closely with our artists, ensuring their vision is communicated authentically and they receive the support they need.'
              },
              {
                name: 'Aisha Johnson',
                title: 'Digital Gallery Director',
                image:
                  'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
                bio: 'Aisha oversees our online platform, enhancing the digital experience of viewing and purchasing art.'
              }
            ].map((member, index) => (
              <div
                key={index}
                className='overflow-hidden rounded-lg bg-white shadow-sm'
              >
                <div className='aspect-square'>
                  <img
                    src={member.image}
                    alt={member.name}
                    className='size-full object-cover'
                  />
                </div>
                <div className='p-6'>
                  <h3 className='text-xl font-bold text-gray-900'>
                    {member.name}
                  </h3>
                  <p className='mb-2 font-medium text-primary'>
                    {member.title}
                  </p>
                  <p className='text-gray-600'>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className='bg-gray-50 px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            Ready to Explore?
          </h2>
          <p className='mx-auto mb-8 max-w-3xl text-lg text-gray-600'>
            Discover our curated collection of exceptional artworks from
            talented artists around the world.
          </p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Button asChild size='lg'>
              <Link href='/artworks'>Browse Gallery</Link>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <Link href='/contact'>Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
