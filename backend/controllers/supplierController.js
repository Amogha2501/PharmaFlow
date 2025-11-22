const Supplier = require('../models/supplierModel');

// Get all suppliers with pagination
const getAllSuppliers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await Supplier.findAll(page, limit);
    // Add product count information to each supplier
    const suppliersWithCounts = result.suppliers.map(supplier => ({
      ...supplier,
      productCount: supplier.product_count || 0
    }));
    res.json({
      ...result,
      suppliers: suppliersWithCounts
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Server error while fetching suppliers' });
  }
};

// Get supplier by ID
const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    // Add product count information and preserve products array
    const supplierWithCount = {
      ...supplier,
      productCount: supplier.product_count || 0
    };
    
    res.json(supplierWithCount);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ message: 'Server error while fetching supplier' });
  }
};

// Create new supplier
const createSupplier = async (req, res) => {
  try {
    const { name, email, phone, address, city, country, paymentTerms, products } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !address || !city || !country || !paymentTerms) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const supplierId = await Supplier.create({
      name,
      email,
      phone,
      address,
      city,
      country,
      paymentTerms
    });
    
    // Handle product assignments if provided
    if (products && products.length > 0) {
      await Supplier.assignProducts(supplierId, products);
    }
    
    const newSupplier = await Supplier.findById(supplierId);
    // Add product count information and preserve products array
    const supplierWithCount = {
      ...newSupplier,
      productCount: newSupplier.product_count || 0
    };
    res.status(201).json(supplierWithCount);
  } catch (error) {
    console.error('Error creating supplier:', error);
    
    // Handle specific database errors
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.sqlMessage.includes('supplier.email')) {
        return res.status(400).json({ message: 'A supplier with this email already exists. Please use a different email address.' });
      }
      return res.status(400).json({ message: 'Duplicate entry detected.' });
    }
    
    res.status(500).json({ message: 'Server error while creating supplier' });
  }
};

// Update supplier
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, city, country, paymentTerms, products } = req.body;
    
    // Check if supplier exists
    const existingSupplier = await Supplier.findById(id);
    if (!existingSupplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    const affectedRows = await Supplier.update(id, {
      name: name || existingSupplier.name,
      email: email || existingSupplier.email,
      phone: phone || existingSupplier.phone,
      address: address || existingSupplier.address,
      city: city || existingSupplier.city,
      country: country || existingSupplier.country,
      paymentTerms: paymentTerms || existingSupplier.payment_terms
    });
    
    if (affectedRows === 0) {
      return res.status(400).json({ message: 'Failed to update supplier' });
    }
    
    // Handle product assignments if provided
    if (products !== undefined) {
      await Supplier.assignProducts(id, products);
    }
    
    const updatedSupplier = await Supplier.findById(id);
    // Add product count information and preserve products array
    const supplierWithCount = {
      ...updatedSupplier,
      productCount: updatedSupplier.product_count || 0
    };
    res.json(supplierWithCount);
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ message: 'Server error while updating supplier' });
  }
};

// Delete supplier
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if supplier exists
    const existingSupplier = await Supplier.findById(id);
    if (!existingSupplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    const affectedRows = await Supplier.delete(id);
    
    if (affectedRows === 0) {
      return res.status(400).json({ message: 'Failed to delete supplier' });
    }
    
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ message: 'Server error while deleting supplier' });
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
};