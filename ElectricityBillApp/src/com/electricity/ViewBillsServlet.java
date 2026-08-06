package com.electricity;

import java.io.IOException;
import java.util.List;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/viewBills")
public class ViewBillsServlet extends HttpServlet {
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        BillDAO dao = new BillDAO();
        List<Customer> bills = dao.getAllBills();
        
        request.setAttribute("bills", bills);
        request.getRequestDispatcher("viewBills.jsp").forward(request, response);
    }
}