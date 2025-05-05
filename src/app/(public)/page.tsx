import Hero from '@/components/public/sections/hero/hero.component'
import ScrollButton from '@/components/public/sections/ui/scroll-button.component'
import { artworks } from '@/lib/database/data/artworks'

/**
 * Renders the home page with a featured artwork image and a scroll button.
 *
 * Displays the {@link Hero} component using the first image from the first artwork as the featured image, followed by the {@link ScrollButton} component.
 */
export default function Home() {
  return (
    <main>
      <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden'>
        <Hero featureImageUrl={artworks[0].images[0]} />
        <ScrollButton />
      </div>
    </main>
  )
}
