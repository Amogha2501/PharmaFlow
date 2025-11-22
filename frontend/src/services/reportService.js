import api from "./api"

export const reportService = {
  getSummary: () => api.get("/reports/summary"),
  getDailySales: (date) => api.get(`/reports/daily-sales?date=${date}`),
  getInventoryAlerts: () => api.get("/reports/inventory-alerts"),
  getSalesByClerk: () => api.get("/reports/sales-by-clerk"),
}
