import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const SalesOverview = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    clerk: ''
  });
  const [clerks, setClerks] = useState([]);

  useEffect(() => {
    fetchSales();
    
    // Set up interval to refresh data every 30 seconds
    const intervalId = setInterval(fetchSales, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sales, filters]);

  const fetchSales = async () => {
    try {
      // Fetch sales data from real API
      const salesResponse = await api.get('/sales?page=1&limit=100');
      const salesData = salesResponse.data.sales || salesResponse.data;
      setSales(salesData);
      
      // Extract unique clerks for filter dropdown
      const uniqueClerks = [...new Set(salesData.map(sale => sale.clerk_name || sale.clerkName))];
      setClerks(uniqueClerks);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...sales];
    
    // Apply date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(sale => new Date(sale.date || sale.created_at) >= new Date(filters.dateFrom));
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(sale => new Date(sale.date || sale.created_at) <= new Date(filters.dateTo));
    }
    
    // Apply clerk filter
    if (filters.clerk) {
      filtered = filtered.filter(sale => (sale.clerk_name || sale.clerkName) === filters.clerk);
    }
    
    setFilteredSales(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleViewInvoice = async (saleId) => {
    try {
      const response = await api.get(`/sales/${saleId}`);
      setSelectedInvoice(response.data);
      setShowInvoiceModal(true);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      alert('Failed to load invoice details');
    }
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      clerk: ''
    });
  };

  // Calculate summary statistics
  const totalSales = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount || sale.total_amount), 0);
  const totalTransactions = filteredSales.length;
  const averageSale = totalTransactions > 0 ? totalSales / totalTransactions : 0;

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
                  <p className="text-emerald-700">Loading sales data...</p>
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
              <h1 className="text-3xl font-bold text-emerald-900 mb-2">Sales Overview</h1>
              <p className="text-emerald-700">Monitor and analyze sales performance</p>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
                <p className="text-emerald-700 text-sm font-medium mb-2">Total Sales</p>
                <p className="text-3xl font-bold text-emerald-700">₹{totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-emerald-600 text-xs mt-2">Across {totalTransactions} transactions</p>
              </div>
              
              <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
                <p className="text-emerald-700 text-sm font-medium mb-2">Total Transactions</p>
                <p className="text-3xl font-bold text-blue-600">{totalTransactions}</p>
                <p className="text-emerald-600 text-xs mt-2">In selected period</p>
              </div>
              
              <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
                <p className="text-emerald-700 text-sm font-medium mb-2">Average Sale</p>
                <p className="text-3xl font-bold text-purple-600">₹{averageSale.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-emerald-600 text-xs mt-2">Per transaction</p>
              </div>
            </div>
            
            {/* Filters */}
            <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg mb-8">
              <h2 className="text-xl font-bold text-emerald-900 mb-4">Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-800 mb-1">From Date</label>
                  <input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-emerald-800 mb-1">To Date</label>
                  <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-emerald-800 mb-1">Clerk</label>
                  <select
                    name="clerk"
                    value={filters.clerk}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">All Clerks</option>
                    {clerks.map((clerk, index) => (
                      <option key={index} value={clerk}>{clerk}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
            
            {/* Sales Table */}
            <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
              <h2 className="text-xl font-bold text-emerald-900 mb-6">Recent Sales</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-emerald-50 border-b border-emerald-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Sale ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Clerk Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Payment Method</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-emerald-800">Total Amount</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {filteredSales.length > 0 ? (
                      filteredSales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-emerald-50 transition-all duration-200">
                          <td className="px-6 py-4 text-emerald-900 font-medium">#{sale.id}</td>
                          <td className="px-6 py-4 text-emerald-700 text-sm">{new Date(sale.date || sale.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-emerald-700 text-sm">{sale.clerk_name || sale.clerkName}</td>
                          <td className="px-6 py-4 text-emerald-700 text-sm">{sale.payment_method || sale.paymentMethod}</td>
                          <td className="px-6 py-4 text-right text-emerald-900 font-semibold">₹{parseFloat(sale.total_amount || sale.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleViewInvoice(sale.id)}
                              className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-sm font-medium transition-colors"
                            >
                              View Invoice
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-emerald-700">
                          No sales found matching the selected filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Invoice Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-emerald-900">Invoice #{selectedInvoice.id}</h3>
                <button 
                  onClick={() => setShowInvoiceModal(false)}
                  className="text-emerald-500 hover:text-emerald-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="border border-emerald-200 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-emerald-700">Date</p>
                    <p className="font-medium">{new Date(selectedInvoice.date || selectedInvoice.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-700">Clerk</p>
                    <p className="font-medium">{selectedInvoice.clerk_name || selectedInvoice.clerkName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-700">Payment Method</p>
                    <p className="font-medium">{selectedInvoice.payment_method || selectedInvoice.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-700">Status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {selectedInvoice.status}
                    </span>
                  </div>
                </div>
                
                <div className="border border-emerald-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-emerald-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-emerald-800">Product</th>
                        <th className="px-4 py-2 text-right text-sm font-semibold text-emerald-800">Quantity</th>
                        <th className="px-4 py-2 text-right text-sm font-semibold text-emerald-800">Price</th>
                        <th className="px-4 py-2 text-right text-sm font-semibold text-emerald-800">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100">
                      {selectedInvoice.items && selectedInvoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-emerald-900">{item.name}</td>
                          <td className="px-4 py-2 text-right text-emerald-700">{item.quantity}</td>
                          <td className="px-4 py-2 text-right text-emerald-700">₹{parseFloat(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="px-4 py-2 text-right text-emerald-900 font-medium">₹{(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between py-1">
                      <span className="text-emerald-700">Subtotal:</span>
                      <span className="font-medium">₹{parseFloat(selectedInvoice.subtotal || selectedInvoice.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-emerald-700">Tax:</span>
                      <span className="font-medium">₹{parseFloat(selectedInvoice.tax || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-1 border-t border-emerald-200 mt-2 pt-2">
                      <span className="text-emerald-900 font-bold">Total:</span>
                      <span className="text-emerald-900 font-bold">₹{parseFloat(selectedInvoice.total_amount || selectedInvoice.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                >
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOverview;