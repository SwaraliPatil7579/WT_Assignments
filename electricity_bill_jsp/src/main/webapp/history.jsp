<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="java.text.DecimalFormat" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="com.electricity.BillDAO" %>
<%@ page import="com.electricity.BillRecord" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saved Bills History | Electricity Bill Calculator</title>
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Custom Light Theme CSS -->
    <link rel="stylesheet" href="css/app_light.css">
</head>
<body>

<%
    DecimalFormat df = new DecimalFormat("#,##0.00");
    DecimalFormat unitFormat = new DecimalFormat("#,##0.##");
    SimpleDateFormat sdf = new SimpleDateFormat("dd MMM yyyy, hh:mm a");

    List<com.electricity.BillRecord> historyList = null;
    boolean dbError = false;

    try {
        com.electricity.BillDAO dao = new com.electricity.BillDAO();
        historyList = dao.getAllBills();
    } catch (Throwable e) {
        dbError = true;
    }
%>

    <div class="main-wrapper" style="max-width: 950px;">
        <div class="glass-card">
            <div class="invoice-header">
                <div class="company-logo">
                    <i class="fa-solid fa-clock-rotate-left" style="color: #2563eb;"></i>
                    <div>
                        <h2>Saved Bills History</h2>
                        <p style="font-size: 12px; color: var(--text-muted);">Database Records from MySQL (<code>electricity_db.bills</code>)</p>
                    </div>
                </div>

                <a href="index.jsp" class="btn-secondary">
                    <i class="fa-solid fa-plus"></i>
                    <span>Calculate New Bill</span>
                </a>
            </div>

            <% if (dbError || historyList == null) { %>
                <div style="text-align: center; padding: 40px 20px;">
                    <i class="fa-solid fa-database" style="font-size: 40px; color: #94a3b8; margin-bottom: 12px;"></i>
                    <h3 style="color: #0f172a; margin-bottom: 6px;">Database Connection Status</h3>
                    <p style="color: #64748b;">Ensure MySQL is running on localhost:3306 with database <code>electricity_db</code>.</p>
                </div>
            <% } else if (historyList.isEmpty()) { %>
                <div style="text-align: center; padding: 40px 20px;">
                    <i class="fa-solid fa-folder-open" style="font-size: 40px; color: #94a3b8; margin-bottom: 12px;"></i>
                    <h3 style="color: #0f172a; margin-bottom: 6px;">No Bills Recorded Yet</h3>
                    <p style="color: #64748b; margin-bottom: 20px;">Calculate a bill using the form to automatically save records here.</p>
                    <a href="index.jsp" class="btn-primary" style="display: inline-flex; width: auto; padding: 10px 20px;">
                        <i class="fa-solid fa-calculator"></i>
                        <span>Go to Calculator</span>
                    </a>
                </div>
            <% } else { %>
                <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
                    Showing latest <strong><%= historyList.size() %></strong> saved bill transactions:
                </p>

                <table class="history-table">
                    <thead>
                        <tr>
                            <th># ID</th>
                            <th>Customer Name</th>
                            <th>Meter No.</th>
                            <th>Billing Month</th>
                            <th>Units Billed</th>
                            <th style="text-align: right;">Bill Amount</th>
                            <th>Created Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        <% for (com.electricity.BillRecord b : historyList) { %>
                            <tr>
                                <td class="num-cell" style="color: #64748b;">#<%= b.getId() %></td>
                                <td style="font-weight: 700; color: #0f172a;"><%= b.getCustomerName() %></td>
                                <td><code><%= b.getMeterNumber() %></code></td>
                                <td><%= b.getBillingMonth() %></td>
                                <td class="num-cell"><%= unitFormat.format(b.getUnitsConsumed()) %> kWh</td>
                                <td class="num-cell" style="text-align: right; font-weight: 800; color: #0284c7;">₹ <%= df.format(b.getBillAmount()) %></td>
                                <td style="font-size: 12px; color: #64748b;"><%= b.getCreatedAt() != null ? sdf.format(b.getCreatedAt()) : "N/A" %></td>
                            </tr>
                        <% } %>
                    </tbody>
                </table>
            <% } %>

            <div class="action-bar">
                <a href="index.jsp" class="btn-secondary">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>Back to Calculator</span>
                </a>
            </div>
        </div>

        <footer class="app-footer">
            <p>JSP Electricity Bill Management System</p>
        </footer>
    </div>

</body>
</html>
