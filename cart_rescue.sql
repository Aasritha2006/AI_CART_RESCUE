CREATE DATABASE IF NOT EXISTS cart_rescue;
USE cart_rescue;

CREATE TABLE IF NOT EXISTS customers (
 customer_id VARCHAR(30) PRIMARY KEY, name VARCHAR(100) NOT NULL,
 total_purchases DECIMAL(12,2) DEFAULT 0, orders INT DEFAULT 0,
 preferred_payment VARCHAR(30) DEFAULT 'UPI', purchase_intent INT DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carts (
 cart_id INT AUTO_INCREMENT PRIMARY KEY, customer_id VARCHAR(30) NOT NULL,
 quantity INT DEFAULT 1, subtotal DECIMAL(12,2) DEFAULT 0,
 shipping DECIMAL(12,2) DEFAULT 0, discount DECIMAL(12,2) DEFAULT 0,
 total_amount DECIMAL(12,2) DEFAULT 0,
 status ENUM('ACTIVE','ABANDONED','RECOVERED') DEFAULT 'ABANDONED',
 abandoned_at DATETIME DEFAULT CURRENT_TIMESTAMP, recovered_at DATETIME NULL,
 FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE IF NOT EXISTS rescue_actions (
 action_id INT AUTO_INCREMENT PRIMARY KEY, cart_id INT NULL,
 customer_id VARCHAR(30) NOT NULL, scenario VARCHAR(30) NOT NULL,
 problem VARCHAR(150) NOT NULL, recommended_action VARCHAR(150) NOT NULL,
 confidence INT DEFAULT 0,
 result ENUM('Pending','Rescued','Recovered') DEFAULT 'Pending',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE SET NULL,
 FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE IF NOT EXISTS notifications (
 notification_id INT AUTO_INCREMENT PRIMARY KEY, customer_id VARCHAR(30) NOT NULL,
 message TEXT NOT NULL, status VARCHAR(30) DEFAULT 'sent',
 sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

INSERT INTO customers (customer_id,name,total_purchases,orders,preferred_payment,purchase_intent)
VALUES ('CR-1024','Returning Customer',18450,8,'UPI',92),
('CR-1021','Priya Customer',12500,5,'COD',84),
('CR-1019','Rahul Customer',9200,4,'UPI',88),
('CR-1017','Demo Customer',6800,3,'CARD',76)
ON DUPLICATE KEY UPDATE customer_id=VALUES(customer_id);

INSERT INTO carts (customer_id,quantity,subtotal,shipping,discount,total_amount,status)
VALUES ('CR-1024',1,2499,99,0,2598,'ABANDONED'),
('CR-1021',2,4998,99,0,5097,'ABANDONED'),
('CR-1019',1,2499,99,0,2598,'RECOVERED'),
('CR-1017',1,2499,99,165,2433,'ABANDONED');

INSERT INTO rescue_actions (customer_id,scenario,problem,recommended_action,confidence,result)
VALUES ('CR-1024','payment','Payment failed','Retry payment',94,'Rescued'),
('CR-1021','shipping','High shipping cost','Reduce shipping cost',89,'Rescued'),
('CR-1019','delivery','Delivery date is too late','Offer express delivery',91,'Recovered'),
('CR-1017','price','Customer is price checking','Personalized offer',78,'Pending');
