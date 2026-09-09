package com.bookstore.service;

import com.bookstore.model.Book;
import com.bookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public List<Book> getAllBooks(String search, String category, Double maxPrice) {
        List<Book> books;
        if (search != null && !search.trim().isEmpty()) {
            books = bookRepository.searchBooks(search.trim());
        } else if (category != null && !category.equalsIgnoreCase("all") && !category.trim().isEmpty()) {
            books = bookRepository.findByCategoryIgnoreCase(category.trim());
        } else {
            books = bookRepository.findAll();
        }

        if (maxPrice != null && maxPrice > 0) {
            books = books.stream()
                    .filter(b -> b.getPrice() <= maxPrice)
                    .collect(Collectors.toList());
        }

        return books;
    }

    public Optional<Book> getBookById(String id) {
        return bookRepository.findById(id);
    }

    public List<Book> getFeaturedBooks() {
        return bookRepository.findByFeaturedTrue();
    }

    public List<String> getAllCategories() {
        return bookRepository.findAll().stream()
                .map(Book::getCategory)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    public long getCount() {
        return bookRepository.count();
    }
}
