import api from "./api"

export const supplierService = {
  getAll: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/suppliers?page=${page}&limit=${limit}`)
      return response
    } catch (error) {
      console.error("Error fetching suppliers:", error)
      throw error
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/suppliers/${id}`)
      return response
    } catch (error) {
      console.error(`Error fetching supplier with id ${id}:`, error)
      throw error
    }
  },
  
  create: async (data) => {
    try {
      const response = await api.post("/suppliers", data)
      return response
    } catch (error) {
      console.error("Error creating supplier:", error)
      throw error
    }
  },
  
  update: async (id, data) => {
    try {
      const response = await api.put(`/suppliers/${id}`, data)
      return response
    } catch (error) {
      console.error(`Error updating supplier with id ${id}:`, error)
      throw error
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/suppliers/${id}`)
      return response
    } catch (error) {
      console.error(`Error deleting supplier with id ${id}:`, error)
      throw error
    }
  },
}