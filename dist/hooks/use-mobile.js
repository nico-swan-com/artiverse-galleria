import { useState, useEffect } from 'react'
const MOBILE_BREAKPOINT = 768
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    // Initial check
    handleResize()
    // Add event listener for window resize
    window.addEventListener('resize', handleResize)
    // Clean up the event listener
    return () => window.removeEventListener('resize', handleResize)
  })
  return isMobile
}
