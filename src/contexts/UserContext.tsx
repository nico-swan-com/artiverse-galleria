import { User } from '@/types/user'
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback
} from 'react'

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

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
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
