declare module "../services/reportService" {
  import type { AxiosResponse } from "axios"

  interface ReportSummary {
    totalSales: number
    productsInStock: number
    lowStockAlerts: number
    suppliersCount: number
    salesTrend: string
    salesTrendValue: string
  }

  interface DailySales {
    date: string
    sales: number
    revenue: number
  }

  interface InventoryAlert {
    name: string
    value: number
    reorder: number
  }

  interface ClerkSales {
    name: string
    sales: number
    revenue: number
  }

  export const reportService: {
    getSummary: () => Promise<AxiosResponse<ReportSummary>>
    getDailySales: (date: string) => Promise<AxiosResponse<DailySales[]>>
    getInventoryAlerts: () => Promise<AxiosResponse<InventoryAlert[]>>
    getSalesByClerk: () => Promise<AxiosResponse<ClerkSales[]>>
  }
}