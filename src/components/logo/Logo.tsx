import React, { useState, useEffect } from 'react'
import LogoSVG from './Logo.svg'

const Logo = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [displayText, setDisplayText] = useState('NS')

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined
    if (isHovered) {
      let frame = 1
      const frames = ['NS', 'Ni Sw', 'Nic Swa', 'Nico Swan']
      const animate = () => {
        if (frame < frames.length) {
          setDisplayText(frames[frame])
          frame++
          timeout = setTimeout(animate, 100)
        }
      }
      timeout = setTimeout(animate, 100)
    } else {
      setDisplayText('NS')
      clearTimeout(timeout)
    }
    return () => clearTimeout(timeout)
  }, [isHovered])

  return (
    <div
      className='flex items-center'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <LogoSVG className='text-orange-500' height={48} />
      <span className='bg-gradient-to-r from-white to-gray-400 bg-clip-text text-2xl font-semibold text-transparent'>
        {displayText}
      </span>
    </div>
  )
}

export default Logo
