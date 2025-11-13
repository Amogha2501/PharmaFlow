declare module "../services/productService" {
  import type { AxiosResponse } from "axios"

  interface Product {
    id: number
    name: string
    sku: string
    category: string
    price: number
    quantity: number
    reorderLevel: number
    description?: string
  }

  interface ProductResponse {
    products: Product[]
    total: number
    page: number
    limit: number
  }

  export const productService: {
    getAll: (page?: number, limit?: number) => Promise<AxiosResponse<ProductResponse>>
    getById: (id: number) => Promise<AxiosResponse<Product>>
    create: (data: Omit<Product, 'id'>) => Promise<AxiosResponse<Product>>
    update: (id: number, data: Partial<Product>) => Promise<AxiosResponse<Product>>
    delete: (id: number) => Promise<AxiosResponse<void>>
    search: (query: string) => Promise<AxiosResponse<ProductResponse>>
  }
}