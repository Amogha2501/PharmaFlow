const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const applyDbComponents = async () => {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'pharmacy_db',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('Connected to MySQL server');
    
    // First create views (they need to be executed separately)
    console.log('Creating views...');
    
    // View: view_product_inventory
    await connection.query(`
      CREATE OR REPLACE VIEW view_product_inventory AS
      SELECT 
          p.id,
          p.name,
          p.description,
          p.price,
          p.quantity,
          p.reorder_level,
          p.expiry_date,
          s.name AS supplier_name,
          s.email AS supplier_email,
          s.phone AS supplier_phone
      FROM product p
      LEFT JOIN supplier s ON p.supplier_id = s.id
    `);
    console.log('Created view_product_inventory');
    
    // View: view_sales_summary
    await connection.query(`
      CREATE OR REPLACE VIEW view_sales_summary AS
      SELECT 
          s.id,
          s.total_amount,
          s.payment_method,
          s.created_at,
          u.name AS clerk_name,
          u.email AS clerk_email
      FROM sale s
      JOIN user_account u ON s.user_id = u.id
    `);
    console.log('Created view_sales_summary');
    
    // View: view_product_sales
    await connection.query(`
      CREATE OR REPLACE VIEW view_product_sales AS
      SELECT 
          p.id,
          p.name,
          COALESCE(SUM(si.quantity), 0) AS total_quantity_sold,
          COALESCE(SUM(si.quantity * si.price), 0) AS total_revenue
      FROM product p
      LEFT JOIN sale_item si ON p.id = si.product_id
      GROUP BY p.id, p.name
    `);
    console.log('Created view_product_sales');
    
    // View: view_low_stock
    await connection.query(`
      CREATE OR REPLACE VIEW view_low_stock AS
      SELECT 
          id,
          name,
          description,
          price,
          quantity,
          reorder_level,
          expiry_date
      FROM product
      WHERE quantity <= reorder_level
    `);
    console.log('Created view_low_stock');
    
    // Read the procedures and triggers file
    const componentsPath = path.join(__dirname, '..', 'database', 'views_procedures_triggers.sql');
    const componentsSql = fs.readFileSync(componentsPath, 'utf8');
    
    // Extract and execute procedures and triggers
    const procedureAndTriggerSections = componentsSql.split('-- ')[1]; // Skip the views part
    
    // Split by delimiter
    const statements = componentsSql.split('//').filter(stmt => stmt.trim() !== '');
    
    // Execute procedures and triggers
    for (const statement of statements) {
      const trimmedStatement = statement.trim();
      if (trimmedStatement !== '' && 
          !trimmedStatement.toUpperCase().includes('DELIMITER') &&
          !trimmedStatement.toUpperCase().includes('VIEW')) {
        try {
          // Skip view creation statements since we already created them
          if (!trimmedStatement.toUpperCase().includes('CREATE VIEW')) {
            await connection.query(trimmedStatement);
            console.log('Executed statement:', trimmedStatement.substring(0, 50) + '...');
          }
        } catch (err) {
          console.warn('Warning executing statement:', err.message);
        }
      }
    }
    
    console.log('Database components applied successfully!');
  } catch (error) {
    console.error('Error applying database components:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
};

applyDbComponents();