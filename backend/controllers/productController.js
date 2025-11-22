const Product = require('../models/productModel');

// Get all products with pagination
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    console.log('Fetching products with page:', page, 'limit:', limit);
    
    const result = await Product.findAll(page, limit);
    console.log('Products fetched successfully:', result.products.length);
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching product with ID:', id);
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, reorderLevel, supplierId, expiryDate } = req.body;
    
    // Validate required fields
    if (!name || !price || quantity === undefined || reorderLevel === undefined || !supplierId || !expiryDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    console.log('Creating product:', { name, price, quantity, reorderLevel, supplierId });
    
    const productId = await Product.create({
      name,
      description: description || '',
      price: parseFloat(price),
      quantity: parseInt(quantity),
      reorderLevel: parseInt(reorderLevel),
      supplierId: supplierId && supplierId !== '' ? parseInt(supplierId) : null,
      expiryDate: expiryDate || null
    });
    
    const newProduct = await Product.findById(productId);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, reorderLevel, supplierId, expiryDate } = req.body;
    
    console.log('Updating product with ID:', id);
    console.log('Request body:', req.body);
    console.log('Update data:', { name, description, price, quantity, reorderLevel, supplierId, expiryDate });
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      console.log('Invalid product ID provided:', id);
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    
    // Check if product exists
    const existingProduct = await Product.findById(id);
    console.log('Existing product in database:', existingProduct);
    if (!existingProduct) {
      console.log('Product not found in database with ID:', id);
      return res.status(404).json({ message: 'Product not found. The product with ID ' + id + ' does not exist in the database.' });
    }
    
    // Validate numeric fields
    if (price !== undefined && price !== null && price !== '' && (isNaN(parseFloat(price)) || parseFloat(price) < 0)) {
      return res.status(400).json({ message: 'Invalid price value' });
    }
    
    if (quantity !== undefined && quantity !== null && quantity !== '' && (isNaN(parseInt(quantity)) || parseInt(quantity) < 0)) {
      return res.status(400).json({ message: 'Invalid quantity value' });
    }
    
    if (reorderLevel !== undefined && reorderLevel !== null && reorderLevel !== '' && (isNaN(parseInt(reorderLevel)) || parseInt(reorderLevel) < 0)) {
      return res.status(400).json({ message: 'Invalid reorder level value' });
    }
    
    if (supplierId !== undefined && supplierId !== null && supplierId !== '' && isNaN(parseInt(supplierId))) {
      return res.status(400).json({ message: 'Invalid supplier ID' });
    }
    
    const updateData = {
      name: name !== undefined && name !== null && name !== '' ? name : existingProduct.name,
      description: description !== undefined ? description : existingProduct.description,
      price: price !== undefined && price !== null && price !== '' ? parseFloat(price) : existingProduct.price,
      quantity: quantity !== undefined && quantity !== null && quantity !== '' ? parseInt(quantity) : existingProduct.quantity,
      reorderLevel: reorderLevel !== undefined && reorderLevel !== null && reorderLevel !== '' ? parseInt(reorderLevel) : existingProduct.reorder_level,
      supplierId: supplierId !== undefined && supplierId !== null && supplierId !== '' ? parseInt(supplierId) : (supplierId === '' ? null : existingProduct.supplier_id),
      expiryDate: expiryDate !== undefined ? expiryDate : existingProduct.expiry_date
    };
    
    console.log('Final update data:', updateData);
    
    const affectedRows = await Product.update(id, updateData);
    console.log('Affected rows:', affectedRows);
    
    if (affectedRows === 0) {
      return res.status(400).json({ message: 'Failed to update product. No rows were affected.' });
    }
    
    const updatedProduct = await Product.findById(id);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    // Provide more specific error message
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'Invalid supplier ID - supplier does not exist' });
    }
    res.status(500).json({ message: 'Server error while updating product: ' + error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Deleting product with ID:', id);
    
    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const affectedRows = await Product.delete(id);
    
    if (affectedRows === 0) {
      return res.status(400).json({ message: 'Failed to delete product' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
    
    console.log('Searching products with query:', q);
    
    const products = await Product.search(q);
    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Server error while searching products' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
};