"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  user: { email: string; name: string } | null
  login: (email: string, password: string) => void
  register: (name: string, email: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Load auth from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("jayarts_auth")
    if (stored) {
      const auth = JSON.parse(stored)
      setIsAuthenticated(true)
      setUser(auth)
    }
    setLoaded(true)
  }, [])

  const login = (email: string, password: string) => {
    // Mock authentication
    if (email && password.length >= 6) {
      const userData = {
        email,
        name: email.split("@")[0],
      }
      localStorage.setItem("jayarts_auth", JSON.stringify(userData))
      setIsAuthenticated(true)
      setUser(userData)
    }
  }

  const register = (name: string, email: string, password: string) => {
    if (name && email && password.length >= 6) {
      const userData = {
        email,
        name,
      }
      localStorage.setItem("jayarts_auth", JSON.stringify(userData))
      setIsAuthenticated(true)
      setUser(userData)
    }
  }

  const logout = () => {
    localStorage.removeItem("jayarts_auth")
    setIsAuthenticated(false)
    setUser(null)
  }

  if (!loaded) return null

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
