'use client'

import { AnimatePresence } from 'framer-motion'
import React from 'react'

type AnimatePresenceProps = React.ComponentProps<typeof AnimatePresence>

const AnimatePresenceWrapper: React.FC<AnimatePresenceProps> = ({
  children,
  ...props
}) => {
  return <AnimatePresence {...props}>{children}</AnimatePresence>
}

export default AnimatePresenceWrapper
