import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';
import Navbar from '../../components/Navbar';
import { Calendar, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { mockData } from '../../services/mockData';

const ExpiryReports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, expired, near-expiry, active
  const [sortBy, setSortBy] = useState('expiryDate'); // expiryDate, name, daysToExpiry

  useEffect(() => {
    fetchExpiryData();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, filter, sortBy]);

  const fetchExpiryData = async () => {
    try {
      // In a real app, this would come from an API
      // For now, we'll generate mock data with expiry dates
      const productData = mockData.getProducts(1, 50).products;
      
      // Add daysToExpiry calculation
      const productsWithExpiry = productData.map(product => {
        const expiryDate = new Date(product.expiryDate);
        const today = new Date();
        const timeDiff = expiryDate.getTime() - today.getTime();
        const daysToExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        let status = 'active';
        if (daysToExpiry < 0) {
          status = 'expired';
        } else if (daysToExpiry <= 30) {
          status = 'near-expiry';
        }
        
        return {
          ...product,
          daysToExpiry,
          status
        };
      });
      
      setProducts(productsWithExpiry);
      setFilteredProducts(productsWithExpiry);
    } catch (error) {
      console.error('Error fetching expiry data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];
    
    // Apply filter
    if (filter === 'expired') {
      filtered = filtered.filter(product => product.status === 'expired');
    } else if (filter === 'near-expiry') {
      filtered = filtered.filter(product => product.status === 'near-expiry');
    } else if (filter === 'active') {
      filtered = filtered.filter(product => product.status === 'active');
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'daysToExpiry') {
        return a.daysToExpiry - b.daysToExpiry;
      } else {
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      }
    });
    
    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'near-expiry': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'expired': return <XCircle className="w-4 h-4" />;
      case 'near-expiry': return <AlertTriangle className="w-4 h-4" />;
      case 'active': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const summaryData = {
    totalProducts: products.length,
    expired: products.filter(p => p.status === 'expired').length,
    nearExpiry: products.filter(p => p.status === 'near-expiry').length,
    active: products.filter(p => p.status === 'active').length
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
                  <p className="text-emerald-700">Loading expiry reports...</p>
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
              <h1 className="text-3xl font-bold text-emerald-900 mb-2">Product Expiry Reports</h1>
              <p className="text-emerald-700">Track product expiration dates and manage inventory accordingly</p>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-emerald-700 text-sm font-medium">Total Products</p>
                    <p className="text-2xl font-bold text-emerald-900">{summaryData.totalProducts}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg mr-4">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-emerald-700 text-sm font-medium">Expired Products</p>
                    <p className="text-2xl font-bold text-red-600">{summaryData.expired}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg mr-4">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-emerald-700 text-sm font-medium">Near Expiry (&lt;30 days)</p>
                    <p className="text-2xl font-bold text-orange-600">{summaryData.nearExpiry}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-emerald-700 text-sm font-medium">Active Products</p>
                    <p className="text-2xl font-bold text-green-600">{summaryData.active}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Filters and Sorting */}
            <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleFilterChange('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'all'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}
                  >
                    All Products
                  </button>
                  <button
                    onClick={() => handleFilterChange('expired')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                      filter === 'expired'
                        ? 'bg-red-500 text-white'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Expired
                  </button>
                  <button
                    onClick={() => handleFilterChange('near-expiry')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                      filter === 'near-expiry'
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Near Expiry
                  </button>
                  <button
                    onClick={() => handleFilterChange('active')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                      filter === 'active'
                        ? 'bg-green-500 text-white'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Active
                  </button>
                </div>
                
                <div className="flex items-center">
                  <span className="text-emerald-700 text-sm mr-2">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-900"
                  >
                    <option value="expiryDate">Expiry Date</option>
                    <option value="name">Product Name</option>
                    <option value="daysToExpiry">Days to Expiry</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Products Table */}
            <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
              <h2 className="text-xl font-bold text-emerald-900 mb-6">Product Expiry Status</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-emerald-50 border-b border-emerald-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Product Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">SKU</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Supplier</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Expiry Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Days to Expiry</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-emerald-50 transition-all duration-200">
                          <td className="px-6 py-4 text-emerald-900 font-medium">{product.name}</td>
                          <td className="px-6 py-4 text-emerald-700">{product.sku}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-emerald-700">{product.supplier}</td>
                          <td className="px-6 py-4 text-emerald-700 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {product.expiryDate}
                          </td>
                          <td className={`px-6 py-4 font-semibold ${
                            product.daysToExpiry < 0 
                              ? 'text-red-600' 
                              : product.daysToExpiry < 30 
                                ? 'text-orange-600' 
                                : 'text-emerald-700'
                          }`}>
                            {product.daysToExpiry < 0 ? 'Expired' : `${product.daysToExpiry} days`}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                              {getStatusIcon(product.status)}
                              <span className="ml-1">
                                {product.status === 'near-expiry' ? 'Near Expiry' : 
                                 product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                              </span>
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-emerald-700">
                          No products found matching the current filter
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
    </div>
  );
};

export default ExpiryReports;