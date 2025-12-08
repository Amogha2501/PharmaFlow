import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';
import Navbar from '../../components/Navbar';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Printer, AlertTriangle, Calendar } from 'lucide-react';
import api from '../../services/api';
import { mockData } from '../../services/mockData';

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [lowStockData, setLowStockData] = useState([]);
  const [expiryData, setExpiryData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportsData();
    
    // Set up interval to refresh data every 30 seconds
    const intervalId = setInterval(fetchReportsData, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchReportsData = async () => {
    try {
      // Fetch sales data - using daily-sales endpoint with current date
      const today = new Date().toISOString().split('T')[0];
      const salesResponse = await api.get(`/reports/daily-sales?date=${today}`);
      // Ensure we have an array
      const salesDataArray = Array.isArray(salesResponse.data) ? salesResponse.data : [salesResponse.data];
      console.log('Sales data:', salesDataArray);
      setSalesData(salesDataArray);
      
      // Fetch product-wise revenue data for inventory chart
      const inventoryResponse = await api.get('/reports/product-wise-revenue');
      console.log('Raw inventory response:', inventoryResponse);
      // Ensure we have an array and limit to top 5
      let inventoryDataArray = [];
      if (Array.isArray(inventoryResponse.data)) {
        inventoryDataArray = inventoryResponse.data.slice(0, 5).map(item => ({
          ...item,
          sold: item.total_sold !== undefined ? item.total_sold : (item.sold || 0)
        }));
      } else if (inventoryResponse.data) {
        inventoryDataArray = [inventoryResponse.data];
      }
      console.log('Processed inventory data:', inventoryDataArray);
      setInventoryData(inventoryDataArray);
      
      // Fetch low stock data
      const lowStockResponse = await api.get('/reports/inventory-alerts');
      // Ensure we have an array
      const lowStockDataArray = Array.isArray(lowStockResponse.data) ? lowStockResponse.data : 
                              (lowStockResponse.data ? [lowStockResponse.data] : []);
      console.log('Low stock data:', lowStockDataArray);
      setLowStockData(lowStockDataArray);
      
      // Fetch expiry data from real API
      const expiryResponse = await api.get('/reports/expiry-alerts');
      // Handle the response format (object with products property)
      const allExpiryData = expiryResponse.data.products || 
                            (Array.isArray(expiryResponse.data) ? expiryResponse.data : 
                            (expiryResponse.data ? [expiryResponse.data] : []));
      
      // Filter to show only expired and near-expiry products for alerts
      const expiryAlertsData = Array.isArray(allExpiryData) 
        ? allExpiryData.filter(product => 
            product.status === 'expired' || product.status === 'near-expiry'
          )
        : [];
      
      console.log('Expiry alerts data:', expiryAlertsData);
      setExpiryData(expiryAlertsData);
      
      // Fetch suppliers for low stock table
      const suppliersResponse = await api.get('/suppliers?page=1&limit=100');
      const suppliersData = Array.isArray(suppliersResponse.data.suppliers) ? 
        suppliersResponse.data.suppliers : 
        (Array.isArray(suppliersResponse.data) ? suppliersResponse.data : []);
      console.log('Suppliers data:', suppliersData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Error fetching reports data:', error);
      // Use mock data as fallback
      const mockSalesData = mockData.getDailySalesData();
      const mockInventoryData = mockData.getInventoryData();
      const mockLowStockData = mockData.getLowStockAlerts();
      const mockExpiryData = mockData.getExpiryAlerts();
      
      console.log('Using mock data - Sales:', mockSalesData);
      console.log('Using mock data - Inventory:', mockInventoryData);
      console.log('Using mock data - Low stock:', mockLowStockData);
      console.log('Using mock data - Expiry:', mockExpiryData);
      
      setSalesData(mockSalesData);
      setInventoryData(mockInventoryData);
      setLowStockData(mockLowStockData);
      setExpiryData(mockExpiryData);
      
      // Set empty array for suppliers if not available
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    alert('CSV download functionality would be implemented here');
  };

  const printReport = () => {
    window.print();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'expired': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'ok': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-emerald-50">
        <SidebarAdmin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} role="admin" />
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-6 lg:p-8">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                  <p className="text-emerald-700">Loading reports data...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-emerald-50">
      <SidebarAdmin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} role="admin" />
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-emerald-900 mb-2">Reports & Analytics</h1>
              <p className="text-emerald-700">View detailed analytics and performance metrics</p>
            </div>
            
            {/* Export Options */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={downloadCSV}
                className="flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Download as CSV
              </button>
              <button
                onClick={printReport}
                className="flex items-center px-4 py-2 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-lg font-medium transition-colors"
              >
                <Printer className="w-5 h-5 mr-2" />
                Print Report
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Sales Trend Chart */}
              <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
                <h2 className="text-xl font-bold text-emerald-900 mb-6">Sales Trend</h2>
                <div className="h-80 w-full min-h-[300px] min-w-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Sales']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#10b981" 
                        activeDot={{ r: 8 }} 
                        name="Sales (₹)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Top Products Chart */}
              <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
                <h2 className="text-xl font-bold text-emerald-900 mb-6">Top 5 Sold Products</h2>
                <div className="h-80 w-full min-h-[300px] min-w-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={inventoryData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [value, 'Units Sold']}
                      />
                      <Legend />
                      <Bar 
                        dataKey="sold" 
                        fill="#10b981" 
                        name="Units Sold"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Low Stock Summary */}
              <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
                <h2 className="text-xl font-bold text-emerald-900 mb-6">Low Stock Summary</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-emerald-50 border-b border-emerald-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-800">Product Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-800">Current Stock</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-800">Reorder Level</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-800">Supplier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100">
                      {lowStockData.length > 0 ? (
                        lowStockData.map((item, index) => (
                          <tr key={index} className="hover:bg-emerald-50 transition-colors">
                            <td className="px-6 py-4 text-emerald-900 font-medium">{item.name}</td>
                            <td className="px-6 py-4 text-red-600 font-semibold">{item.quantity}</td>
                            <td className="px-6 py-4 text-emerald-700">{item.reorder_level}</td>
                            <td className="px-6 py-4 text-emerald-700">{item.supplier_name || 'N/A'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-emerald-700">
                            No low stock items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Expiry Alerts */}
              <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
                <h2 className="text-xl font-bold text-emerald-900 mb-6 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                  Product Expiry Alerts
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-emerald-50 border-b border-emerald-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-800">Product Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-800">Expiry Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-800">Days to Expiry</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-800">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100">
                      {expiryData.length > 0 ? (
                        expiryData.map((item, index) => (
                          <tr key={index} className="hover:bg-emerald-50 transition-colors">
                            <td className="px-6 py-4 text-emerald-900 font-medium">{item.name}</td>
                            <td className="px-6 py-4 text-emerald-700 flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className={`px-6 py-4 font-semibold ${
                              item.expiry_date ? 
                                (new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24) < 0 
                                  ? 'text-red-600' 
                                  : (new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24) < 30 
                                    ? 'text-orange-600' 
                                    : 'text-emerald-700'
                                : 'text-emerald-700'
                            }`}>
                              {item.expiry_date ? 
                                Math.ceil((new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)) < 0 ? 
                                  'Expired' : 
                                  `${Math.ceil((new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24))} days`
                                : 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status || 'ok')}`}>
                                {(item.status || 'ok').charAt(0).toUpperCase() + (item.status || 'ok').slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-emerald-700">
                            No expiry alerts found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;