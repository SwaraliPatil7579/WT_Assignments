-- Electricity Bill Calculator Database Schema

CREATE DATABASE IF NOT EXISTS `swarali`;
USE `swarali`;

CREATE TABLE IF NOT EXISTS `bills` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `month` VARCHAR(20) NOT NULL,
    `year` INT NOT NULL,
    `units` DECIMAL(10,2) NOT NULL,
    `total_amount` DECIMAL(10,2) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
