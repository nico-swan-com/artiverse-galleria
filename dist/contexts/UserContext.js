import React, { createContext, useContext, useState, useCallback } from 'react'
const getUserByEmail = (email) => {
  return {
    id: '1',
    email,
    password: 'password',
    name: 'Demo User'
  }
}
const UserContext = createContext(undefined)
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const login = useCallback((email, password) => {
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
