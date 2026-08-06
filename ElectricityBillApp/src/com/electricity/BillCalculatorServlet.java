package com.electricity;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/calculateBill")
public class BillCalculatorServlet extends HttpServlet {
    
    // Tariff rates (example slab rates)
    private static final double RATE_SLAB_1 = 3.0;   // 0-100 units
    private static final double RATE_SLAB_2 = 4.5;   // 101-200 units
    private static final double RATE_SLAB_3 = 6.0;   // 201-400 units
    private static final double RATE_SLAB_4 = 8.0;   // above 400 units
    private static final double FIXED_CHARGE = 50.0;
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.sendRedirect("index.jsp");
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String customerName = request.getParameter("customerName");
        String meterNumber = request.getParameter("meterNumber");
        String billingMonth = request.getParameter("billingMonth");
        String unitsParam = request.getParameter("units");
        
        if (customerName == null || customerName.trim().isEmpty() ||
            meterNumber == null || meterNumber.trim().isEmpty() ||
            unitsParam == null || unitsParam.trim().isEmpty()) {
            
            request.setAttribute("errorMessage", "All required fields must be filled out.");
            request.getRequestDispatcher("index.jsp").forward(request, response);
            return;
        }

        if (billingMonth == null || billingMonth.trim().isEmpty()) {
            billingMonth = "2026-08";
        }

        double units;
        try {
            units = Double.parseDouble(unitsParam.trim());
            if (units < 0) {
                request.setAttribute("errorMessage", "Units consumed cannot be negative.");
                request.getRequestDispatcher("index.jsp").forward(request, response);
                return;
            }
        } catch (NumberFormatException e) {
            request.setAttribute("errorMessage", "Invalid number format for units consumed.");
            request.getRequestDispatcher("index.jsp").forward(request, response);
            return;
        }
        
        // Calculate bill
        double billAmount = calculateElectricityBill(units);
        
        // Create customer object
        Customer customer = new Customer(customerName.trim(), meterNumber.trim(), billingMonth.trim(), units);
        customer.setBillAmount(billAmount);
        
        // Save to database
        BillDAO dao = new BillDAO();
        boolean saved = dao.saveBill(customer);
        
        // Set attributes for result page
        request.setAttribute("customer", customer);
        request.setAttribute("saved", saved);
        
        request.getRequestDispatcher("result.jsp").forward(request, response);
    }
    
    private double calculateElectricityBill(double units) {
        double amount = 0;
        
        if (units <= 100) {
            amount = units * RATE_SLAB_1;
        } else if (units <= 200) {
            amount = 100 * RATE_SLAB_1 + (units - 100) * RATE_SLAB_2;
        } else if (units <= 400) {
            amount = 100 * RATE_SLAB_1 + 100 * RATE_SLAB_2 + (units - 200) * RATE_SLAB_3;
        } else {
            amount = 100 * RATE_SLAB_1 + 100 * RATE_SLAB_2 + 200 * RATE_SLAB_3 + (units - 400) * RATE_SLAB_4;
        }
        
        return amount + FIXED_CHARGE;
    }
}