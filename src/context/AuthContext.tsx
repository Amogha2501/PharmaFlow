"use client"

import { createContext, useState, useEffect } from "react"
import type { ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (userData: User, token: string) => void
  logout: () => void
  mockLogin: (email: string, password: string, role: string) => Promise<{ token: string; user: User }>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  mockLogin: async () => ({ token: "", user: { id: "", name: "", email: "", role: "" } }),
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = (userData: User, token: string) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  // Mock login function for offline use
  const mockLogin = async (email: string, password: string, role: string): Promise<{ token: string; user: User }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Demo credentials
    const demoUsers = {
      admin: {
        email: "admin@pharmacy.com",
        password: "password123",
        role: "admin",
        name: "Admin User"
      },
      clerk: {
        email: "clerk@pharmacy.com",
        password: "password123",
        role: "clerk",
        name: "Sales Clerk"
      }
    }
    
    // Check if credentials match demo users
    if (role === "admin" && email === demoUsers.admin.email && password === demoUsers.admin.password) {
      const user = {
        id: "1",
        name: demoUsers.admin.name,
        email: demoUsers.admin.email,
        role: demoUsers.admin.role
      }
      const token = "mock-jwt-token-for-admin"
      return { token, user }
    }
    
    if (role === "clerk" && email === demoUsers.clerk.email && password === demoUsers.clerk.password) {
      const user = {
        id: "2",
        name: demoUsers.clerk.name,
        email: demoUsers.clerk.email,
        role: demoUsers.clerk.role
      }
      const token = "mock-jwt-token-for-clerk"
      return { token, user }
    }
    
    // Throw error for invalid credentials
    throw new Error("Invalid credentials. Please check your email and password.")
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, mockLogin }}>{children}</AuthContext.Provider>
}