package com.bookstore.service;

import com.bookstore.dto.AuthResponse;
import com.bookstore.dto.LoginRequest;
import com.bookstore.dto.RegisterRequest;
import com.bookstore.model.User;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            return AuthResponse.error("Email is already registered. Please sign in or use another email.");
        }

        if (userRepository.existsByUsername(request.getUsername().trim().toLowerCase())) {
            return AuthResponse.error("Username is already taken. Please choose another username.");
        }

        User user = new User(
                request.getFullName().trim(),
                request.getEmail().trim().toLowerCase(),
                request.getUsername().trim().toLowerCase(),
                request.getPassword(), // In production, hash with BCrypt
                request.getPhone() != null ? request.getPhone().trim() : "",
                request.getAddress() != null ? request.getAddress().trim() : ""
        );

        User savedUser = userRepository.save(user);

        return AuthResponse.success(
                "Registration successful! Welcome to the Online Book Store.",
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getUsername(),
                savedUser.getPhone(),
                savedUser.getAddress()
        );
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmailOrUsername(identifier, identifier);

        if (userOpt.isEmpty()) {
            return AuthResponse.error("No account found with this email or username.");
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(request.getPassword())) {
            return AuthResponse.error("Invalid password. Please check your credentials.");
        }

        return AuthResponse.success(
                "Login successful!",
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getUsername(),
                user.getPhone(),
                user.getAddress()
        );
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }
}
