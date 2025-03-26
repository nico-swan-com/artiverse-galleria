'use client'

import React from 'react'
import { ArrowDownCircle } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'

const ScrollButton = () => {
  const isMobile = useIsMobile()
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {isMobile && (
        <button
          onClick={scrollToContent}
          className={`animate-bounce text-secondary transition-colors duration-300 hover:text-accent dark:text-primary/80`}
          aria-label='Scroll down'
        >
          <ArrowDownCircle size={32} />
        </button>
      )}
    </>
  )
}

export default ScrollButton
