package com.electricity;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BillDAO {

    /**
     * Saves a calculated electricity bill record to MySQL database
     */
    public boolean saveBill(BillRecord bill) {
        String sql = "INSERT INTO bills (customer_name, meter_number, billing_month, units_consumed, bill_amount) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setString(1, bill.getCustomerName());
            pstmt.setString(2, bill.getMeterNumber());
            pstmt.setString(3, bill.getBillingMonth());
            pstmt.setDouble(4, bill.getUnitsConsumed());
            pstmt.setDouble(5, bill.getBillAmount());

            int rows = pstmt.executeUpdate();
            if (rows > 0) {
                try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        bill.setId(generatedKeys.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("Error saving bill to database: " + e.getMessage());
        }
        return false;
    }

    /**
     * Retrieves all saved bills ordered by creation date
     */
    public List<BillRecord> getAllBills() {
        List<BillRecord> list = new ArrayList<>();
        String sql = "SELECT id, customer_name, meter_number, billing_month, units_consumed, bill_amount, created_at FROM bills ORDER BY created_at DESC LIMIT 50";
        
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                BillRecord bill = new BillRecord(
                    rs.getInt("id"),
                    rs.getString("customer_name"),
                    rs.getString("meter_number"),
                    rs.getString("billing_month"),
                    rs.getDouble("units_consumed"),
                    rs.getDouble("bill_amount"),
                    rs.getTimestamp("created_at")
                );
                list.add(bill);
            }
        } catch (SQLException e) {
            System.err.println("Error fetching bills from database: " + e.getMessage());
        }
        return list;
    }
}
