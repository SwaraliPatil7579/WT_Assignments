-- Database Schema for ElectricityBillApp

CREATE DATABASE IF NOT EXISTS electricity_db;
USE electricity_db;

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    meter_number VARCHAR(100) NOT NULL,
    billing_month VARCHAR(20) NOT NULL,
    units_consumed DECIMAL(10, 2) NOT NULL,
    bill_amount DECIMAL(10, 2) NOT NULL,
    billing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
