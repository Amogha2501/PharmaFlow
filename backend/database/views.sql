-- View: view_product_inventory
-- Shows product inventory with supplier information
CREATE VIEW view_product_inventory AS
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
LEFT JOIN supplier s ON p.supplier_id = s.id;

-- View: view_sales_summary
-- Shows each sale with basic sale information and the user who handled it
CREATE VIEW view_sales_summary AS
SELECT 
    s.id,
    s.total_amount,
    s.payment_method,
    s.created_at,
    u.name AS clerk_name,
    u.email AS clerk_email
FROM sale s
JOIN user_account u ON s.user_id = u.id;

-- View: view_product_sales
-- Shows total quantity sold and total revenue for each product
CREATE VIEW view_product_sales AS
SELECT 
    p.id,
    p.name,
    COALESCE(SUM(si.quantity), 0) AS total_quantity_sold,
    COALESCE(SUM(si.quantity * si.price), 0) AS total_revenue
FROM product p
LEFT JOIN sale_item si ON p.id = si.product_id
GROUP BY p.id, p.name;

-- View: view_low_stock
-- Shows products that are at or below their reorder level
CREATE VIEW view_low_stock AS
SELECT 
    id,
    name,
    description,
    price,
    quantity,
    reorder_level,
    expiry_date
FROM product
WHERE quantity <= reorder_level;
