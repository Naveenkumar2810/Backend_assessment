-- Staff table creation

CREATE TABLE system_users (
    id INT AUTO_INCREMENT UNIQUE,
    uniq_id VARCHAR(70) PRIMARY KEY, 
    name VARCHAR(40),
    role VARCHAR(30) DEFAULT 'staff',
    is_super_admin BOOLEAN DEFAULT FALSE, 
    is_active BOOLEAN DEFAULT TRUE,
    password VARCHAR(100) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- users table creation

CREATE TABLE user_records (
    id INT AUTO_INCREMENT UNIQUE,
    uniq_id VARCHAR(40) PRIMARY KEY, 
    name VARCHAR(40),
    mobile_number BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    password VARCHAR(100) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendor table creation

CREATE TABLE vendor_records (
    id INT AUTO_INCREMENT UNIQUE,
    uniq_id VARCHAR(40) PRIMARY KEY, 
    name VARCHAR(40),
    shop_name VARCHAR(40),
    location VARCHAR(40),
    mobile_number BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    password VARCHAR(100) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
