<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.text.DecimalFormat" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Date" %>
<%@ page import="com.electricity.BillDAO" %>
<%@ page import="com.electricity.BillRecord" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Electricity Bill Receipt | JSP Calculation Result</title>
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Custom Light Theme CSS -->
    <link rel="stylesheet" href="css/app_light.css">
</head>
<body>

<%
    // Helper formatters
    DecimalFormat df = new DecimalFormat("#,##0.00");
    DecimalFormat unitFormat = new DecimalFormat("#,##0.##");
    SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM yyyy, hh:mm a");

    String customerName = request.getParameter("customerName");
    String meterNumber = request.getParameter("meterNumber");
    String billingMonth = request.getParameter("billingMonth");
    String unitsStr = request.getParameter("units");

    double units = 0;
    boolean hasError = false;
    String errorMessage = "";
    boolean dbSaved = false;

    if (customerName == null || customerName.trim().isEmpty()) {
        customerName = "Valued Customer";
    }
    if (meterNumber == null || meterNumber.trim().isEmpty()) {
        meterNumber = "N/A";
    }
    if (billingMonth == null || billingMonth.trim().isEmpty()) {
        billingMonth = "Current Month";
    }

    try {
        if (unitsStr != null && !unitsStr.trim().isEmpty()) {
            units = Double.parseDouble(unitsStr);
            if (units < 0) {
                hasError = true;
                errorMessage = "Units consumed cannot be negative.";
            }
        } else {
            hasError = true;
            errorMessage = "Please enter valid consumption units.";
        }
    } catch (NumberFormatException e) {
        hasError = true;
        errorMessage = "Invalid numeric value for units consumed.";
    }

    // Slab breakdown calculation logic
    double unitsSlab1 = 0, unitsSlab2 = 0, unitsSlab3 = 0, unitsSlab4 = 0;
    double rateSlab1 = 3.50, rateSlab2 = 4.00, rateSlab3 = 5.20, rateSlab4 = 6.50;
    double amountSlab1 = 0, amountSlab2 = 0, amountSlab3 = 0, amountSlab4 = 0;
    double totalAmount = 0;

    if (!hasError) {
        // Slab 1: First 50 units (0 - 50) @ Rs. 3.50
        unitsSlab1 = Math.min(units, 50.0);
        amountSlab1 = unitsSlab1 * rateSlab1;

        // Slab 2: Next 100 units (51 - 150) @ Rs. 4.00
        if (units > 50) {
            unitsSlab2 = Math.min(units - 50.0, 100.0);
            amountSlab2 = unitsSlab2 * rateSlab2;
        }

        // Slab 3: Next 100 units (151 - 250) @ Rs. 5.20
        if (units > 150) {
            unitsSlab3 = Math.min(units - 150.0, 100.0);
            amountSlab3 = unitsSlab3 * rateSlab3;
        }

        // Slab 4: Above 250 units (> 250) @ Rs. 6.50
        if (units > 250) {
            unitsSlab4 = units - 250.0;
            amountSlab4 = unitsSlab4 * rateSlab4;
        }

        totalAmount = amountSlab1 + amountSlab2 + amountSlab3 + amountSlab4;

        // Persist calculated record to Database with fully qualified class references
        try {
            com.electricity.BillRecord billObj = new com.electricity.BillRecord(0, customerName, meterNumber, billingMonth, units, totalAmount, null);
            com.electricity.BillDAO dao = new com.electricity.BillDAO();
            dbSaved = dao.saveBill(billObj);
        } catch (Throwable ex) {
            System.err.println("DB Persist note: " + ex.getMessage());
        }
    }
