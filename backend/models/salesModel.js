const db = require('../config/db');

class Sale {
  static async create(saleData) {
    const { userId, totalAmount, paymentMethod } = saleData;
    const [result] = await db.execute(
      'INSERT INTO sale (user_id, total_amount, payment_method) VALUES (?, ?, ?)',
      [userId, totalAmount, paymentMethod]
    );
    return result.insertId;
  }

  static async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const [rows] = await db.execute(
      `SELECT s.*, u.name as clerk_name FROM sale s JOIN user_account u ON s.user_id = u.id ORDER BY s.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`
    );
    const [countResult] = await db.execute('SELECT COUNT(*) as total FROM sale');
    return {
      sales: rows,
      total: countResult[0].total,
      page,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT s.*, u.name as clerk_name FROM sale s JOIN user_account u ON s.user_id = u.id WHERE s.id = ?',
      [id]
    );
    return rows[0];
  }
}

module.exports = Sale;