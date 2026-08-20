<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.electricity.Customer" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bill Receipt | PowerBill Pro</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #4f46e5;
            --accent: #06b6d4;
            --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
            --card-bg: rgba(30, 41, 59, 0.7);
            --card-border: rgba(255, 255, 255, 0.1);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }

        body {
            background: var(--bg-gradient);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px 15px;
        }

        .receipt-card {
            width: 100%;
            max-width: 520px;
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--card-border);
            border-radius: 24px;
            padding: 35px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .header {
            text-align: center;
            margin-bottom: 25px;
        }

        .icon-badge {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            color: white;
            margin: 0 auto 15px;
            box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        }

        .header h2 { font-size: 22px; font-weight: 700; color: #ffffff; }
        .header p { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

        .status-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            margin-top: 10px;
        }
        .status-success { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
        .status-error { background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); }

        .details-box {
            background: rgba(15, 23, 42, 0.6);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 20px;
            margin: 25px 0;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            font-size: 14px;
        }

        .detail-row:last-child { border-bottom: none; }

        .label { color: var(--text-muted); }
        .value { font-weight: 600; color: #f1f5f9; }

        .total-row {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px dashed rgba(6, 182, 212, 0.4);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .total-label { font-size: 16px; font-weight: 700; color: #ffffff; }
        .total-amount { font-size: 26px; font-weight: 800; color: #38bdf8; }

        .actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 25px;
        }

        .btn {
            padding: 12px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: white;
            border: none;
            box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.08);
            color: #cbd5e1;
            border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .btn:hover { transform: translateY(-2px); opacity: 0.95; }

        @media print {
            body { background: white; color: black; }
            .receipt-card { background: white; border: none; box-shadow: none; color: black; }
            .actions { display: none; }
            .details-box { background: #f8fafc; border: 1px solid #ddd; }
            .detail-row { border-color: #eee; }
            .label { color: #555; }
            .value { color: #000; }
            .total-amount { color: #000; }
        }
    </style>
</head>
<body>

    <%
        Customer customer = (Customer) request.getAttribute("customer");
        Boolean savedObj = (Boolean) request.getAttribute("saved");
        boolean saved = savedObj != null && savedObj;
    %>

    <div class="receipt-card">
        <% if (customer == null) { %>
            <div class="header">
                <div class="icon-badge" style="background: #ef4444;"><i class="fa-solid fa-triangle-exclamation"></i></div>
                <h2>No Bill Data Found</h2>
                <p>Please submit the electricity bill form first.</p>
            </div>
            <div class="actions" style="grid-template-columns: 1fr;">
                <a href="index.jsp" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i> Back to Calculator</a>
            </div>
        <% } else { %>
            <div class="header">
                <div class="icon-badge"><i class="fa-solid fa-receipt"></i></div>
                <h2>Electricity Bill Receipt</h2>
                <p>Generated Official Bill Statement</p>
                <% if (saved) { %>
                    <div class="status-pill status-success"><i class="fa-solid fa-circle-check"></i> Saved to Database</div>
                <% } else { %>
                    <div class="status-pill status-error"><i class="fa-solid fa-circle-xmark"></i> Failed to Save</div>
                <% } %>
            </div>

            <div class="details-box">
                <div class="detail-row">
                    <span class="label">Customer Name</span>
                    <span class="value"><%= customer.getCustomerName() != null ? customer.getCustomerName() : "N/A" %></span>
                </div>
                <div class="detail-row">
                    <span class="label">Meter Number</span>
                    <span class="value"><%= customer.getMeterNumber() != null ? customer.getMeterNumber() : "N/A" %></span>
                </div>
                <div class="detail-row">
                    <span class="label">Billing Month</span>
                    <span class="value" style="color: #a78bfa;"><%= customer.getBillingMonth() != null ? customer.getBillingMonth() : "2026-08" %></span>
                </div>
                <div class="detail-row">
                    <span class="label">Units Consumed</span>
                    <span class="value"><%= String.format("%.2f", customer.getUnitsConsumed()) %> kWh</span>
                </div>
                <div class="detail-row">
                    <span class="label">Fixed Meter Charge</span>
                    <span class="value">₹ 50.00</span>
                </div>
                <div class="total-row">
                    <span class="total-label">Total Amount Due</span>
                    <span class="total-amount">₹ <%= String.format("%.2f", customer.getBillAmount()) %></span>
                </div>
            </div>

            <div class="actions">
                <button onclick="window.print()" class="btn btn-secondary"><i class="fa-solid fa-print"></i> Print Receipt</button>
                <a href="viewBills" class="btn btn-primary"><i class="fa-solid fa-chart-line"></i> View History</a>
            </div>

            <div style="text-align: center; margin-top: 15px;">
                <a href="index.jsp" style="color: var(--text-muted); font-size: 13px; text-decoration: none;">+ Calculate Another Bill</a>
            </div>
        <% } %>
    </div>

</body>
</html>