%>

    <div class="main-wrapper">
        <div class="invoice-wrapper">
            <div class="glass-card">
                
                <% if (hasError) { %>
                    <!-- Error View -->
                    <div style="text-align: center; padding: 40px 20px;">
                        <i class="fa-solid fa-triangle-exclamation" style="font-size: 48px; color: #dc2626; margin-bottom: 16px;"></i>
                        <h2 style="color: #0f172a; font-size: 24px; margin-bottom: 8px;">Calculation Error</h2>
                        <p style="color: #64748b; margin-bottom: 24px;"><%= errorMessage %></p>
                        <a href="index.jsp" class="btn-secondary">
                            <i class="fa-solid fa-arrow-left"></i>
                            <span>Return to Calculator</span>
                        </a>
                    </div>
                <% } else { %>
                    <!-- Official Invoice View -->
                    <div class="invoice-header">
                        <div class="company-logo">
                            <i class="fa-solid fa-bolt-lightning"></i>
                            <div>
                                <h2>PowerBill Utilities</h2>
                                <p style="font-size: 12px; color: var(--text-muted);">Electricity Invoice Statement</p>
                            </div>
                        </div>

                        <div class="invoice-status-badge">
                            <i class="fa-solid fa-circle-check"></i>
                            <span>Bill Calculated</span>
                        </div>
                    </div>

                    <!-- DB Status Notice -->
                    <% if (dbSaved) { %>
                        <div class="db-status-badge">
                            <i class="fa-solid fa-database" style="color: #2563eb;"></i>
                            <span>Bill record successfully saved to MySQL database (<code>electricity_db.bills</code>)</span>
                        </div>
                    <% } else { %>
                        <div class="db-status-badge" style="background: #fef3c7; border-color: #fde68a; color: #92400e;">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <span>Bill calculated (Database connection note: start MySQL on port 3306 to persist records)</span>
                        </div>
                    <% } %>

                    <!-- Customer & Meter Meta -->
                    <div class="customer-meta-grid">
                        <div class="meta-item">
                            <span class="meta-label">Customer Name</span>
                            <span class="meta-val"><%= customerName %></span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Meter Number</span>
                            <span class="meta-val"><%= meterNumber %></span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Billing Cycle</span>
                            <span class="meta-val"><%= billingMonth %></span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Generated On</span>
                            <span class="meta-val" style="font-size: 13px;"><%= dateFormat.format(new Date()) %></span>
                        </div>
                    </div>

                    <!-- Itemized Breakdown Table -->
                    <h3 style="color: var(--text-heading); font-size: 16px; margin-bottom: 14px;">
                        <i class="fa-solid fa-list-ol" style="color: #2563eb;"></i> Slab Wise Charge Decomposition
                    </h3>

                    <table class="breakdown-table">
                        <thead>
                            <tr>
                                <th>Tariff Slab Tier</th>
                                <th>Applicable Rate</th>
                                <th>Billed Units</th>
                                <th style="text-align: right;">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div class="slab-indicator s1"></div>
                                        <span>First 50 Units (0 - 50)</span>
                                    </div>
                                </td>
                                <td>₹ 3.50 / unit</td>
                                <td class="num-cell"><%= unitFormat.format(unitsSlab1) %> kWh</td>
                                <td class="num-cell" style="text-align: right;">₹ <%= df.format(amountSlab1) %></td>
                            </tr>
                            <tr>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div class="slab-indicator s2"></div>
                                        <span>Next 100 Units (51 - 150)</span>
                                    </div>
                                </td>
                                <td>₹ 4.00 / unit</td>
                                <td class="num-cell"><%= unitFormat.format(unitsSlab2) %> kWh</td>
                                <td class="num-cell" style="text-align: right;">₹ <%= df.format(amountSlab2) %></td>
                            </tr>
                            <tr>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div class="slab-indicator s3"></div>
                                        <span>Next 100 Units (151 - 250)</span>
                                    </div>
                                </td>
                                <td>₹ 5.20 / unit</td>
                                <td class="num-cell"><%= unitFormat.format(unitsSlab3) %> kWh</td>
                                <td class="num-cell" style="text-align: right;">₹ <%= df.format(amountSlab3) %></td>
                            </tr>
                            <tr>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div class="slab-indicator s4"></div>
                                        <span>Above 250 Units (> 250)</span>
                                    </div>
                                </td>
                                <td>₹ 6.50 / unit</td>
                                <td class="num-cell"><%= unitFormat.format(unitsSlab4) %> kWh</td>
                                <td class="num-cell" style="text-align: right;">₹ <%= df.format(amountSlab4) %></td>
                            </tr>
                            <tr class="table-total-row">
                                <td colspan="2">TOTAL CONSUMPTION & BILL AMOUNT</td>
                                <td class="num-cell" style="color: #1d4ed8;"><%= unitFormat.format(units) %> kWh</td>
                                <td class="grand-total-amount" style="text-align: right;">₹ <%= df.format(totalAmount) %></td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Action Bar -->
                    <div class="action-bar">
                        <div style="display: flex; gap: 10px;">
                            <a href="index.jsp" class="btn-secondary">
                                <i class="fa-solid fa-plus"></i>
                                <span>New Bill</span>
                            </a>
                            <a href="history.jsp" class="btn-secondary">
                                <i class="fa-solid fa-clock-rotate-left"></i>
                                <span>Saved History</span>
                            </a>
                        </div>

                        <button type="button" class="btn-primary" style="width: auto; padding: 12px 24px;" onclick="printInvoice()">
                            <i class="fa-solid fa-print"></i>
                            <span>Print / Save Invoice</span>
                        </button>
                    </div>
                <% } %>

            </div>
        </div>

        <footer class="app-footer">
            <p>Generated by JSP Electricity Billing System</p>
        </footer>
    </div>

    <!-- Custom JS -->
    <script src="js/main.js"></script>
</body>
</html>
