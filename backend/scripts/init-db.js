const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const initDb = async () => {
  let connection;
  
  try {
    // Create connection without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('Connected to MySQL server');
    
    // Create database
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'pharmacy_db'}\``);
    console.log(`Database ${process.env.DB_NAME || 'pharmacy_db'} created or already exists`);
    
    // Select database
    await connection.query(`USE \`${process.env.DB_NAME || 'pharmacy_db'}\``);
    console.log(`Using database ${process.env.DB_NAME || 'pharmacy_db'}`);
    
    // Read and execute schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the SQL file into individual statements
    const statements = schemaSql.split(';').filter(stmt => stmt.trim() !== '');
    
    // Execute statements in order, skipping CREATE DATABASE and USE statements
    for (const statement of statements) {
      if (statement.trim() !== '') {
        try {
          // Skip CREATE DATABASE and USE statements as we've already handled them
          if (!statement.toUpperCase().includes('CREATE DATABASE') && 
              !statement.toUpperCase().includes('USE ') && 
              statement.trim() !== '') {
            await connection.query(statement);
            console.log('Executed:', statement.substring(0, 50) + '...');
          }
        } catch (err) {
          console.warn('Warning executing statement:', err.message);
        }
      }
    }
    
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
};

initDb();