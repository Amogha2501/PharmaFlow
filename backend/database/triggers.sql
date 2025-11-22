-- Trigger: trg_after_sale_item_insert
-- After inserting a sale item: reduce product stock, prevent negative stock, create a low-stock alert when necessary
DELIMITER //
CREATE TRIGGER trg_after_sale_item_insert
AFTER INSERT ON sale_item
FOR EACH ROW
BEGIN
    DECLARE v_new_quantity INT;
    DECLARE v_reorder_level INT;
    
    -- Reduce product stock
    UPDATE product 
    SET quantity = quantity - NEW.quantity
    WHERE id = NEW.product_id;
    
    -- Check if stock went below reorder level
    SELECT quantity, reorder_level INTO v_new_quantity, v_reorder_level
    FROM product
    WHERE id = NEW.product_id;
    
    -- Create low stock alert if necessary
    IF v_new_quantity <= v_reorder_level THEN
        INSERT INTO low_stock_alert (product_id)
        VALUES (NEW.product_id);
    END IF;
END //
DELIMITER ;

-- Trigger: trg_prevent_negative_stock
-- Before updating a product, block updates that would cause negative stock
DELIMITER //
CREATE TRIGGER trg_prevent_negative_stock
BEFORE UPDATE ON product
FOR EACH ROW
BEGIN
    IF NEW.quantity < 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cannot update product stock to negative value';
    END IF;
END //
DELIMITER ;

-- Trigger: trg_low_stock_on_product_update
-- After updating a product, if stock falls below or equals reorder level, insert a low-stock alert
DELIMITER //
CREATE TRIGGER trg_low_stock_on_product_update
AFTER UPDATE ON product
FOR EACH ROW
BEGIN
    -- Check if stock fell below or equals reorder level
    IF NEW.quantity <= NEW.reorder_level AND 
       (OLD.quantity > OLD.reorder_level OR OLD.quantity IS NULL) THEN
        INSERT INTO low_stock_alert (product_id)
        VALUES (NEW.id);
    END IF;
END //
DELIMITER ;

-- Trigger: trg_check_expired_stock
-- After adding or updating a product, if it is expired, log it into an expiry log table
DELIMITER //
CREATE TRIGGER trg_check_expired_stock
AFTER INSERT ON product
FOR EACH ROW
BEGIN
    IF NEW.expiry_date < CURDATE() THEN
        INSERT INTO expiry_log (product_id, expiry_date)
        VALUES (NEW.id, NEW.expiry_date);
    END IF;
END //
DELIMITER ;

-- Also create a trigger for updates
DELIMITER //
CREATE TRIGGER trg_check_expired_stock_update
AFTER UPDATE ON product
FOR EACH ROW
BEGIN
    IF NEW.expiry_date < CURDATE() THEN
        IF NOT EXISTS (SELECT 1 FROM expiry_log WHERE product_id = NEW.id) THEN
            INSERT INTO expiry_log (product_id, expiry_date)
            VALUES (NEW.id, NEW.expiry_date);
        END IF;
    END IF;
END //
DELIMITER ;