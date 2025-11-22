const db = require('../config/db');

class SaleItem {
  static async create(saleItemId, saleId, productId, quantity, price) {
    const [result] = await db.execute(
      'INSERT INTO sale_item (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [saleId, productId, quantity, price]
    );
    return result.insertId;
  }

  static async findBySaleId(saleId) {
    const [rows] = await db.execute(
      'SELECT si.*, p.name as product_name FROM sale_item si JOIN product p ON si.product_id = p.id WHERE si.sale_id = ?',
      [saleId]
    );
    return rows;
  }
}

module.exports = SaleItem;