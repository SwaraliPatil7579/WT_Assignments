/**
 * Electricity Bill Calculator - Dynamic Script
 */

document.addEventListener('DOMContentLoaded', () => {
    const unitsInput = document.getElementById('unitsInput');
    const estimateDisplay = document.getElementById('estimateDisplay');
    const seg1 = document.getElementById('seg1');
    const seg2 = document.getElementById('seg2');
    const seg3 = document.getElementById('seg3');
    const seg4 = document.getElementById('seg4');

    if (unitsInput) {
        // Attach event listener for real-time live preview
        unitsInput.addEventListener('input', calculateLiveEstimate);
        // Run initial calculation if input already has value
        calculateLiveEstimate();
    }
});

/**
 * Calculates live estimate and updates visual progress bars
 */
function calculateLiveEstimate() {
    const inputEl = document.getElementById('unitsInput');
    const displayEl = document.getElementById('estimateDisplay');
    if (!inputEl || !displayEl) return;

    const units = parseFloat(inputEl.value) || 0;
    
    let totalAmount = 0;
    let u1 = 0, u2 = 0, u3 = 0, u4 = 0;

    if (units <= 50) {
        u1 = units;
        totalAmount = u1 * 3.50;
    } else if (units <= 150) {
        u1 = 50;
        u2 = units - 50;
        totalAmount = (u1 * 3.50) + (u2 * 4.00);
    } else if (units <= 250) {
        u1 = 50;
        u2 = 100;
        u3 = units - 150;
        totalAmount = (u1 * 3.50) + (u2 * 4.00) + (u3 * 5.20);
    } else {
        u1 = 50;
        u2 = 100;
        u3 = 100;
        u4 = units - 250;
        totalAmount = (u1 * 3.50) + (u2 * 4.00) + (u3 * 5.20) + (u4 * 6.50);
    }

    // Format output currency with Indian Rupee formatting
    displayEl.innerText = '₹ ' + totalAmount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Update segment visual progress bars
    const seg1 = document.getElementById('seg1');
    const seg2 = document.getElementById('seg2');
    const seg3 = document.getElementById('seg3');
    const seg4 = document.getElementById('seg4');

    if (seg1 && seg2 && seg3 && seg4) {
        const totalUnitsForScale = Math.max(units, 250);
        seg1.style.width = ((u1 / totalUnitsForScale) * 100) + '%';
        seg2.style.width = ((u2 / totalUnitsForScale) * 100) + '%';
        seg3.style.width = ((u3 / totalUnitsForScale) * 100) + '%';
        seg4.style.width = ((u4 / totalUnitsForScale) * 100) + '%';
    }
}

/**
 * Sets quick preset unit values
 */
function setPreset(units) {
    const inputEl = document.getElementById('unitsInput');
    if (inputEl) {
        inputEl.value = units;
        calculateLiveEstimate();
        inputEl.focus();
    }
}

/**
 * Form validation before submitting to calculate.jsp
 */
function validateForm() {
    const unitsInput = document.getElementById('unitsInput');
    if (!unitsInput) return true;

    const val = parseFloat(unitsInput.value);
    if (isNaN(val) || val < 0) {
        alert('Please enter a valid non-negative number for electricity units.');
        unitsInput.focus();
        return false;
    }
    return true;
}

/**
 * Triggers browser print modal for invoice
 */
function printInvoice() {
    window.print();
}
