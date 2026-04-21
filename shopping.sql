DROP DATABASE IF EXISTS shopping_db;

CREATE DATABASE IF NOT EXISTS shopping_db;
USE shopping_db;

DROP TABLE IF EXISTS watchlist;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- role: 0 = USER, 1 = ADMIN
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role INT NOT NULL DEFAULT 0
);

CREATE TABLE products (
    product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    retail_price DOUBLE NOT NULL,
    wholesale_price DOUBLE NOT NULL
);

-- order_status values: 'Processing', 'Completed', 'Canceled'
CREATE TABLE orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date_placed DATETIME(6) NOT NULL,
    order_status VARCHAR(50) NOT NULL DEFAULT 'PROCESSING',
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id)
        REFERENCES users (user_id)
);

-- purchased_price = snapshot of retail_price at time of order
-- wholesale_price = snapshot of wholesale_price at time of order
-- Snapshots prevent price edits from affecting historical orders and profit stats
CREATE TABLE order_items (
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    purchased_price DOUBLE NOT NULL,
    wholesale_price DOUBLE NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id)
        REFERENCES orders (order_id),
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id)
        REFERENCES products (product_id)
);

-- Composite PK prevents duplicate entries per user/product
CREATE TABLE watchlist (
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    PRIMARY KEY (user_id , product_id),
    CONSTRAINT fk_watchlist_user FOREIGN KEY (user_id)
        REFERENCES users (user_id),
    CONSTRAINT fk_watchlist_product FOREIGN KEY (product_id)
        REFERENCES products (product_id)
);

INSERT INTO products (name, description, quantity, retail_price, wholesale_price)
VALUES
('Product1', 'Product1 description', 10, 1200.00, 900.00),
('Product2', 'Product2 description', 20, 800.00, 600.00),
('Product3', 'Product3 description', 15, 200.00, 120.00),
('Product4', 'Product4 description', 25, 150.00, 90.00),
('Product5', 'Product5 description', 30, 80.00, 40.00);
