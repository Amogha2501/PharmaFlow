import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const Suppliers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    products: []
  });

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      // The response.data contains { suppliers: [], total, page, totalPages }
      setSuppliers(response.data.suppliers || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products?page=1&limit=100');
      // Handle paginated response
      setProducts(response.data.products || response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddSupplier = () => {
    setCurrentSupplier(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      products: []
    });
    setShowModal(true);
  };

  const handleEditSupplier = async (supplier) => {
    try {
      // Fetch detailed supplier data including assigned products
      const response = await api.get(`/suppliers/${supplier.id}`);
      const detailedSupplier = response.data;
      
      setCurrentSupplier(detailedSupplier);
      const productsArray = Array.isArray(detailedSupplier.products) ? detailedSupplier.products : [];
      setFormData({
        name: detailedSupplier.name,
        email: detailedSupplier.email,
        phone: detailedSupplier.phone,
        address: detailedSupplier.address,
        products: productsArray
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching detailed supplier data:', error);
      // Fallback to original supplier data if detailed fetch fails
      setCurrentSupplier(supplier);
      setFormData({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        products: Array.isArray(supplier.products) ? supplier.products : []
      });
      setShowModal(true);
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await api.delete(`/suppliers/${id}`);
        fetchSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('Failed to delete supplier: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProductSelection = (productId) => {
    const updatedProducts = formData.products.includes(productId)
      ? formData.products.filter(id => id !== productId)
      : [...formData.products, productId];
    
    setFormData({
      ...formData,
      products: updatedProducts
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure products is always an array
      const formDataToSend = {
        ...formData,
        products: Array.isArray(formData.products) ? formData.products : []
      };
      
      if (currentSupplier) {
        // Update existing supplier
        await api.put(`/suppliers/${currentSupplier.id}`, formDataToSend);
      } else {
        // Create new supplier
        await api.post('/suppliers', formDataToSend);
      }
      // Add a small delay to ensure the database is updated before fetching
      await new Promise(resolve => setTimeout(resolve, 100));
      await fetchSuppliers(); // Make sure this is awaited
      setShowModal(false);
    } catch (error) {
      console.error('Error saving supplier:', error);
      
      // Handle specific error cases
      let errorMessage = 'Failed to save supplier';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Check for duplicate email error
      if (errorMessage.includes('Duplicate entry') && errorMessage.includes('supplier.email')) {
        errorMessage = 'A supplier with this email already exists. Please use a different email address.';
      }
      
      alert(errorMessage);
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
                  <p className="text-emerald-700">Loading suppliers data...</p>
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
              <h1 className="text-3xl font-bold text-emerald-900 mb-2">Suppliers Management</h1>
              <p className="text-emerald-700">Manage your pharmacy suppliers and contact information</p>
            </div>
            
            {/* Add Supplier Button */}
            <div className="mb-6">
              <button
                onClick={handleAddSupplier}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Supplier
              </button>
            </div>
            
            {/* Suppliers Table */}
            <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
              <h2 className="text-xl font-bold text-emerald-900 mb-6">Supplier List</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-emerald-50 border-b border-emerald-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Supplier Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Address</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Products Count</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {suppliers.length > 0 ? (
                      suppliers.map((supplier) => (
                        <tr key={supplier.id} className="hover:bg-emerald-50 transition-all duration-200">
                          <td className="px-6 py-4 text-emerald-900 font-medium">{supplier.id}</td>
                          <td className="px-6 py-4 text-emerald-900 font-medium">{supplier.name}</td>
                          <td className="px-6 py-4 text-emerald-700 text-sm">{supplier.email}</td>
                          <td className="px-6 py-4 text-emerald-700 text-sm">{supplier.phone}</td>
                          <td className="px-6 py-4 text-emerald-700 text-sm">{supplier.address}</td>
                          <td className="px-6 py-4 text-emerald-700 text-sm font-bold">
                            {supplier.productCount || supplier.product_count || 0}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleEditSupplier(supplier)}
                                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteSupplier(supplier.id)}
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
                        <td colSpan="7" className="px-6 py-4 text-center text-emerald-700">
                          No suppliers found
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
      
      {/* Modal for Add/Edit Supplier */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-emerald-900">
                  {currentSupplier ? 'Edit Supplier' : 'Add New Supplier'}
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-emerald-500 hover:text-emerald-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-800 mb-1">Supplier Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-emerald-800 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-emerald-800 mb-1">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-emerald-800 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-emerald-800 mb-1">Assign Products</label>
                    <div className="border border-emerald-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                      {products.length > 0 ? (
                        products.map((product) => (
                          <div key={product.id} className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id={`product-${product.id}`}
                              checked={formData.products.includes(product.id)}
                              onChange={() => handleProductSelection(product.id)}
                              className="mr-2 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 rounded"
                            />
                            <label htmlFor={`product-${product.id}`} className="text-emerald-800">
                              {product.name}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-emerald-700">No products available</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    {currentSupplier ? 'Update Supplier' : 'Add Supplier'}
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

export default Suppliers;