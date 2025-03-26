'use client'

import { User } from '@/types/user'
import React, { createContext, useContext, useState, useCallback } from 'react'
interface ChildrenProps {
  children: React.ReactNode
}

interface UserContextType {
  // Auth
  currentUser: User | null
}

const getUserByEmail = (email: string) => {
  return {
    id: '1',
    email,
    password: 'password',
    name: 'Demo User'
  }
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: ChildrenProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const login = useCallback((email: string, password: string) => {
    const user = getUserByEmail(email)
    if (user && user.password === password) {
      setCurrentUser(user)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  const value = {
    currentUser,
    login,
    logout
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within an UserProvider')
  }
  return context
}
