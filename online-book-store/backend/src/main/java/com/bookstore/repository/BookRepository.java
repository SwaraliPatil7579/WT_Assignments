package com.bookstore.repository;

import com.bookstore.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    List<Book> findByCategoryIgnoreCase(String category);
    List<Book> findByFeaturedTrue();

    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'author': { $regex: ?0, $options: 'i' } }, { 'category': { $regex: ?0, $options: 'i' } } ] }")
    List<Book> searchBooks(String keyword);
}
