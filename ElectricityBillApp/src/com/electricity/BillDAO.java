package com.electricity;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class BillDAO {
    
    public BillDAO() {
        ensureSchema();
    }
    
    private void ensureSchema() {
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement()) {
            
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS customers (" +
                    "id INT AUTO_INCREMENT PRIMARY KEY, " +
                    "customer_name VARCHAR(255) NOT NULL, " +
                    "meter_number VARCHAR(100) NOT NULL, " +
                    "billing_month VARCHAR(20) DEFAULT '2026-08', " +
                    "units_consumed DECIMAL(10, 2) NOT NULL, " +
                    "bill_amount DECIMAL(10, 2) NOT NULL, " +
                    "billing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
            
            try {
                stmt.executeUpdate("ALTER TABLE customers ADD COLUMN billing_month VARCHAR(20) DEFAULT '2026-08'");
            } catch (SQLException ignored) {
                // Column already exists
            }
        } catch (SQLException e) {
            // Log schema check notice
        }
    }
    
    public boolean saveBill(Customer customer) {
        String sql = "INSERT INTO customers (customer_name, meter_number, billing_month, units_consumed, bill_amount) VALUES (?, ?, ?, ?, ?)";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, customer.getCustomerName());
            ps.setString(2, customer.getMeterNumber());
            ps.setString(3, customer.getBillingMonth() != null && !customer.getBillingMonth().trim().isEmpty() ? customer.getBillingMonth() : "2026-08");
            ps.setDouble(4, customer.getUnitsConsumed());
            ps.setDouble(5, customer.getBillAmount());
            
            return ps.executeUpdate() > 0;
            
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public List<Customer> getAllBills() {
        List<Customer> bills = new ArrayList<>();
        String sql = "SELECT * FROM customers ORDER BY id DESC";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                Customer c = new Customer();
                c.setId(rs.getInt("id"));
                c.setCustomerName(rs.getString("customer_name"));
                c.setMeterNumber(rs.getString("meter_number"));
                try {
                    String month = rs.getString("billing_month");
                    c.setBillingMonth(month != null ? month : "2026-08");
                } catch (SQLException e) {
                    c.setBillingMonth("2026-08");
                }
                c.setUnitsConsumed(rs.getDouble("units_consumed"));
                c.setBillAmount(rs.getDouble("bill_amount"));
                c.setBillingDate(rs.getString("billing_date"));
                bills.add(c);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return bills;
    }
}