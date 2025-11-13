import api from "./api"

export const productService = {
  getAll: (page = 1, limit = 10) => api.get(`/products?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  search: (query) => api.get(`/products/search?q=${query}`),
}