import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import { supplierService } from '../../services/supplierService';

const Inventory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    supplierId: '',
    expiryDate: '',
    reorderLevel: '10'
  });

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      // Fetch all products with pagination
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
      
      // Check if it's an authentication error
      if (error.response?.status === 401 || 
          (error.response?.data?.message && 
           (error.response.data.message.includes('Invalid or expired token') ||
            error.response.data.message.includes('Invalid token') ||
            error.response.data.message.includes('expired')))) {
        // The api interceptor should handle the redirect
      } else {
        alert('Failed to fetch products: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await supplierService.getAll();
      // Handle nested suppliers array response
      setSuppliers(response.data.suppliers || response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      
      // Check if it's an authentication error
      if (error.response?.status === 401 || 
          (error.response?.data?.message && 
           (error.response.data.message.includes('Invalid or expired token') ||
            error.response.data.message.includes('Invalid token') ||
            error.response.data.message.includes('expired')))) {
        // The api interceptor should handle the redirect
      } else {
        alert('Failed to fetch suppliers: ' + (error.response?.data?.message || error.message));
      }
    }
  };

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

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      supplierId: '',
      expiryDate: '',
      reorderLevel: '10'
    });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price || '',
      quantity: product.quantity || '',
      supplierId: product.supplier_id || product.supplierId || '',
      expiryDate: product.expiry_date ? product.expiry_date.split('T')[0] : (product.expiryDate ? product.expiryDate.split('T')[0] : ''),
      reorderLevel: product.reorder_level !== undefined ? product.reorder_level : (product.reorderLevel || '10')
    });
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        
        // Check if it's an authentication error
        if (error.response?.status === 401 || 
            (error.response?.data?.message && 
             (error.response.data.message.includes('Invalid or expired token') ||
              error.response.data.message.includes('Invalid token') ||
              error.response.data.message.includes('expired')))) {
          alert('Your session has expired. Please log in again.');
          // The api interceptor should handle the redirect
        } else {
          alert('Failed to delete product: ' + (error.response?.data?.message || error.message));
        }
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    // For numeric fields, ensure we don't allow negative values
    if (['price', 'quantity', 'reorderLevel'].includes(name)) {
      if (value < 0) return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.quantity || !formData.reorderLevel || !formData.supplierId || !formData.expiryDate) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Validate numeric fields
      const price = parseFloat(formData.price);
      const quantity = parseInt(formData.quantity);
      const reorderLevel = parseInt(formData.reorderLevel);
      
      if (isNaN(price) || price < 0) {
        alert('Please enter a valid price');
        return;
      }
      
      if (isNaN(quantity) || quantity < 0) {
        alert('Please enter a valid quantity');
        return;
      }
      
      if (isNaN(reorderLevel) || reorderLevel < 0) {
        alert('Please enter a valid reorder level');
        return;
      }
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: price,
        quantity: quantity,
        reorderLevel: reorderLevel,
        supplierId: formData.supplierId && formData.supplierId !== '' ? parseInt(formData.supplierId) : null,
        expiryDate: formData.expiryDate ? formData.expiryDate.split('T')[0] : null
      };
      
      if (currentProduct) {
        // Update existing product
        const response = await api.put(`/products/${currentProduct.id}`, productData);
                console.log('Product update response:', response);
      } else {
        // Create new product
        await api.post('/products', productData);
      }
      fetchProducts();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
      
      // Check if it's an authentication error
      if (error.response?.status === 401 || 
          (error.response?.data?.message && 
           (error.response.data.message.includes('Invalid or expired token') ||
            error.response.data.message.includes('Invalid token') ||
            error.response.data.message.includes('expired')))) {
        alert('Your session has expired. Please log in again.');
        // The api interceptor should handle the redirect
      } else if (error.response?.status === 404) {
        alert('Product not found. The product may have been deleted or the ID is incorrect. Please try again.');
      } else if (error.response?.status === 400) {
        alert('Invalid data: ' + (error.response?.data?.message || error.message));
      } else {
        alert('Failed to save product: ' + (error.response?.data?.message || error.message || 'Unknown error'));
      }
    }
  };

  const isLowStock = (quantity) => {
    return quantity < 10;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-emerald-50">
        <SidebarAdmin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} role="admin" pageTitle="Inventory Management" />
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
      <SidebarAdmin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} role="admin" pageTitle="Inventory Management" />
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-emerald-900 mb-2">Inventory Management</h1>
              <p className="text-emerald-700">Manage your pharmacy products and stock levels</p>
            </div>
            
            {/* Search and Add Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
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
              <div className="flex gap-2">
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </button>
              </div>
            </div>
            
            {/* Products Table */}
            <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
              <h2 className="text-xl font-bold text-emerald-900 mb-6">Product Inventory</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-emerald-50 border-b border-emerald-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Product Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Description</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-emerald-800">Price</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-emerald-800">Quantity</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Supplier</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Expiry Date</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {currentProducts.length > 0 ? (
                      currentProducts.map((product) => (
                        <tr key={`admin-${product.id}`} className="hover:bg-emerald-50 transition-all duration-200">
                          <td className="px-6 py-4 text-emerald-900 font-medium">{product.id}</td>
                          <td className="px-6 py-4 text-emerald-900 font-medium">{product.name}</td>
                          <td className="px-6 py-4 text-emerald-700 text-sm">{product.description}</td>
                          <td className="px-6 py-4 text-right text-emerald-900 font-semibold">₹{parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className={`px-6 py-4 text-right font-semibold ${
                            isLowStock(product.quantity) 
                              ? 'text-red-600' 
                              : 'text-emerald-700'
                          }`}>
                            {product.quantity}
                          </td>
                          <td className="px-6 py-4 text-emerald-700">
                            {suppliers.find(s => s.id == product.supplier_id)?.name || product.supplier || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-emerald-700">{product.expiry_date || product.expiryDate || 'N/A'}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleEditProduct(product)}
                                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 text-center text-emerald-700">
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
      
      {/* Modal for Add/Edit Product */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-emerald-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-emerald-700/50">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {currentProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-emerald-200 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-100 mb-1">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-emerald-700/50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-emerald-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-emerald-100 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 bg-emerald-700/50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-emerald-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-emerald-100 mb-1">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleFormChange}
                      min="0"
                      className="w-full px-3 py-2 bg-emerald-700/50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-emerald-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-emerald-100 mb-1">Reorder Level</label>
                    <input
                      type="number"
                      name="reorderLevel"
                      value={formData.reorderLevel}
                      onChange={handleFormChange}
                      min="0"
                      className="w-full px-3 py-2 bg-emerald-700/50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-emerald-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-emerald-100 mb-1">Supplier</label>
                    <select
                      name="supplierId"
                      value={formData.supplierId}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-emerald-700/50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-emerald-200"
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-emerald-100 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-emerald-700/50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-emerald-100 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="3"
                      className="w-full px-3 py-2 bg-emerald-700/50 border border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-emerald-200"
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-emerald-500/20"
                  >
                    {currentProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;