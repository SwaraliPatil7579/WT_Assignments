package com.electricity;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DBConnection {
    // Database credentials matching local MySQL setup
    private static final String HOST_URL = "jdbc:mysql://localhost:3306/?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String DB_URL = "jdbc:mysql://localhost:3306/electricity_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "sql@123";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            initDatabaseSchema();
        } catch (Exception e) {
            System.err.println("DB Connection initialization warning: " + e.getMessage());
        }
    }

    /**
     * Ensures electricity_db and bills table exist in MySQL
     */
    private static void initDatabaseSchema() {
        try (Connection conn = DriverManager.getConnection(HOST_URL, USER, PASSWORD);
             Statement stmt = conn.createStatement()) {
            
            stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS electricity_db");
            stmt.executeUpdate("USE electricity_db");
            
            String createTableSQL = "CREATE TABLE IF NOT EXISTS bills (" +
                    "id INT AUTO_INCREMENT PRIMARY KEY, " +
                    "customer_name VARCHAR(255) NOT NULL, " +
                    "meter_number VARCHAR(100) NOT NULL, " +
                    "billing_month VARCHAR(20) NOT NULL, " +
                    "units_consumed DECIMAL(10, 2) NOT NULL, " +
                    "bill_amount DECIMAL(10, 2) NOT NULL, " +
                    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                    ")";
            stmt.executeUpdate(createTableSQL);
        } catch (SQLException e) {
            System.err.println("Could not auto-create MySQL database or table: " + e.getMessage());
        }
    }

    /**
     * Returns an active Connection to electricity_db
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, USER, PASSWORD);
    }
}
