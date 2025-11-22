const db = require('../config/db');

class User {
  static async create(userData) {
    const { name, email, password, role, status = 'active' } = userData;
    const [result] = await db.execute(
      'INSERT INTO user_account (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, role, status]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM user_account WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, name, email, role, status FROM user_account WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findAll() {
    const [rows] = await db.execute(
      'SELECT id, name, email, role, status, created_at FROM user_account ORDER BY id'
    );
    return rows;
  }

  static async update(id, userData) {
    // Build dynamic query based on provided fields
    const fields = [];
    const values = [];
    
    if (userData.name !== undefined) {
      fields.push('name = ?');
      values.push(userData.name);
    }
    
    if (userData.email !== undefined) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    
    if (userData.role !== undefined) {
      fields.push('role = ?');
      values.push(userData.role);
    }
    
    if (userData.status !== undefined) {
      fields.push('status = ?');
      values.push(userData.status);
    }
    
    // Handle password updates
    if (userData.password !== undefined) {
      fields.push('password = ?');
      values.push(userData.password);
    }
    
    // Always add the ID for the WHERE clause
    values.push(id);
    
    if (fields.length === 0) {
      // No fields to update
      return 0;
    }
    
    const query = `UPDATE user_account SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await db.execute(query, values);
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM user_account WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }
}

module.exports = User;