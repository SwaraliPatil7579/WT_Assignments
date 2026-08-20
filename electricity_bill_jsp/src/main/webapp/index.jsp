<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Electricity Bill Calculator | JSP Light Theme</title>
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Custom Light Theme CSS -->
    <link rel="stylesheet" href="css/app_light.css">
</head>
<body>

    <div class="main-wrapper">
        <!-- Header Section -->
        <header class="header-brand">
            <div class="brand-badge">
                <i class="fa-solid fa-bolt"></i>
                <span>JSP Power Utilities Engine</span>
            </div>
            <h1>Electricity Bill Calculator</h1>
            <p>Calculate electricity bills with slab rates and save records directly to MySQL database</p>
        </header>

        <!-- Main Grid Container -->
        <div class="app-container">
            <!-- Left Side: Calculation Form -->
            <div class="glass-card">
                <div class="card-header">
                    <div class="icon-box">
                        <i class="fa-solid fa-calculator"></i>
                    </div>
                    <div class="card-title-text">
                        <h2>Bill Calculator Form</h2>
                        <p>Enter consumer details & meter reading</p>
                    </div>
                </div>

                <form action="calculate.jsp" method="post" onsubmit="return validateForm()">
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="customerName">Customer Name</label>
                            <div class="input-container">
                                <input type="text" id="customerName" name="customerName" class="form-control" required placeholder="e.g. Ramesh Kumar">
                                <i class="fa-regular fa-user"></i>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="meterNumber">Meter Number</label>
                            <div class="input-container">
                                <input type="text" id="meterNumber" name="meterNumber" class="form-control" required placeholder="e.g. MTR-78921">
                                <i class="fa-solid fa-gauge-high"></i>
                            </div>
                        </div>

                        <div class="form-group full-width">
                            <label for="billingMonth">Billing Month & Year</label>
                            <div class="input-container">
                                <input type="month" id="billingMonth" name="billingMonth" class="form-control" required value="2026-08">
                                <i class="fa-regular fa-calendar-days"></i>
                            </div>
                        </div>

                        <div class="form-group full-width">
                            <label for="unitsInput">Units Consumed (kWh)</label>
                            <div class="input-container">
                                <input type="number" id="unitsInput" name="units" class="form-control" step="0.01" min="0" required placeholder="Enter total units e.g. 250">
                                <i class="fa-solid fa-plug-circle-bolt"></i>
                            </div>
                            
                            <!-- Quick Presets -->
                            <div class="preset-buttons">
                                <span class="quick-preset-label" style="align-self: center;">Quick Try:</span>
                                <button type="button" class="preset-btn" onclick="setPreset(40)">40 Units (S1)</button>
                                <button type="button" class="preset-btn" onclick="setPreset(120)">120 Units (S2)</button>
                                <button type="button" class="preset-btn" onclick="setPreset(200)">200 Units (S3)</button>
                                <button type="button" class="preset-btn" onclick="setPreset(350)">350 Units (S4)</button>
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="btn-primary">
                        <i class="fa-solid fa-database"></i>
                        <span>Calculate & Save to Database</span>
                    </button>

                    <div style="margin-top: 16px; text-align: center;">
                        <a href="history.jsp" class="btn-secondary" style="font-size: 13px;">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                            <span>View Saved Bills History</span>
                        </a>
                    </div>
                </form>
            </div>

            <!-- Right Side: Tariff Slabs & Live Estimate -->
            <div class="glass-card">
                <div class="card-header">
                    <div class="icon-box" style="background: linear-gradient(135deg, #059669, #2563eb);">
                        <i class="fa-solid fa-list-check"></i>
                    </div>
                    <div class="card-title-text">
                        <h2>Tariff Structure</h2>
                        <p>Official slab rate rules per unit</p>
                    </div>
                </div>

                <div class="tariff-slab-list">
                    <div class="slab-card-item">
                        <div class="slab-info-group">
                            <div class="slab-indicator s1"></div>
                            <div>
                                <div class="slab-label">First 50 Units</div>
                                <div class="slab-range">Units: 0 - 50</div>
                            </div>
                        </div>
                        <div class="slab-rate-tag">₹ 3.50 / unit</div>
                    </div>

                    <div class="slab-card-item">
                        <div class="slab-info-group">
                            <div class="slab-indicator s2"></div>
                            <div>
                                <div class="slab-label">Next 100 Units</div>
                                <div class="slab-range">Units: 51 - 150</div>
                            </div>
                        </div>
                        <div class="slab-rate-tag">₹ 4.00 / unit</div>
                    </div>

                    <div class="slab-card-item">
                        <div class="slab-info-group">
                            <div class="slab-indicator s3"></div>
                            <div>
                                <div class="slab-label">Next 100 Units</div>
                                <div class="slab-range">Units: 151 - 250</div>
                            </div>
                        </div>
                        <div class="slab-rate-tag">₹ 5.20 / unit</div>
                    </div>

                    <div class="slab-card-item">
                        <div class="slab-info-group">
                            <div class="slab-indicator s4"></div>
                            <div>
                                <div class="slab-label">Above 250 Units</div>
                                <div class="slab-range">Units: > 250</div>
                            </div>
                        </div>
                        <div class="slab-rate-tag">₹ 6.50 / unit</div>
                    </div>
                </div>

                <!-- Live Preview Display -->
                <div class="live-estimate-card">
                    <div class="estimate-title"><i class="fa-solid fa-wand-magic-sparkles"></i> Live Bill Estimate</div>
                    <div class="estimate-val" id="estimateDisplay">₹ 0.00</div>
                    
                    <div class="tier-progress-bar" title="Slab Distribution Progress Bar">
                        <div class="tier-seg s1" id="seg1" style="width: 0%;"></div>
                        <div class="tier-seg s2" id="seg2" style="width: 0%;"></div>
                        <div class="tier-seg s3" id="seg3" style="width: 0%;"></div>
                        <div class="tier-seg s4" id="seg4" style="width: 0%;"></div>
                    </div>
                </div>
            </div>
        </div>

        <footer class="app-footer">
            <p>Designed with Light Theme JSP • MySQL Database Integrated</p>
        </footer>
    </div>

    <!-- Custom JavaScript -->
    <script src="js/main.js"></script>
</body>
</html>
