import axios from "axios"

// Use environment variable for API base URL with fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || 
        (error.response?.data?.message && 
         (error.response.data.message.includes('Invalid or expired token') ||
          error.response.data.message.includes('Invalid token') ||
          error.response.data.message.includes('expired')))) {
      // Handle unauthorized access or token expiration
      console.log('Token expired or invalid, redirecting to login...')
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api