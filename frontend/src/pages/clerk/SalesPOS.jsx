import React, { useState, useEffect } from 'react';
import SidebarClerk from '../../components/SidebarClerk';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const SalesPOS = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      // Fetch all products for POS - using a wildcard search or fetch all endpoint
      const response = await api.get('/products?page=1&limit=100');
      // Extract products array from paginated response
      let productsData = response.data.products || response.data;
      
      // Ensure products have the correct structure for the POS
      productsData = productsData.map(product => ({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price), // Convert string price to float
        category: 'General', // Default category since it's not in the database
        description: product.description || '',
        quantity: product.quantity || 0
      }));
      
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock data
      const mockProducts = [
        { id: 1, name: 'Aspirin 500mg', price: 5.99, category: 'Pain Relief' },
        { id: 2, name: 'Vitamin C 1000mg', price: 8.99, category: 'Vitamins' },
        { id: 3, name: 'Paracetamol 250mg', price: 3.99, category: 'Pain Relief' },
        { id: 4, name: 'Multivitamin', price: 12.99, category: 'Vitamins' },
        { id: 5, name: 'Cough Syrup', price: 7.99, category: 'Cold & Flu' },
      ];
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } finally {
      setLoading(false);
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
      setFilteredProducts(filtered);
    }
  };

  const addToCart = (product) => {
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    setCart(newCart);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const processSale = async () => {
    if (cart.length === 0) {
      alert('Please add items to the cart before processing payment');
      return;
    }

    try {
      const saleData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod,
        totalAmount: calculateTotal()
      };

      const response = await api.post('/sales', saleData);
      
      // Show invoice modal
      setInvoiceData({
        ...response.data,
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal()
      });
      
      setShowInvoiceModal(true);
      
      // Clear cart
      setCart([]);
      
      // Refresh product data to reflect updated stock levels
      await fetchProducts();
      
      // Dispatch a custom event to notify dashboards of the new sale
      window.dispatchEvent(new CustomEvent('saleCreated', {
        detail: { sale: response.data }
      }));
    } catch (error) {
      console.error('Error processing sale:', error);
      alert('Failed to process sale. Please try again.');
    }
  };

  const newTransaction = () => {
    setCart([]);
    setSearchTerm('');
    setPaymentMethod('Cash');
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
                  <p className="text-emerald-700">Loading products...</p>
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
              <h1 className="text-3xl font-bold text-emerald-900 mb-2">Point of Sale</h1>
              <p className="text-emerald-700">Process sales transactions</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product List */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-emerald-900 mb-4">Products</h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products by name or ID..."
                      className="w-full px-4 py-2 pl-10 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-900 placeholder-emerald-900"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div key={product.id} className="border border-emerald-200 rounded-lg p-4 hover:border-emerald-400 transition-colors">
                        <h3 className="font-medium text-emerald-900">{product.name}</h3>
                        <p className="text-sm text-emerald-700">Stock: {product.quantity}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-semibold text-emerald-700">₹{product.price.toFixed(2)}</span>
                          <button 
                            onClick={() => addToCart(product)}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-emerald-700">
                      No products found
                    </div>
                  )}
                </div>
              </div>
              
              {/* Cart */}
              <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg">
                <h2 className="text-xl font-bold text-emerald-900 mb-6">Shopping Cart</h2>
                
                {cart.length === 0 ? (
                  <p className="text-emerald-700 text-center py-8">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                      {cart.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-emerald-900 font-medium text-sm">{item.name}</p>
                            <p className="text-emerald-700 text-xs">₹{item.price.toFixed(2)} each</p>
                            <div className="flex items-center mt-1">
                              <button 
                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center bg-emerald-200 text-emerald-800 rounded-l"
                              >
                                -
                              </button>
                              <span className="w-8 h-6 flex items-center justify-center bg-emerald-100 text-emerald-800 text-xs">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center bg-emerald-200 text-emerald-800 rounded-r"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="text-right ml-2">
                            <p className="text-emerald-900 font-semibold text-sm">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                            <button 
                              onClick={() => removeFromCart(index)}
                              className="text-red-500 hover:text-red-700 text-xs mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-emerald-200 pt-4">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-emerald-800">Subtotal:</span>
                          <span className="text-emerald-900 font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-800">Tax (8%):</span>
                          <span className="text-emerald-900 font-medium">₹{calculateTax().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-emerald-200">
                          <span className="text-emerald-800 font-medium">Total:</span>
                          <span className="text-emerald-900 font-bold text-lg">₹{calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <select 
                          className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-emerald-900 focus:outline-none focus:border-emerald-500"
                          value={paymentMethod}
                          onChange={handlePaymentMethodChange}
                        >
                          <option value="Cash" className="placeholder-emerald-900">Cash</option>
                          <option value="Credit Card" className="placeholder-emerald-900">Credit Card</option>
                          <option value="Debit Card" className="placeholder-emerald-900">Debit Card</option>
                        </select>
                        
                        <button 
                          onClick={processSale}
                          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                        >
                          Process Payment
                        </button>
                        
                        <button 
                          onClick={newTransaction}
                          className="w-full py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-medium transition-colors"
                        >
                          New Transaction
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Invoice Modal */}
      {showInvoiceModal && invoiceData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-emerald-900">Invoice</h3>
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
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-emerald-900">PharmaFlow</h2>
                  <p className="text-emerald-700">Invoice #{invoiceData.id}</p>
                  <p className="text-emerald-700 text-sm mt-1">{new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="border border-emerald-200 rounded-lg overflow-hidden mb-4">
                  <table className="w-full">
                    <thead className="bg-emerald-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-emerald-800">Item</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-emerald-800">Qty</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-emerald-800">Price</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-emerald-800">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100">
                      {invoiceData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 text-emerald-900 text-sm">{item.name}</td>
                          <td className="px-3 py-2 text-right text-emerald-700 text-sm">{item.quantity}</td>
                          <td className="px-3 py-2 text-right text-emerald-700 text-sm">₹{parseFloat(item.price).toFixed(2)}</td>
                          <td className="px-3 py-2 text-right text-emerald-900 font-medium text-sm">₹{parseFloat(item.total).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between py-1">
                    <span className="text-emerald-700">Subtotal:</span>
                    <span className="font-medium">₹{invoiceData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-emerald-700">Tax (8%):</span>
                    <span className="font-medium">₹{invoiceData.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-emerald-200 mt-2 pt-2">
                    <span className="text-emerald-900 font-bold">Total:</span>
                    <span className="text-emerald-900 font-bold">₹{invoiceData.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-emerald-700 text-sm">Payment Method: {invoiceData.paymentMethod}</p>
                  <p className="text-emerald-700 text-sm mt-1">Thank you for your purchase!</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                >
                  Print Invoice
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="flex-1 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPOS;