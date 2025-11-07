CREATE DATABASE IF NOT EXISTS sqlinject_demo;
USE sqlinject_demo;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password) VALUES 
('admin', 'password123'),
('user', 'secret'),
('test', 'test123'),
('demo', 'demo');
