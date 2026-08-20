<?php
require 'config.php';
require 'functions.php';

$pageTitle = 'Electricity Bill Calculator';

$result = null;
$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $unitsInput = trim($_POST['units'] ?? '');
    $monthInput = trim($_POST['month'] ?? '');
    $yearInput  = trim($_POST['year'] ?? '');

    if ($unitsInput === '' || !is_numeric($unitsInput)) {
        $error = 'Please enter a valid number of units.';
    } elseif ((float)$unitsInput < 0) {
        $error = 'Units cannot be negative.';
    } elseif ($monthInput === '') {
        $error = 'Please select a month.';
    } elseif ($yearInput === '' || !is_numeric($yearInput)) {
        $error = 'Please enter a valid year.';
    } else {
        $result = calculateBill((float)$unitsInput);
        saveBill($conn, $monthInput, (int)$yearInput, $result['units'], $result['total']);
    }
}

require 'header.php';
?>

<div class="card">
    <div class="card-header">
        <h1>⚡ Electricity Bill Calculator</h1>
        <p>Calculate your electricity bill based on unit consumption</p>
    </div>

    <div class="card-body">
        <form method="POST" action="">
            <div class="form-row">
                <div class="form-group">
                    <label for="month">Month</label>
                    <select id="month" name="month" required>
                        <option value="">Select month</option>
                        <?php
                        $months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                        $selectedMonth = $_POST['month'] ?? '';
                        foreach ($months as $m) {
                            $sel = ($selectedMonth === $m) ? 'selected' : '';
                            echo "<option value=\"$m\" $sel>$m</option>";
                        }
                        ?>
                    </select>
                </div>
                <div class="form-group">
                    <label for="year">Year</label>
                    <input
                        type="number"
                        id="year"
                        name="year"
                        min="2000"
                        max="2100"
                        placeholder="e.g., 2026"
                        value="<?php echo htmlspecialchars($_POST['year'] ?? date('Y')); ?>"
                        required
                    >
                </div>
            </div>

            <div class="form-group">
                <label for="units">Enter Units Consumed (kWh)</label>
                <input
                    type="number"
                    id="units"
                    name="units"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 320"
                    value="<?php echo htmlspecialchars($_POST['units'] ?? ''); ?>"
                    required
                >
            </div>

            <button type="submit" class="btn">Calculate & Save Bill</button>
        </form>

        <?php if ($error): ?>
            <div class="error-message">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <?php if ($result): ?>
            <div class="result-section">
                <div class="result-header">
                    <h2>Bill Breakdown</h2>
                    <span class="units-badge"><?php echo number_format($result['units'], 2); ?> units</span>
                </div>

                <table class="breakdown-table">
                    <thead>
                        <tr>
                            <th>Slab</th>
                            <th>Units</th>
                            <th>Rate</th>
                            <th class="text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $slabLabels = [
                            'slab1' => '0 – 50',
                            'slab2' => '51 – 150',
                            'slab3' => '151 – 250',
                            'slab4' => 'Above 250'
                        ];
                        foreach ($result['breakdown'] as $key => $slab):
                            if ($slab['units'] > 0):
                        ?>
                            <tr>
                                <td><?php echo $slabLabels[$key]; ?></td>
                                <td><?php echo number_format($slab['units'], 2); ?></td>
                                <td>₹<?php echo number_format($slab['rate'], 2); ?></td>
                                <td class="text-right">₹<?php echo number_format($slab['amount'], 2); ?></td>
                            </tr>
                        <?php
                            endif;
                        endforeach;
                        ?>
                    </tbody>
                </table>

                <div class="total-row">
                    <span class="total-label">Total Amount Payable</span>
                    <span class="total-amount">₹<?php echo number_format($result['total'], 2); ?></span>
                </div>
            </div>
        <?php endif; ?>

        <div class="tariff-info">
            <h3>📋 Tariff Structure</h3>
            <div class="tariff-grid">
                <div class="tariff-item">
                    <span>First 50 units</span>
                    <span>₹3.50/unit</span>
                </div>
                <div class="tariff-item">
                    <span>Next 100 units (51–150)</span>
                    <span>₹4.00/unit</span>
                </div>
                <div class="tariff-item">
                    <span>Next 100 units (151–250)</span>
                    <span>₹5.20/unit</span>
                </div>
                <div class="tariff-item">
                    <span>Above 250 units</span>
                    <span>₹6.50/unit</span>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
require 'footer.php';
$conn->close();
?>