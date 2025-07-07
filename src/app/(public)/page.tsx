import Hero from '@/components/public/sections/hero/Hero'
import ScrollButton from '@/components/public/sections/ui/ScrollButton'

const Home = async () => {
  return (
    <main className='-mt-20'>
      <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden'>
        <Hero />
        <ScrollButton />
      </div>
    </main>
  )
}

export default Home
