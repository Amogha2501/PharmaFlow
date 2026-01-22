const Report = require('../models/reportModel');

// Get report summary
const getSummary = async (req, res) => {
  try {
    // Get total sales revenue for today
    const [salesRevenueResult] = await require('../config/db').execute(
      'SELECT COALESCE(SUM(total_amount), 0) as total FROM sale WHERE DATE(created_at) = CURDATE()'
    );
    
    // Get total products count
    const [productsCountResult] = await require('../config/db').execute(
      'SELECT COUNT(*) as total FROM product'
    );
    
    // Get low stock alerts count
    const [lowStockCountResult] = await require('../config/db').execute(
      'SELECT COUNT(*) as total FROM product WHERE quantity <= reorder_level'
    );
    
    // Get suppliers count
    const [suppliersCountResult] = await require('../config/db').execute(
      'SELECT COUNT(*) as total FROM supplier'
    );
    
    // Get expiry alerts count
    const [expiryAlertsResult] = await require('../config/db').execute(
      'SELECT COUNT(*) as total FROM product WHERE expiry_date < CURDATE() OR (expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) AND expiry_date >= CURDATE())'
    );
    
    const summary = {
      totalSales: parseFloat(salesRevenueResult[0].total),
      productsInStock: parseInt(productsCountResult[0].total),
      lowStockAlerts: parseInt(lowStockCountResult[0].total),
      suppliersCount: parseInt(suppliersCountResult[0].total),
      expiryAlerts: parseInt(expiryAlertsResult[0].total)
    };
    
    res.json(summary);
  } catch (error) {
    console.error('Error fetching report summary:', error);
    res.status(500).json({ message: 'Server error while fetching report summary' });
  }
};

// Get daily sales report
const getDailySales = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }
    
    const result = await Report.getDailySales(date);
    res.json(result || { date, sales: 0, revenue: 0 });
  } catch (error) {
    console.error('Error fetching daily sales:', error);
    res.status(500).json({ message: 'Server error while fetching daily sales' });
  }
};

// Get inventory alerts (low stock)
const getInventoryAlerts = async (req, res) => {
  try {
    const lowStockItems = await Report.getLowStockAlerts();
    res.json(lowStockItems);
  } catch (error) {
    console.error('Error fetching inventory alerts:', error);
    res.status(500).json({ message: 'Server error while fetching inventory alerts' });
  }
};

// Get sales by clerk report
const getSalesByClerk = async (req, res) => {
  try {
    const salesByClerk = await Report.getSalesByClerk();
    res.json(salesByClerk);
  } catch (error) {
    console.error('Error fetching sales by clerk:', error);
    res.status(500).json({ message: 'Server error while fetching sales by clerk' });
  }
};

// Get expiry alerts
const getExpiryAlerts = async (req, res) => {
  try {
    // Get ALL products with supplier information and expiry status
    const [allProducts] = await require('../config/db').execute(
      `SELECT p.id, p.name, p.expiry_date, s.name as supplier,
       CASE 
         WHEN p.expiry_date < CURDATE() THEN 'expired'
         WHEN p.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'near-expiry'
         ELSE 'active'
       END as status
       FROM product p
       LEFT JOIN supplier s ON p.supplier_id = s.id
       ORDER BY p.expiry_date ASC`
    );
    
    // Get total product count
    const [totalCountResult] = await require('../config/db').execute(
      'SELECT COUNT(*) as total FROM product'
    );
    
    res.json({
      products: allProducts,
      totalProducts: totalCountResult[0].total
    });
  } catch (error) {
    console.error('Error fetching expiry alerts:', error);
    res.status(500).json({ message: 'Server error while fetching expiry alerts' });
  }
};

// Get product-wise revenue report
const getProductWiseRevenue = async (req, res) => {
  try {
    const productWiseRevenue = await Report.getProductWiseRevenue();
    res.json(productWiseRevenue);
  } catch (error) {
    console.error('Error fetching product-wise revenue:', error);
    res.status(500).json({ message: 'Server error while fetching product-wise revenue' });
  }
};

// Get recent activities
const getRecentActivities = async (req, res) => {
  try {
    const activities = await Report.getRecentActivities(5);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: 'Server error while fetching recent activities' });
  }
};

// Get clerk summary (new function for clerks)
const getClerkSummary = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    
    // Get today's sales for this clerk
    const [salesResult] = await require('../config/db').execute(
      `SELECT COUNT(*) as total_sales, COALESCE(SUM(total_amount), 0) as total_revenue
       FROM sale 
       WHERE user_id = ? AND DATE(created_at) = CURDATE()`,
      [userId]
    );
    
    // Get low stock alerts count
    const [lowStockCountResult] = await require('../config/db').execute(
      'SELECT COUNT(*) as total FROM product WHERE quantity <= reorder_level'
    );
    
    const summary = {
      todaysSales: parseFloat(salesResult[0].total_revenue),
      transactionsCount: parseInt(salesResult[0].total_sales),
      stockAlerts: parseInt(lowStockCountResult[0].total)
    };
    
    res.json(summary);
  } catch (error) {
    console.error('Error fetching clerk summary:', error);
    res.status(500).json({ message: 'Server error while fetching clerk summary' });
  }
};

// Get recent transactions for a specific clerk
const getClerkRecentTransactions = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    
    const transactions = await Report.getClerkRecentTransactions(userId, 5);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching clerk recent transactions:', error);
    res.status(500).json({ message: 'Server error while fetching recent transactions' });
  }
};

// Update resolved status of low stock alert
const updateLowStockAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolved } = req.body;
    
    // Validate input
    if (resolved === undefined) {
      return res.status(400).json({ message: 'Resolved status is required' });
    }
    
    // Update the resolved status in the database
    const [result] = await require('../config/db').execute(
      'UPDATE low_stock_alert SET resolved = ? WHERE id = ?',
      [resolved, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Low stock alert not found' });
    }
    
    res.json({ message: 'Low stock alert updated successfully' });
  } catch (error) {
    console.error('Error updating low stock alert:', error);
    res.status(500).json({ message: 'Server error while updating low stock alert' });
  }
};

module.exports = {
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
};