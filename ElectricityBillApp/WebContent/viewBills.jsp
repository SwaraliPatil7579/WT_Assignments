<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.LinkedHashMap" %>
<%@ page import="com.electricity.Customer" %>
<%@ page import="com.electricity.BillDAO" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Month-Wise Analytics | PowerBill Pro</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --primary: #4f46e5;
            --accent: #06b6d4;
            --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
            --card-bg: rgba(30, 41, 59, 0.75);
            --card-border: rgba(255, 255, 255, 0.1);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }

        body {
            background: var(--bg-gradient);
            color: var(--text-main);
            min-height: 100vh;
            padding: 40px 20px;
        }

        .wrapper {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
            gap: 15px;
        }

        .brand-title {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .brand-title i {
            font-size: 28px;
            color: var(--accent);
        }

        .brand-title h2 {
            font-size: 26px;
            font-weight: 700;
            background: linear-gradient(to right, #ffffff, #a5b4fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .btn-action {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: white;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
            transition: transform 0.2s ease;
        }

        .btn-action:hover {
            transform: translateY(-2px);
        }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            border: 1px solid var(--card-border);
            border-radius: 18px;
            padding: 22px;
            display: flex;
            align-items: center;
            gap: 18px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .stat-icon {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            color: white;
        }

        .stat-info h4 { font-size: 12px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; }
        .stat-info p { font-size: 24px; font-weight: 700; color: #ffffff; margin-top: 4px; }

        /* Chart Section */
        .chart-container {
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            border: 1px solid var(--card-border);
            border-radius: 20px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .chart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .chart-header h3 {
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Controls Section */
        .controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            gap: 15px;
            flex-wrap: wrap;
        }

        .filter-box, .search-box {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 8px 14px;
            border-radius: 12px;
        }

        .filter-box select, .search-box input {
            background: transparent;
            border: none;
            color: white;
            font-size: 14px;
            outline: none;
        }

        .filter-box select option {
            background: #0f172a;
            color: white;
        }

        /* Table */
        .table-card {
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            border: 1px solid var(--card-border);
            border-radius: 20px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }

        th {
            padding: 14px 16px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-muted);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        td {
            padding: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 14px;
            color: #cbd5e1;
        }

        tr:hover td {
            background: rgba(255, 255, 255, 0.03);
            color: #ffffff;
        }

        .month-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            background: rgba(6, 182, 212, 0.15);
            color: #38bdf8;
            border: 1px solid rgba(6, 182, 212, 0.3);
        }

        .amount-text {
            font-weight: 700;
            color: #34d399;
        }

        .no-data {
            text-align: center;
            padding: 40px;
            color: var(--text-muted);
            font-size: 15px;
        }
    </style>
</head>
<body>

<%
    List<Customer> bills = (List<Customer>) request.getAttribute("bills");
    if (bills == null) {
        BillDAO dao = new BillDAO();
        bills = dao.getAllBills();
    }

    // Calculations for summary stats & charts
    int totalCount = 0;
    double totalUnits = 0;
    double totalRevenue = 0;

    // Month-wise aggregated data
    Map<String, Double> monthlyUnitsMap = new LinkedHashMap<>();
    Map<String, Double> monthlyRevenueMap = new LinkedHashMap<>();
    Map<String, Integer> monthlyCountMap = new LinkedHashMap<>();

    if (bills != null) {
        totalCount = bills.size();
        for (Customer c : bills) {
            totalUnits += c.getUnitsConsumed();
            totalRevenue += c.getBillAmount();

            String month = c.getBillingMonth() != null ? c.getBillingMonth() : "2026-08";
            monthlyUnitsMap.put(month, monthlyUnitsMap.getOrDefault(month, 0.0) + c.getUnitsConsumed());
            monthlyRevenueMap.put(month, monthlyRevenueMap.getOrDefault(month, 0.0) + c.getBillAmount());
            monthlyCountMap.put(month, monthlyCountMap.getOrDefault(month, 0) + 1);
        }
    }
    double avgBill = totalCount > 0 ? totalRevenue / totalCount : 0;
%>

    <div class="wrapper">
        <!-- Header -->
        <div class="header">
            <div class="brand-title">
                <i class="fa-solid fa-chart-column"></i>
                <h2>Month-Wise Electricity Analytics</h2>
            </div>
            <a href="index.jsp" class="btn-action">
                <i class="fa-solid fa-plus"></i> Calculate New Bill
            </a>
        </div>

        <!-- Metric Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #4f46e5, #4338ca);">
                    <i class="fa-solid fa-file-invoice-dollar"></i>
                </div>
                <div class="stat-info">
                    <h4>Total Bills</h4>
                    <p><%= totalCount %></p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">
                    <i class="fa-solid fa-bolt"></i>
                </div>
                <div class="stat-info">
                    <h4>Total Consumption</h4>
                    <p><%= String.format("%.1f", totalUnits) %> <span style="font-size: 14px; font-weight: normal; color: var(--text-muted);">kWh</span></p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                    <i class="fa-solid fa-indian-rupee-sign"></i>
                </div>
                <div class="stat-info">
                    <h4>Total Revenue</h4>
                    <p>₹ <%= String.format("%.2f", totalRevenue) %></p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                    <i class="fa-solid fa-calculator"></i>
                </div>
                <div class="stat-info">
                    <h4>Average Bill</h4>
                    <p>₹ <%= String.format("%.2f", avgBill) %></p>
                </div>
            </div>
        </div>

        <!-- Month-Wise Chart -->
        <div class="chart-container">
            <div class="chart-header">
                <h3><i class="fa-solid fa-chart-line" style="color: var(--accent);"></i> Monthly Consumption & Revenue Trend</h3>
            </div>
            <div style="height: 280px; position: relative;">
                <canvas id="monthlyChart"></canvas>
            </div>
        </div>

        <!-- Table & Filter Controls -->
        <div class="controls">
            <div class="filter-box">
                <i class="fa-solid fa-filter" style="color: var(--text-muted);"></i>
                <label style="font-size: 13px; color: var(--text-muted);">Filter Month:</label>
                <select id="monthFilter" onchange="filterTable()">
                    <option value="ALL">All Months</option>
                    <% for (String m : monthlyUnitsMap.keySet()) { %>
                        <option value="<%= m %>"><%= m %></option>
                    <% } %>
                </select>
            </div>

            <div class="search-box">
                <i class="fa-solid fa-magnifying-glass" style="color: var(--text-muted);"></i>
                <input type="text" id="searchInput" placeholder="Search customer or meter..." onkeyup="filterTable()">
            </div>
        </div>

        <!-- Data Table -->
        <div class="table-card">
            <table id="billsTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer Name</th>
                        <th>Meter Number</th>
                        <th>Billing Month</th>
                        <th>Units (kWh)</th>
                        <th>Total Bill (₹)</th>
                        <th>Date Processed</th>
                    </tr>
                </thead>
                <tbody>
                    <% if (bills != null && !bills.isEmpty()) { 
                        for (Customer c : bills) {
                            String m = c.getBillingMonth() != null ? c.getBillingMonth() : "2026-08";
                    %>
                    <tr data-month="<%= m %>">
                        <td>#<%= c.getId() %></td>
                        <td style="font-weight: 600; color: #ffffff;"><%= c.getCustomerName() %></td>
                        <td><i class="fa-solid fa-gauge" style="margin-right: 6px; color: var(--text-muted);"></i><%= c.getMeterNumber() %></td>
                        <td><span class="month-badge"><i class="fa-regular fa-calendar-check" style="margin-right: 4px;"></i><%= m %></span></td>
                        <td><%= String.format("%.2f", c.getUnitsConsumed()) %></td>
                        <td class="amount-text">₹ <%= String.format("%.2f", c.getBillAmount()) %></td>
                        <td style="color: var(--text-muted); font-size: 13px;"><%= c.getBillingDate() != null ? c.getBillingDate() : "N/A" %></td>
                    </tr>
                    <% } } else { %>
                    <tr><td colspan="7" class="no-data"><i class="fa-regular fa-folder-open" style="font-size: 24px; margin-bottom: 8px; display: block;"></i> No electricity bills found.</td></tr>
                    <% } %>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        // Chart Initialization
        const months = [<% 
            boolean first = true;
            for (String m : monthlyUnitsMap.keySet()) {
                if (!first) out.print(",");
                out.print("'" + m + "'");
                first = false;
            }
        %>];

        const unitsData = [<% 
            first = true;
            for (Double u : monthlyUnitsMap.values()) {
                if (!first) out.print(",");
                out.print(u);
                first = false;
            }
        %>];

        const revenueData = [<% 
            first = true;
            for (Double r : monthlyRevenueMap.values()) {
                if (!first) out.print(",");
                out.print(r);
                first = false;
            }
        %>];

        const ctx = document.getElementById('monthlyChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months.length > 0 ? months : ['No Data'],
                datasets: [
                    {
                        label: 'Total Revenue (₹)',
                        data: revenueData.length > 0 ? revenueData : [0],
                        backgroundColor: 'rgba(6, 182, 212, 0.7)',
                        borderColor: '#06b6d4',
                        borderWidth: 2,
                        borderRadius: 6
                    },
                    {
                        label: 'Total Units (kWh)',
                        data: unitsData.length > 0 ? unitsData : [0],
                        backgroundColor: 'rgba(79, 70, 229, 0.7)',
                        borderColor: '#4f46e5',
                        borderWidth: 2,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#cbd5e1' } }
                },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });

        // Filter Table function
        function filterTable() {
            const monthVal = document.getElementById('monthFilter').value;
            const searchVal = document.getElementById('searchInput').value.toLowerCase();
            const rows = document.querySelectorAll('#billsTable tbody tr');

            rows.forEach(row => {
                const rowMonth = row.getAttribute('data-month');
                const rowText = row.innerText.toLowerCase();

                const matchMonth = (monthVal === 'ALL' || rowMonth === monthVal);
                const matchSearch = rowText.includes(searchVal);

                if (matchMonth && matchSearch) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
    </script>
</body>
</html>