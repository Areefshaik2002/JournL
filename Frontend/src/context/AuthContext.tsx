import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import type { User } from '../services/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (data: { email: string; password: string }) => Promise<void>
  register: (data: { name: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authAPI.getMe()
        setUser(response.data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const login = async (data: { email: string; password: string }) => {
    const response = await authAPI.login(data)
    setUser(response.data.user)
  }

  const register = async (data: { name: string; email: string; password: string }) => {
    const response = await authAPI.register(data)
    setUser(response.data.user)
  }

  const logout = async () => {
    await authAPI.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
