const db = require('../config/db');

class Supplier {
  static async create(supplierData) {
    const { name, email, phone, address, city, country, paymentTerms } = supplierData;
    const [result] = await db.execute(
      'INSERT INTO supplier (name, email, phone, address, city, country, payment_terms, product_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, address, city || null, country || null, paymentTerms || null, 0]
    );
    return result.insertId;
  }

  static async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    // Modified query to include product count for each supplier
    const [rows] = await db.execute(`
      SELECT s.*, COALESCE(s.product_count, 0) as product_count 
      FROM supplier s 
      ORDER BY s.id
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `);
    
    // For each supplier, fetch their actual assigned products
    const suppliers = [];
    for (const supplierRow of rows) {
      // Get the actual assigned products for this supplier
      const [productRows] = await db.execute(
        'SELECT id FROM product WHERE supplier_id = ?',
        [supplierRow.id]
      );
      
      // Add product IDs array to the supplier object
      const supplier = {
        ...supplierRow,
        products: productRows.map(row => row.id)
      };
      
      suppliers.push(supplier);
    }
    
    const [countResult] = await db.execute('SELECT COUNT(*) as total FROM supplier');
    return {
      suppliers: suppliers,
      total: countResult[0].total,
      page,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  }

  static async findById(id) {
    // First get the supplier with product count
    const [supplierRows] = await db.execute(
      'SELECT s.*, COALESCE(s.product_count, 0) as product_count FROM supplier s WHERE s.id = ?',
      [id]
    );
    
    if (!supplierRows[0]) {
      return null;
    }
    
    // Then get the actual assigned products for this supplier
    const [productRows] = await db.execute(
      'SELECT id FROM product WHERE supplier_id = ?',
      [id]
    );
    
    // Add product IDs array to the supplier object
    const supplier = supplierRows[0];
    supplier.products = productRows.map(row => row.id);
    
    return supplier;
  }

  static async update(id, supplierData) {
    const { name, email, phone, address, city, country, paymentTerms } = supplierData;
    const [result] = await db.execute(
      'UPDATE supplier SET name = ?, email = ?, phone = ?, address = ?, city = ?, country = ?, payment_terms = ? WHERE id = ?',
      [name, email, phone, address, city || null, country || null, paymentTerms || null, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM supplier WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }
  
  // Assign products to supplier by updating product records
  static async assignProducts(supplierId, productIds) {
    // First, remove all current assignments for this supplier
    await db.execute(
      'UPDATE product SET supplier_id = NULL WHERE supplier_id = ?',
      [supplierId]
    );
    
    // Then assign the new products to this supplier
    if (productIds && productIds.length > 0) {
      // Create placeholders for the IN clause
      const placeholders = productIds.map(() => '?').join(',');
      await db.execute(
        `UPDATE product SET supplier_id = ? WHERE id IN (${placeholders})`,
        [supplierId, ...productIds]
      );
    }
    
    // Update the product count for this supplier
    const productCount = productIds ? productIds.length : 0;
    await db.execute(
      'UPDATE supplier SET product_count = ? WHERE id = ?',
      [productCount, supplierId]
    );
    
    return true;
  }
}

module.exports = Supplier;