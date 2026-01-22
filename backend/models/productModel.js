const db = require('../config/db');

class Product {
  static async create(productData) {
    const { name, description, price, quantity, reorderLevel, supplierId, expiryDate } = productData;
    const [result] = await db.execute(
      'INSERT INTO product (name, description, price, quantity, reorder_level, supplier_id, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, quantity, reorderLevel, supplierId || null, expiryDate || null]
    );
    return result.insertId;
  }

  static async findAll(page = 1, limit = 10) {
    // Ensure page and limit are integers
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;
    
    // Using string interpolation for LIMIT and OFFSET to avoid parameter binding issues
    const [rows] = await db.execute(
      `SELECT p.*, s.name as supplier_name FROM product p LEFT JOIN supplier s ON p.supplier_id = s.id ORDER BY p.id ASC LIMIT ${limitNum} OFFSET ${offset}`
    );
    const [countResult] = await db.execute('SELECT COUNT(*) as total FROM product');
    
    // Remove duplicates from database results
    const uniqueRows = rows.filter((row, index, self) => 
      index === self.findIndex(r => r.id === row.id)
    );
    
    return {
      products: uniqueRows,
      total: countResult[0].total,
      page: pageNum,
      totalPages: Math.ceil(countResult[0].total / limitNum)
    };
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT p.*, s.name as supplier_name FROM product p LEFT JOIN supplier s ON p.supplier_id = s.id WHERE p.id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, productData) {
    const { name, description, price, quantity, reorderLevel, supplierId, expiryDate } = productData;
    
    // Log the data being updated for debugging
    console.log('Updating product with ID:', id);
    console.log('Update data:', { name, description, price, quantity, reorderLevel, supplierId, expiryDate });
    
    try {
      const [result] = await db.execute(
        'UPDATE product SET name = ?, description = ?, price = ?, quantity = ?, reorder_level = ?, supplier_id = ?, expiry_date = ? WHERE id = ?',
        [name, description, price, quantity, reorderLevel, supplierId || null, expiryDate || null, id]
      );
      console.log('Update result:', result);
      return result.affectedRows;
    } catch (error) {
      console.error('Database error in product update:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error;
    }
  }

  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM product WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }

  static async search(query) {
    const [rows] = await db.execute(
      'SELECT p.*, s.name as supplier_name FROM product p LEFT JOIN supplier s ON p.supplier_id = s.id WHERE p.name LIKE ? OR p.id LIKE ?',
      [`%${query}%`, `%${query}%`]
    );
    return rows;
  }

  static async updateStock(id, quantity) {
    const [result] = await db.execute(
      'UPDATE product SET quantity = ? WHERE id = ?',
      [quantity, id]
    );
    return result.affectedRows;
  }
}

module.exports = Product;