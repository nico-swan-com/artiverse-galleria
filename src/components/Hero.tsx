'use client'

import { useEffect, useState } from 'react'

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <>
      <div className='relative flex h-screen items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute inset-0 opacity-[0.02]' />
        </div>
        <div>
          <h1
            className={`mb-6 text-5xl font-bold text-primary transition-all delay-100 duration-700 sm:text-6xl lg:text-7xl ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            HERO SECTION
          </h1>
        </div>
      </div>
    </>
  )
}

export default Hero
