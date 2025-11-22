-- Procedure: AddNewSale
-- Inserts a new sale and returns its ID
DELIMITER //
CREATE PROCEDURE AddNewSale(
    IN p_user_id INT,
    IN p_total_amount DECIMAL(10, 2),
    IN p_payment_method ENUM('cash', 'credit_card', 'debit_card')
)
BEGIN
    INSERT INTO sale (user_id, total_amount, payment_method)
    VALUES (p_user_id, p_total_amount, p_payment_method);
    
    SELECT LAST_INSERT_ID() AS sale_id;
END //
DELIMITER ;

-- Procedure: AddSaleItem
-- Inserts a sale item, calculates the line total, and updates product stock
DELIMITER //
CREATE PROCEDURE AddSaleItem(
    IN p_sale_id INT,
    IN p_product_id INT,
    IN p_quantity INT,
    IN p_price DECIMAL(10, 2)
)
BEGIN
    DECLARE v_line_total DECIMAL(10, 2);
    
    SET v_line_total = p_quantity * p_price;
    
    INSERT INTO sale_item (sale_id, product_id, quantity, price)
    VALUES (p_sale_id, p_product_id, p_quantity, p_price);
    
    -- Update product stock
    UPDATE product 
    SET quantity = quantity - p_quantity 
    WHERE id = p_product_id;
    
    SELECT v_line_total AS line_total;
END //
DELIMITER ;

-- Procedure: UpdateStockAfterSale
-- Reduces stock for a product and prevents negative stock
DELIMITER //
CREATE PROCEDURE UpdateStockAfterSale(
    IN p_product_id INT,
    IN p_quantity_sold INT
)
BEGIN
    DECLARE v_current_stock INT;
    DECLARE v_new_stock INT;
    
    SELECT quantity INTO v_current_stock 
    FROM product 
    WHERE id = p_product_id;
    
    SET v_new_stock = v_current_stock - p_quantity_sold;
    
    IF v_new_stock < 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Insufficient stock: Cannot reduce stock below zero';
    ELSE
        UPDATE product 
        SET quantity = v_new_stock 
        WHERE id = p_product_id;
    END IF;
END //
DELIMITER ;

-- Procedure: GetDailySalesSummary
-- Returns daily totals such as number of sales, revenue, tax, discounts, etc.
DELIMITER //
CREATE PROCEDURE GetDailySalesSummary(
    IN p_date DATE
)
BEGIN
    SELECT 
        COUNT(*) AS total_sales,
        COALESCE(SUM(total_amount), 0) AS total_revenue,
        p_date AS sale_date
    FROM sale 
    WHERE DATE(created_at) = p_date;
END //
DELIMITER ;

-- Procedure: GetLowStockProducts
-- Returns a list of low-stock products
DELIMITER //
CREATE PROCEDURE GetLowStockProducts()
BEGIN
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
    ORDER BY quantity ASC;
END //
DELIMITER ;

-- Procedure: GetExpiredProducts
-- Returns expired products
DELIMITER //
CREATE PROCEDURE GetExpiredProducts()
BEGIN
    SELECT 
        id,
        name,
        description,
        price,
        quantity,
        reorder_level,
        expiry_date
    FROM product
    WHERE expiry_date < CURDATE()
    ORDER BY expiry_date ASC;
END //
DELIMITER ;

-- Procedure: RegisterUser
-- Inserts a new user into the database
DELIMITER //
CREATE PROCEDURE RegisterUser(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_role ENUM('admin', 'clerk')
)
BEGIN
    INSERT INTO user_account (name, email, password, role)
    VALUES (p_name, p_email, p_password, p_role);
    
    SELECT LAST_INSERT_ID() AS user_id;
END //
DELIMITER ;
