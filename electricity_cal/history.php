<?php
require 'config.php';
require 'functions.php';

$pageTitle = 'Bill History';
$history = getBillHistory($conn, 12);

require 'header.php';
?>

<div class="card">
    <div class="card-header">
        <h1>📊 Bill History</h1>
        <p>Last 12 saved bills</p>
    </div>
    <div class="card-body">
        <?php if ($history && $history->num_rows > 0): ?>
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Units</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while ($row = $history->fetch_assoc()): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($row['month']); ?></td>
                        <td><?php echo htmlspecialchars($row['year']); ?></td>
                        <td><?php echo number_format($row['units'], 2); ?></td>
                        <td class="text-right">₹<?php echo number_format($row['total_amount'], 2); ?></td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p class="empty-history">No bills saved yet. Go to the Calculator tab to add one.</p>
        <?php endif; ?>
    </div>
</div>

<?php
require 'footer.php';
$conn->close();
?>