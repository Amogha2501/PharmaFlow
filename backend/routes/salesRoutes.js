const express = require('express');
const {
  getAllSales,
  getSaleById,
  createSale
} = require('../controllers/salesController');
const authenticateToken = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Clerk and admin can create sales
router.post('/', authenticateToken, checkRole(['clerk', 'admin']), createSale);

// Admin can view all sales
router.get('/', authenticateToken, checkRole(['admin']), getAllSales);

// Both clerk and admin can view specific sale
router.get('/:id', authenticateToken, checkRole(['clerk', 'admin']), getSaleById);

module.exports = router;