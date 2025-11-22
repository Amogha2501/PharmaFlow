"use client"

import { createContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
// @ts-ignore
import api from "../services/api"

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
  realLogin: (email: string, password: string, role: string) => Promise<{ token: string; user: User }>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  realLogin: async () => ({ token: "", user: { id: "", name: "", email: "", role: "" } }),
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

  // Real login function that calls the backend API
  const realLogin = async (email: string, password: string, role: string): Promise<{ token: string; user: User }> => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        role
      })
      
      const { token, user } = response.data
      return { token, user }
    } catch (error: any) {
      // Throw error for invalid credentials
      throw new Error(error.response?.data?.message || "Login failed. Please check your credentials.")
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, realLogin }}>{children}</AuthContext.Provider>
}