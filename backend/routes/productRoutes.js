const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} = require('../controllers/productController');
const authenticateToken = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes
router.get('/search', searchProducts);

// Protected routes (accessible to both admin and clerk for POS functionality)
router.get('/', authenticateToken, checkRole(['admin', 'clerk']), getAllProducts);
router.get('/:id', authenticateToken, checkRole(['admin', 'clerk']), getProductById);

// Admin only routes
router.post('/', authenticateToken, checkRole(['admin']), createProduct);
router.put('/:id', authenticateToken, checkRole(['admin']), updateProduct);
router.delete('/:id', authenticateToken, checkRole(['admin']), deleteProduct);

module.exports = router;