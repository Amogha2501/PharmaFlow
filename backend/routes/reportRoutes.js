const express = require('express');
const {
  getSummary,
  getDailySales,
  getInventoryAlerts,
  getSalesByClerk,
  getProductWiseRevenue,
  getExpiryAlerts,
  getRecentActivities,
  getClerkSummary,
  getClerkRecentTransactions,
  updateLowStockAlert
} = require('../controllers/reportController');
const authenticateToken = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Admin only reports
router.get('/summary', authenticateToken, checkRole(['admin']), getSummary);
router.get('/daily-sales', authenticateToken, checkRole(['admin']), getDailySales);
router.get('/inventory-alerts', authenticateToken, checkRole(['admin']), getInventoryAlerts);
router.get('/sales-by-clerk', authenticateToken, checkRole(['admin']), getSalesByClerk);
router.get('/product-wise-revenue', authenticateToken, checkRole(['admin']), getProductWiseRevenue);
router.get('/expiry-alerts', authenticateToken, checkRole(['admin']), getExpiryAlerts);
router.get('/recent-activities', authenticateToken, checkRole(['admin']), getRecentActivities);
router.put('/low-stock-alert/:id', authenticateToken, checkRole(['admin']), updateLowStockAlert);

// Clerk reports
router.get('/clerk-summary', authenticateToken, checkRole(['clerk', 'admin']), getClerkSummary);
router.get('/clerk-recent-transactions', authenticateToken, checkRole(['clerk', 'admin']), getClerkRecentTransactions);

module.exports = router;