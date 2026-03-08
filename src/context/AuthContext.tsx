'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'

interface User {
  id: string
  name: string
  email: string
  preferredLocations: string | null
  preferredCategories: string | null
  experienceLevel: string | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ error?: string }>
  logout: () => void
  updateProfile: (
    data: Record<string, unknown>,
  ) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('jobpulse_token')
    if (saved) {
      setToken(saved)
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${saved}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.user) setUser(data.user)
        })
        .catch(() => {
          localStorage.removeItem('jobpulse_token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.error) return { error: data.error }
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('jobpulse_token', data.token)
      return {}
    },
    [],
  )

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (data.error) return { error: data.error }
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('jobpulse_token', data.token)
      return {}
    },
    [],
  )

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('jobpulse_token')
  }, [])

  const updateProfile = useCallback(
    async (profileData: Record<string, unknown>) => {
      if (!token) return { error: 'Not logged in' }
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      })
      const data = await res.json()
      if (data.error) return { error: data.error }
      setUser(data.user)
      return {}
    },
    [token],
  )

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
