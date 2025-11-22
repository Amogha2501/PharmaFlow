import api from "./api"

export const salesService = {
  getAll: (page = 1, limit = 10) => api.get(`/sales?page=${page}&limit=${limit}`),
  create: (data) => api.post("/sales", data),
  getById: (id) => api.get(`/sales/${id}`),
}
