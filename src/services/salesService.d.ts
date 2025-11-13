declare module "../services/salesService" {
  import type { AxiosResponse } from "axios"

  interface SalesItem {
    id: number
    productId: number
    productName: string
    price: number
    quantity: number
    total: number
  }

  interface Sale {
    id: number
    invoiceNumber: string
    date: string
    total: number
    items: number
    paymentMethod: string
    status: string
    salesItems: SalesItem[]
  }

  interface SalesResponse {
    sales: Sale[]
    total: number
    page: number
    limit: number
  }

  export const salesService: {
    getAll: (page?: number, limit?: number) => Promise<AxiosResponse<SalesResponse>>
    getById: (id: number) => Promise<AxiosResponse<Sale>>
    create: (data: Omit<Sale, 'id'>) => Promise<AxiosResponse<Sale>>
  }
}