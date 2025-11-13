declare module "../services/supplierService" {
  import type { AxiosResponse } from "axios"

  interface Supplier {
    id: number
    name: string
    email: string
    phone: string
    address: string
    city: string
    country: string
    paymentTerms: string
  }

  interface SupplierResponse {
    suppliers: Supplier[]
    total: number
    page: number
    limit: number
  }

  export const supplierService: {
    getAll: (page?: number, limit?: number) => Promise<AxiosResponse<SupplierResponse>>
    getById: (id: number) => Promise<AxiosResponse<Supplier>>
    create: (data: Omit<Supplier, 'id'>) => Promise<AxiosResponse<Supplier>>
    update: (id: number, data: Partial<Supplier>) => Promise<AxiosResponse<Supplier>>
    delete: (id: number) => Promise<AxiosResponse<void>>
  }
}