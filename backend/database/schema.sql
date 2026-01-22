-- PharmaTrack Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS pharmacy_db;
USE pharmacy_db;

-- Role table
CREATE TABLE IF NOT EXISTS role (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Account table
CREATE TABLE IF NOT EXISTS user_account (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'clerk') NOT NULL DEFAULT 'clerk',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add status column if it doesn't exist
ALTER TABLE user_account ADD COLUMN status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';

-- Supplier table
CREATE TABLE IF NOT EXISTS supplier (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100),
  payment_terms VARCHAR(100),
  product_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product table
CREATE TABLE IF NOT EXISTS product (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  reorder_level INT NOT NULL DEFAULT 10,
  supplier_id INT,
  expiry_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES supplier(id) ON DELETE SET NULL
);

-- Sale table
CREATE TABLE IF NOT EXISTS sale (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('cash', 'credit_card', 'debit_card') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_account(id) ON DELETE SET NULL
);

-- Sale Item table
CREATE TABLE IF NOT EXISTS sale_item (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sale_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES sale(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE set null
);

-- Low Stock Alert table
CREATE TABLE IF NOT EXISTS low_stock_alert (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  alert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

-- Expiry Log table
CREATE TABLE IF NOT EXISTS expiry_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  expiry_date DATE,
  log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_product_name ON product(name);
CREATE INDEX idx_product_supplier ON product(supplier_id);
CREATE INDEX idx_sale_user ON sale(user_id);
CREATE INDEX idx_sale_date ON sale(created_at);
CREATE INDEX idx_sale_item_sale ON sale_item(sale_id);
CREATE INDEX idx_sale_item_product ON sale_item(product_id);

-- Insert default roles
INSERT IGNORE INTO role (name, description) VALUES 
('admin', 'Administrator with full access'),
('clerk', 'Sales clerk with limited access');

-- Insert sample data in correct order to handle foreign key constraints
-- First suppliers
REPLACE INTO supplier (id, name, email, phone, address, city, country, payment_terms, product_count) VALUES 
(1, 'MediSupply Corp', 'contact@medisupply.com', '+1234567890', '123 Medical Plaza, Health City', 'Health City', 'Medical Country', 'Net 30', 3),
(2, 'PharmaDistributors Ltd', 'info@pharmadist.com', '+1987654321', '456 Pharma Street, Medicine Town', 'Medicine Town', 'Pharma Country', 'Net 45', 2);

-- Then users
REPLACE INTO user_account (id, name, email, password, role) VALUES 
(1, 'Admin User', 'admin@pharmacy.com', '$2a$10$/GoTqMA4KgnCbMzN0P.WrO52QOfe5BXbdK4G5iRDOnrbBZbz9qZom', 'admin'),
(2, 'Sales Clerk', 'clerk@pharmacy.com', '$2a$10$/GoTqMA4KgnCbMzN0P.WrO52QOfe5BXbdK4G5iRDOnrbBZbz9qZom', 'clerk');

-- Then products
REPLACE INTO product (id, name, description, price, quantity, reorder_level, supplier_id, expiry_date) VALUES 
(1, 'Aspirin 500mg', 'Pain reliever and fever reducer', 5.99, 100, 20, 1, '2026-12-31'),
(2, 'Vitamin C 1000mg', 'Immune system booster', 8.99, 50, 15, 2, '2025-12-31'),
(3, 'Paracetamol 250mg', 'General painkiller', 3.99, 200, 30, 1, '2026-06-30'),
(4, 'Multivitamin', 'Daily vitamin supplement', 12.99, 75, 10, 2, '2027-01-31'),
(5, 'Cough Syrup', 'For relief of cough symptoms', 7.99, 30, 5, 1, '2025-09-30');

-- Then sales
REPLACE INTO sale (id, user_id, total_amount, payment_method, created_at) VALUES 
(1, 2, 25.97, 'cash', '2025-12-08 10:30:00'),
(2, 2, 42.95, 'credit_card', '2025-12-08 14:15:00'),
(3, 2, 18.98, 'cash', '2025-12-07 11:45:00'),
(4, 2, 67.92, 'debit_card', '2025-12-06 16:20:00'),
(5, 2, 31.96, 'cash', '2025-12-05 09:10:00');

-- Then sale items
REPLACE INTO sale_item (id, sale_id, product_id, quantity, price) VALUES
(1, 1, 1, 2, 5.99),
(2, 1, 2, 1, 8.99),
(3, 1, 3, 3, 3.99),
(4, 2, 4, 1, 12.99),
(5, 2, 5, 2, 7.99),
(6, 2, 1, 1, 5.99),
(7, 3, 2, 2, 8.99),
(8, 4, 3, 5, 3.99),
(9, 4, 4, 2, 12.99),
(10, 5, 1, 3, 5.99),
(11, 5, 5, 1, 7.99);
