const db = require('../config/db');

class Report {
  static async getDailySales(date) {
    const [rows] = await db.execute(
      `SELECT DATE(created_at) as date, COUNT(*) as sales, SUM(total_amount) as revenue 
       FROM sale 
       WHERE DATE(created_at) = ?
       GROUP BY DATE(created_at)`,
      [date]
    );
    return rows[0];
  }

  static async getLowStockAlerts() {
    const [rows] = await db.execute(
      `SELECT p.*, s.name as supplier_name, lsa.id as alert_id, lsa.resolved as alert_resolved
       FROM product p 
       LEFT JOIN supplier s ON p.supplier_id = s.id
       LEFT JOIN low_stock_alert lsa ON p.id = lsa.product_id
       WHERE p.quantity <= p.reorder_level`
    );
    return rows;
  }

  static async getExpiredProducts() {
    const [rows] = await db.execute(
      'SELECT * FROM product WHERE expiry_date < CURDATE()'
    );
    return rows;
  }

  static async getProductWiseRevenue() {
    const [rows] = await db.execute(
      `SELECT p.name, SUM(si.quantity) as total_sold, SUM(si.quantity * si.price) as revenue
       FROM sale_item si
       JOIN product p ON si.product_id = p.id
       GROUP BY p.id, p.name
       ORDER BY revenue DESC`
    );
    return rows;
  }

  static async getSalesByClerk() {
    const [rows] = await db.execute(
      `SELECT u.name as clerk_name, COUNT(s.id) as total_sales, SUM(s.total_amount) as total_revenue
       FROM sale s
       JOIN user_account u ON s.user_id = u.id
       GROUP BY u.id, u.name
       ORDER BY total_revenue DESC`
    );
    return rows;
  }
  
  static async getExpiryAlerts() {
    const [rows] = await db.execute(
      `SELECT id, name, expiry_date,
       CASE 
         WHEN expiry_date < CURDATE() THEN 'expired'
         WHEN expiry_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 'critical'
         WHEN expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'warning'
         ELSE 'safe'
       END as status
       FROM product 
       WHERE expiry_date < CURDATE() OR (expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) AND expiry_date >= CURDATE())
       ORDER BY expiry_date ASC`
    );
    return rows;
  }
  
  static async getRecentActivities(limit = 5) {
    // First check if there are any sales
    const [countResult] = await db.execute('SELECT COUNT(*) as count FROM sale WHERE DATE(created_at) = CURDATE()');
    if (countResult[0].count === 0) {
      return [];
    }
    
    const limitNum = parseInt(limit);
    const [rows] = await db.execute(
      `SELECT s.id as sale_id, s.total_amount, s.created_at, u.name as clerk_name
       FROM sale s
       LEFT JOIN user_account u ON s.user_id = u.id
       WHERE DATE(s.created_at) = CURDATE()
       ORDER BY s.created_at DESC
       LIMIT ${limitNum}`
    );
    return rows;
  }
  
  // Get recent transactions for a specific clerk
  static async getClerkRecentTransactions(userId, limit = 5) {
    const limitNum = parseInt(limit);
    const [rows] = await db.execute(
      `SELECT s.id as sale_id, s.total_amount, s.created_at
       FROM sale s
       WHERE s.user_id = ? AND DATE(s.created_at) = CURDATE()
       ORDER BY s.created_at DESC
       LIMIT ${limitNum}`,
      [userId]
    );
    return rows;
  }
}

module.exports = Report;