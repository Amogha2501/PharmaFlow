const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pharmacy_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: process.env.DB_PORT || 3306
});

pool.on('connection', (connection) => {
  console.log('Database connection established');
});

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

module.exports = pool;