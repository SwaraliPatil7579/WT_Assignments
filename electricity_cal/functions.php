<?php
/**
 * Electricity Bill Calculation Logic
 *
 * Tariff Structure:
 * - First 50 units:      ₹3.50/unit
 * - Next 100 units:      ₹4.00/unit  (51–150)
 * - Next 100 units:      ₹5.20/unit  (151–250)
 * - Above 250 units:     ₹6.50/unit
 */

define('RATE_SLAB_1', 3.50);  // 0–50 units
define('RATE_SLAB_2', 4.00);  // 51–150 units
define('RATE_SLAB_3', 5.20);  // 151–250 units
define('RATE_SLAB_4', 6.50);  // 250+ units

function calculateBill(float $units): array {
    $breakdown = [
        'slab1' => ['units' => 0, 'rate' => RATE_SLAB_1, 'amount' => 0],
        'slab2' => ['units' => 0, 'rate' => RATE_SLAB_2, 'amount' => 0],
        'slab3' => ['units' => 0, 'rate' => RATE_SLAB_3, 'amount' => 0],
        'slab4' => ['units' => 0, 'rate' => RATE_SLAB_4, 'amount' => 0],
    ];

    $remaining = $units;

    if ($remaining > 0) {
        $slabUnits = min($remaining, 50);
        $breakdown['slab1']['units'] = $slabUnits;
        $breakdown['slab1']['amount'] = $slabUnits * RATE_SLAB_1;
        $remaining -= $slabUnits;
    }

    if ($remaining > 0) {
        $slabUnits = min($remaining, 100);
        $breakdown['slab2']['units'] = $slabUnits;
        $breakdown['slab2']['amount'] = $slabUnits * RATE_SLAB_2;
        $remaining -= $slabUnits;
    }

    if ($remaining > 0) {
        $slabUnits = min($remaining, 100);
        $breakdown['slab3']['units'] = $slabUnits;
        $breakdown['slab3']['amount'] = $slabUnits * RATE_SLAB_3;
        $remaining -= $slabUnits;
    }

    if ($remaining > 0) {
        $breakdown['slab4']['units'] = $remaining;
        $breakdown['slab4']['amount'] = $remaining * RATE_SLAB_4;
    }

    $total = $breakdown['slab1']['amount']
           + $breakdown['slab2']['amount']
           + $breakdown['slab3']['amount']
           + $breakdown['slab4']['amount'];

    return [
        'units' => $units,
        'breakdown' => $breakdown,
        'total' => $total
    ];
}

/**
 * Save a calculated bill to the database.
 */
function saveBill(mysqli $conn, string $month, int $year, float $units, float $total): bool {
    $stmt = $conn->prepare(
        "INSERT INTO bills (month, year, units, total_amount) VALUES (?, ?, ?, ?)"
    );
    $stmt->bind_param("sidd", $month, $year, $units, $total);
    $success = $stmt->execute();
    $stmt->close();
    return $success;
}

/**
 * Fetch recent bill history.
 */
function getBillHistory(mysqli $conn, int $limit = 12): mysqli_result {
    $stmt = $conn->prepare("SELECT * FROM bills ORDER BY year DESC, id DESC LIMIT ?");
    $stmt->bind_param("i", $limit);
    $stmt->execute();
    return $stmt->get_result();
}