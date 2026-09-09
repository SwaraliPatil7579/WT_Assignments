package com.bookstore.service;

import com.bookstore.dto.OrderRequest;
import com.bookstore.model.Order;
import com.bookstore.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(OrderRequest req) {
        Order order = new Order();
        order.setUserId(req.getUserId());
        order.setCustomerName(req.getCustomerName());
        order.setCustomerEmail(req.getCustomerEmail());
        order.setCustomerPhone(req.getCustomerPhone());
        order.setShippingAddress(req.getShippingAddress());
        order.setPaymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "Cash on Delivery");
        order.setItems(req.getItems());
        order.setSubtotal(req.getSubtotal());
        order.setDiscount(req.getDiscount());
        order.setShippingFee(req.getShippingFee());
        order.setTotalAmount(req.getTotalAmount());
        order.setStatus("CONFIRMED");
        order.setOrderDate(new Date());

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUser(String userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByCustomerEmailOrderByOrderDateDesc(email);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public Optional<Order> getOrderById(String orderId) {
        return orderRepository.findById(orderId);
    }
}
