import React, { useState, useEffect } from 'react';
import SidebarClerk from '../../components/SidebarClerk';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const InventoryView = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  const fetchProducts = async () => {
    try {
      // Use the same endpoint as admin but with clerk permissions
      const response = await api.get('/products?page=1&limit=100');
      // Handle nested products array response
      const productsData = response.data.products || response.data;
      
      // Remove duplicates from fetched products
      const uniqueProducts = productsData.filter((product, index, self) => 
        index === self.findIndex(p => p.id === product.id)
      );
      
      setProducts(uniqueProducts);
      setFilteredProducts(uniqueProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const filterProducts = () => {
    if (!searchTerm) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toString().includes(searchTerm)
      );
      
      // Remove duplicates from filtered results
      const uniqueFiltered = filtered.filter((product, index, self) => 
        index === self.findIndex(p => p.id === product.id)
      );
      
      setFilteredProducts(uniqueFiltered);
    }
    setCurrentPage(1);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStockStatus = (quantity) => {
    if (quantity < 10) return { status: 'Low Stock', color: 'red' };
    if (quantity < 30) return { status: 'Medium Stock', color: 'yellow' };
    return { status: 'Healthy Stock', color: 'green' };
  };

  const getStockColorClass = (color) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-700 border border-red-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'green': return 'bg-green-100 text-green-700 border border-green-200';
      default: return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-emerald-50">
        <SidebarClerk isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} role="clerk" />
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-6 lg:p-8">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                  <p className="text-emerald-700">Loading inventory data...</p>
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
      <SidebarClerk isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} role="clerk" />
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-emerald-900 mb-2">Inventory View</h1>
              <p className="text-emerald-700">View product inventory and stock levels</p>
            </div>
            
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="Search products"
                  className="w-full px-4 py-2 pr-10 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900 placeholder-emerald-900"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <svg className="absolute right-3 top-2.5 h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Products Table */}
            <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
              <h2 className="text-xl font-bold text-emerald-900 mb-6">Product Inventory</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-emerald-50 border-b border-emerald-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Product Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Category</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-emerald-800">Price</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-emerald-800">Quantity</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Supplier</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Expiry Date</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-800">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {currentProducts.length > 0 ? (
                      currentProducts.map((product) => {
                        const stockInfo = getStockStatus(product.quantity);
                        return (
                          <tr key={`clerk-${product.id}`} className="hover:bg-emerald-50 transition-all duration-200">
                            <td className="px-6 py-4 text-emerald-900 font-medium">{product.name}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right text-emerald-900 font-semibold">₹{parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="px-6 py-4 text-right text-emerald-700">{product.quantity}</td>
                            <td className="px-6 py-4 text-emerald-700">
                              {product.supplier_name || product.supplier || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-emerald-700">{product.expiry_date ? product.expiry_date.split('T')[0] : (product.expiryDate ? product.expiryDate.split('T')[0] : 'N/A')}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockColorClass(stockInfo.color)}`}>
                                {stockInfo.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-emerald-700">
                          No products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-emerald-700">
                    Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                  </div>
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === page
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-emerald-700/50 text-emerald-100 hover:bg-emerald-600 border border-emerald-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InventoryView;