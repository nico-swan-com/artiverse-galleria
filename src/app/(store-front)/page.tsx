import Hero from '@/components/sections/hero/hero.server'
import ScrollButton from '@/components/sections/ui/scroll-button.client'
import { artworks } from '@/data/artworks'

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
