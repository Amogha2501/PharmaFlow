// Mock data service for offline use
export const mockData = {
  // Dashboard data
  getDashboardSummary: () => {
    return {
      totalSales: 15420.5,
      productsInStock: 342,
      lowStockAlerts: 12,
      suppliersCount: 8,
      salesTrend: "up",
      salesTrendValue: "+12.5%",
    };
  },

  // Inventory data
  getProducts: (page = 1, limit = 10) => {
    const products = Array.from({ length: 50 }, (_, i) => {
      // Generate random expiry date within 2 years
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + Math.floor(Math.random() * 24));
      const formattedExpiryDate = expiryDate.toISOString().split('T')[0];
      
      return {
        id: i + 1,
        name: `Product ${i + 1}`,
        sku: `SKU-${String(i + 1).padStart(4, "0")}`,
        category: ["Tablets", "Capsules", "Syrup", "Injections", "Creams"][i % 5],
        price: parseFloat((Math.random() * 50 + 5).toFixed(2)),
        quantity: Math.floor(Math.random() * 500 + 10),
        reorderLevel: Math.floor(Math.random() * 50 + 10),
        description: `Description for Product ${i + 1}`,
        supplier: `Supplier ${Math.floor(i / 5) + 1}`,
        expiryDate: formattedExpiryDate
      };
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total: products.length,
      page,
      totalPages: Math.ceil(products.length / limit)
    };
  },

  // Suppliers data
  getSuppliers: () => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `Supplier ${i + 1}`,
      email: `supplier${i + 1}@example.com`,
      phone: `+1 (555) ${String(i).padStart(3, "0")}-0000`,
      address: `${100 + i} Main Street`,
      city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego"][i % 8],
      country: "USA",
      paymentTerms: `Net ${30 + i * 5}`,
    }));
  },

  // Sales data
  getSales: () => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      invoiceNumber: `INV-${String(1000 + i).padStart(5, "0")}`,
      date: new Date(Date.now() - i * 86400000).toISOString(),
      total: (Math.random() * 500 + 50).toFixed(2),
      items: Math.floor(Math.random() * 5 + 1),
      paymentMethod: ["cash", "card", "check"][i % 3],
      status: i % 3 === 0 ? "pending" : "completed",
    }));
  },

  // Reports data
  getDailySalesData: () => {
    return [
      { date: "Mon", sales: 2400, revenue: 2400 },
      { date: "Tue", sales: 1398, revenue: 2210 },
      { date: "Wed", sales: 9800, revenue: 2290 },
      { date: "Thu", sales: 3908, revenue: 2000 },
      { date: "Fri", sales: 4800, revenue: 2181 },
      { date: "Sat", sales: 3800, revenue: 2500 },
      { date: "Sun", sales: 4300, revenue: 2100 },
    ];
  },

  getInventoryData: () => {
    return [
      { name: "Aspirin 500mg", value: 450, reorder: 100 },
      { name: "Vitamin C", value: 320, reorder: 80 },
      { name: "Paracetamol", value: 280, reorder: 60 },
      { name: "Ibuprofen", value: 210, reorder: 50 },
      { name: "Cough Syrup", value: 150, reorder: 40 },
    ];
  },

  getClerkSalesData: () => {
    return [
      { name: "John Smith", sales: 45, revenue: 2400 },
      { name: "Sarah Johnson", sales: 52, revenue: 2210 },
      { name: "Mike Davis", sales: 38, revenue: 2290 },
      { name: "Emily Brown", sales: 61, revenue: 2000 },
    ];
  },

  getCategoryData: () => {
    return [
      { name: "Tablets", value: 35, fill: "#10b981" },
      { name: "Capsules", value: 25, fill: "#3b82f6" },
      { name: "Syrups", value: 20, fill: "#f59e0b" },
      { name: "Injections", value: 15, fill: "#8b5cf6" },
      { name: "Others", value: 5, fill: "#6b7280" },
    ];
  },

  getLowStockAlerts: () => {
    return [
      { product: "Aspirin 500mg", current: 15, reorder: 100, status: "critical" },
      { product: "Vitamin D", current: 25, reorder: 80, status: "warning" },
      { product: "Zinc Tablets", current: 35, reorder: 60, status: "warning" },
      { product: "Multivitamin", current: 45, reorder: 50, status: "ok" },
    ];
  },
  
  // Expiry alerts data
  getExpiryAlerts: () => {
    return [
      { product: "Aspirin 500mg", expiryDate: "2025-06-15", daysToExpiry: 30, status: "warning" },
      { product: "Vitamin D", expiryDate: "2025-05-10", daysToExpiry: 10, status: "critical" },
      { product: "Antibiotic X", expiryDate: "2025-04-25", daysToExpiry: -5, status: "expired" },
      { product: "Pain Relief", expiryDate: "2025-07-20", daysToExpiry: 60, status: "ok" },
    ];
  }
};

export default mockData;