const Sale = require('../models/salesModel');
const SaleItem = require('../models/saleItemModel');
const Product = require('../models/productModel');

// Get all sales with pagination
const getAllSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await Sale.findAll(page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Server error while fetching sales' });
  }
};

// Get sales for a specific clerk with pagination
const getClerkSales = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await Sale.findByUserId(userId, page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error fetching clerk sales:', error);
    res.status(500).json({ message: 'Server error while fetching sales' });
  }
};

// Get sale by ID
const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id);
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    // Get sale items
    const items = await SaleItem.findBySaleId(id);
    
    // Calculate subtotal and tax
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const tax = subtotal * 0.08; // 8% tax
    const totalAmount = subtotal + tax;
    
    // Transform items to match frontend expectations
    const transformedItems = items.map(item => ({
      name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price
    }));
    
    res.json({
      ...sale,
      items: transformedItems,
      subtotal: subtotal,
      tax: tax,
      totalAmount: totalAmount
    });
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({ message: 'Server error while fetching sale' });
  }
};

// Create new sale
const createSale = async (req, res) => {
  try {
    const { items, paymentMethod, totalAmount } = req.body;
    const userId = req.user.id; // From auth middleware
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }
    
    if (!paymentMethod || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Create sale record
    const saleId = await Sale.create({
      userId,
      totalAmount: parseFloat(totalAmount),
      paymentMethod
    });
    
    // Create sale items and update product quantities
    const saleItems = [];
    for (const item of items) {
      const { productId, quantity, price } = item;
      
      // Get current product quantity
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${productId} not found` });
      }
      
      // Check if enough stock
      if (product.quantity < quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for product ${product.name}. Available: ${product.quantity}, Requested: ${quantity}` 
        });
      }
      
      // Create sale item
      await SaleItem.create(null, saleId, productId, quantity, price);
      
      // Update product quantity
      const newQuantity = product.quantity - quantity;
      await Product.updateStock(productId, newQuantity);
      
      saleItems.push({
        productId,
        quantity,
        price,
        productName: product.name
      });
    }
    
    // Get the complete sale record
    const completeSale = await Sale.findById(saleId);
    
    res.status(201).json({
      ...completeSale,
      items: saleItems,
      message: 'Sale created successfully'
    });
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ message: 'Server error while creating sale' });
  }
};

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  getClerkSales
};