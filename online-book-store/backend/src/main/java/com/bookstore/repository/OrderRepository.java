package com.bookstore.repository;

import com.bookstore.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserIdOrderByOrderDateDesc(String userId);
    List<Order> findByCustomerEmailOrderByOrderDateDesc(String customerEmail);
    List<Order> findAllByOrderByOrderDateDesc();
}
