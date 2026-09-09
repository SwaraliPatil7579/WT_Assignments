package com.bookstore.dto;

public class AuthResponse {
    private boolean success;
    private String message;
    private String id;
    private String fullName;
    private String email;
    private String username;
    private String phone;
    private String address;

    public AuthResponse() {}

    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public static AuthResponse success(String message, String id, String fullName, String email, String username, String phone, String address) {
        AuthResponse res = new AuthResponse(true, message);
        res.id = id;
        res.fullName = fullName;
        res.email = email;
        res.username = username;
        res.phone = phone;
        res.address = address;
        return res;
    }

    public static AuthResponse error(String message) {
        return new AuthResponse(false, message);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
