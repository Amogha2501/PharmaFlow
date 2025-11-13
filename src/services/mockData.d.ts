declare module '../services/mockData' {
  interface DashboardSummary {
    totalSales: number;
    productsInStock: number;
    lowStockAlerts: number;
    suppliersCount: number;
    salesTrend: string;
    salesTrendValue: string;
  }

  interface Product {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: number;
    quantity: number;
    reorderLevel: number;
    description?: string;
    supplier: string;
    expiryDate: string;
  }

  interface Supplier {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    paymentTerms: string;
  }

  interface Sale {
    id: number;
    invoiceNumber: string;
    date: string;
    total: string;
    items: number;
    paymentMethod: string;
    status: string;
  }

  interface PaginatedProducts {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  }
  
  interface ExpiryAlert {
    product: string;
    expiryDate: string;
    daysToExpiry: number;
    status: string;
  }

  export const mockData: {
    getDashboardSummary: () => DashboardSummary;
    getProducts: (page?: number, limit?: number) => PaginatedProducts;
    getSuppliers: () => Supplier[];
    getSales: () => Sale[];
    getDailySalesData: () => any[];
    getInventoryData: () => any[];
    getClerkSalesData: () => any[];
    getCategoryData: () => any[];
    getLowStockAlerts: () => any[];
    getExpiryAlerts: () => ExpiryAlert[];
  };

  export default mockData;
}