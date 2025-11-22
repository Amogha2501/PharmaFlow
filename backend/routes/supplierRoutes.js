const express = require('express');
const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');
const authenticateToken = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Protected routes (admin only)
router.get('/', authenticateToken, checkRole(['admin']), getAllSuppliers);
router.get('/:id', authenticateToken, checkRole(['admin']), getSupplierById);
router.post('/', authenticateToken, checkRole(['admin']), createSupplier);
router.put('/:id', authenticateToken, checkRole(['admin']), updateSupplier);
router.delete('/:id', authenticateToken, checkRole(['admin']), deleteSupplier);

module.exports = router;