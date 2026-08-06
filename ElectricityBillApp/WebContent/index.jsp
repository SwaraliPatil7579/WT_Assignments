<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PowerBill Pro | Electricity Bill Calculator</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #4f46e5;
            --primary-hover: #4338ca;
            --accent: #06b6d4;
            --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
            --card-bg: rgba(30, 41, 59, 0.7);
            --card-border: rgba(255, 255, 255, 0.1);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --input-bg: rgba(15, 23, 42, 0.6);
            --input-border: rgba(255, 255, 255, 0.15);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
        }

        body {
            background: var(--bg-gradient);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px 15px;
        }

        .container {
            width: 100%;
            max-width: 1050px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }

        @media (max-width: 900px) {
            .container { grid-template-columns: 1fr; }
        }

        .card {
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--card-border);
            border-radius: 20px;
            padding: 35px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 25px;
        }

        .brand-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            color: white;
            box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
        }

        .brand-text h1 {
            font-size: 24px;
            font-weight: 700;
            background: linear-gradient(to right, #ffffff, #a5b4fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .brand-text p {
            font-size: 13px;
            color: var(--text-muted);
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #cbd5e1;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .input-wrapper {
            position: relative;
        }

        .input-wrapper i {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            font-size: 15px;
        }

        input {
            width: 100%;
            padding: 12px 16px 12px 42px;
            background: var(--input-bg);
            border: 1px solid var(--input-border);
            border-radius: 12px;
            color: white;
            font-size: 15px;
            transition: all 0.3s ease;
        }

        input:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.25);
            background: rgba(15, 23, 42, 0.8);
        }

        .btn-submit {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            border: none;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4);
            margin-top: 10px;
        }

        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px rgba(79, 70, 229, 0.6);
        }

        .nav-link-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-top: 18px;
            color: var(--accent);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: color 0.2s;
        }

        .nav-link-btn:hover {
            color: #67e8f9;
            text-decoration: underline;
        }

        /* Right panel / Slab info */
        .info-panel {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .slab-card {
            background: rgba(15, 23, 42, 0.5);
            border-radius: 14px;
            padding: 20px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            margin-bottom: 20px;
        }

        .slab-card h3 {
            font-size: 16px;
            color: #e2e8f0;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .slab-list {
            list-style: none;
        }

        .slab-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            font-size: 14px;
        }

        .slab-item:last-child {
            border-bottom: none;
        }

        .slab-range { color: var(--text-muted); }
        .slab-rate { font-weight: 600; color: #38bdf8; }

        .live-preview {
            background: linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(6, 182, 212, 0.2));
            border: 1px dashed rgba(6, 182, 212, 0.4);
            border-radius: 14px;
            padding: 20px;
            text-align: center;
        }

        .preview-title {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-muted);
        }

        .preview-amount {
            font-size: 32px;
            font-weight: 700;
            color: #38bdf8;
            margin: 8px 0;
        }

        .error-msg {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.4);
            color: #fca5a5;
            padding: 12px 16px;
            border-radius: 12px;
            margin-bottom: 20px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
    </style>
</head>
<body>

    <div class="container">
        <!-- Form Section -->
        <div class="card">
            <div class="brand">
                <div class="brand-icon">
                    <i class="fa-solid fa-bolt"></i>
                </div>
                <div class="brand-text">
                    <h1>PowerBill Pro</h1>
                    <p>Smart Electricity Bill Calculator</p>
                </div>
            </div>

            <%
                String errorMessage = (String) request.getAttribute("errorMessage");
                if (errorMessage != null && !errorMessage.isEmpty()) {
            %>
                <div class="error-msg">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <span><%= errorMessage %></span>
                </div>
            <% } %>

            <form action="calculateBill" method="post">
                <div class="form-group">
                    <label>Customer Name</label>
                    <div class="input-wrapper">
                        <i class="fa-regular fa-user"></i>
                        <input type="text" name="customerName" required placeholder="e.g. John Doe">
                    </div>
                </div>

                <div class="form-group">
                    <label>Meter Number</label>
                    <div class="input-wrapper">
                        <i class="fa-solid fa-gauge-high"></i>
                        <input type="text" name="meterNumber" required placeholder="e.g. MTR-88902">
                    </div>
                </div>

                <div class="form-group">
                    <label>Billing Month</label>
                    <div class="input-wrapper">
                        <i class="fa-regular fa-calendar-days"></i>
                        <input type="month" name="billingMonth" required value="2026-08">
                    </div>
                </div>

                <div class="form-group">
                    <label>Units Consumed (kWh)</label>
                    <div class="input-wrapper">
                        <i class="fa-solid fa-plug-circle-bolt"></i>
                        <input type="number" id="unitsInput" name="units" step="0.01" min="0" required placeholder="Enter total units e.g. 250" oninput="updateLiveEstimate()">
                    </div>
                </div>

                <button type="submit" class="btn-submit">
                    <i class="fa-solid fa-calculator"></i>
                    <span>Calculate & Save Bill</span>
                </button>

                <a href="viewBills" class="nav-link-btn">
                    <i class="fa-solid fa-chart-pie"></i>
                    <span>View Month-Wise Analytics & History →</span>
                </a>
            </form>
        </div>

        <!-- Info & Live Breakdown Section -->
        <div class="card info-panel">
            <div>
                <div class="slab-card">
                    <h3><i class="fa-solid fa-sliders" style="color: var(--accent);"></i> Standard Tariff Slabs</h3>
                    <ul class="slab-list">
                        <li class="slab-item">
                            <span class="slab-range">First 100 units</span>
                            <span class="slab-rate">₹ 3.00 / unit</span>
                        </li>
                        <li class="slab-item">
                            <span class="slab-range">101 – 200 units</span>
                            <span class="slab-rate">₹ 4.50 / unit</span>
                        </li>
                        <li class="slab-item">
                            <span class="slab-range">201 – 400 units</span>
                            <span class="slab-rate">₹ 6.00 / unit</span>
                        </li>
                        <li class="slab-item">
                            <span class="slab-range">Above 400 units</span>
                            <span class="slab-rate">₹ 8.00 / unit</span>
                        </li>
                        <li class="slab-item" style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 10px;">
                            <span class="slab-range">Fixed Monthly Charge</span>
                            <span class="slab-rate" style="color: #a78bfa;">₹ 50.00</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="live-preview">
                <div class="preview-title">Live Bill Estimate</div>
                <div class="preview-amount" id="estimateDisplay">₹ 50.00</div>
                <p style="font-size: 12px; color: var(--text-muted);">Includes ₹50 fixed meter charge</p>
            </div>
        </div>
    </div>

    <script>
        function updateLiveEstimate() {
            const unitsVal = parseFloat(document.getElementById('unitsInput').value) || 0;
            let amount = 0;

            if (unitsVal <= 100) {
                amount = unitsVal * 3.0;
            } else if (unitsVal <= 200) {
                amount = 100 * 3.0 + (unitsVal - 100) * 4.5;
            } else if (unitsVal <= 400) {
                amount = 100 * 3.0 + 100 * 4.5 + (unitsVal - 200) * 6.0;
            } else {
                amount = 100 * 3.0 + 100 * 4.5 + 200 * 6.0 + (unitsVal - 400) * 8.0;
            }

            const total = amount + 50.0;
            document.getElementById('estimateDisplay').innerText = '₹ ' + total.toFixed(2);
        }
    </script>

</body>
</html>