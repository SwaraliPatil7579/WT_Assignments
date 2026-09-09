# ReadVault — Modern Online Book Store

A full-stack, responsive Online Book Store web application designed and developed with **React 18 + TypeScript + Tailwind CSS**, **Spring Boot 3.3**, and **MongoDB**.

---

## Key Features & Page Breakdown

### 1. Home Page
- **Hero Showcase**: Prominent branding, tagline, search bar jump, spring sale promotion banner.
- **Dynamic Stats**: Real-time counter metrics (10,000+ Titles, 4.9★ Reader Rating, 24/7 Dispatch).
- **Genre Navigation**: Quick-browse category cards with icons (*Computer Science*, *Self-Help*, *Sci-Fi & Fantasy*, *Business*, *Non-Fiction*, *Psychology*).
- **Featured Bestsellers**: Grid of top-rated books with ratings, review counts, discount tags, and instant "Add to Cart" triggers.
- **Value Propositions**: Free express shipping over $50, 100% genuine editions guarantee, 30-day easy returns.
- **Customer Testimonials & Newsletter**: Reader reviews and coupon code signup (`BOOKWORM10`).

### 2. Login Page
- **Modern Authentication Card**: Glassmorphic styling with email/username and password validation.
- **MongoDB Verification**: Direct authentication against the `users` collection via `POST /api/auth/login`.
- **1-Click Demo Helper**: Convenient button to auto-fill sample evaluator credentials (`demo@bookstore.com` / `demo123`).
- **Show/Hide Password**: Interactive toggle for secure visibility.

### 3. Catalogue Page
- **Live Search**: Instant keyword search matching titles, authors, and topics with debouncing.
- **Category Filter**: One-click genre pills to filter books instantly.
- **Price Range Slider**: Filter books dynamically up to a custom max price.
- **Sorting Options**: Sort by Bestselling, Price: Low to High, Price: High to Low, Highest Rated, and Title (A-Z).
- **Quick View Modal**: Click any book to view full synopsis, ISBN, publisher, page count, and adjust quantities.

### 4. Registration Page (Database Integrated)
- **Comprehensive Profile Registration**: Full Name, Email, Username, Phone, Delivery Address, Password, and Confirm Password.
- **Validation**: Email pattern matching, password length checks, and real-time password match indicator.
- **MongoDB Persistence**: Submits to `POST /api/auth/register` to create and persist user records in the `users` collection.
- **Duplicate Prevention**: Handles existing email or username conflicts with informative alerts.

### 5. Cart Handling & Checkout System
- **Slide-out Cart Drawer**: Accessible from anywhere with animated backdrop and item counter badge.
- **Interactive Controls**: Increase/decrease quantities, remove individual titles, clear entire basket.
- **Discount Promo Engine**: Enter `BOOKWORM10` or `WELCOME10` for an immediate 10% discount (`READ20` for 20%).
- **Free Shipping Threshold**: Dynamic calculation showing free shipping on orders above $50.
- **Checkout Modal & MongoDB Orders**: Captures shipping details, payment method selection (Cash on Delivery, Cards, UPI), saves order to MongoDB `orders` collection (`POST /api/orders`), and renders an order receipt with confirmation ID.

---

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons, Axios, Vite
- **Backend**: Java 17/25, Spring Boot 3.3.4, Spring Web, Spring Data MongoDB, Jakarta Validation
- **Database**: MongoDB (running on port `27017` with database `bookstore_db`)

---

## Project Structure

```
online-book-store/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/bookstore/
│       │   ├── BookstoreApplication.java
│       │   ├── config/
│       │   │   ├── CorsConfig.java
│       │   │   └── DataInitializer.java     # Seeds 12 realistic books & demo user
│       │   ├── controller/
│       │   │   ├── AuthController.java      # /api/auth/login, /api/auth/register
│       │   │   ├── BookController.java      # /api/books (filtering, search, details)
│       │   │   └── OrderController.java     # /api/orders (checkout & history)
│       │   ├── dto/
│       │   │   ├── LoginRequest.java
│       │   │   ├── RegisterRequest.java
│       │   │   ├── AuthResponse.java
│       │   │   └── OrderRequest.java
│       │   ├── model/
│       │   │   ├── Book.java
│       │   │   ├── User.java
│       │   │   ├── Order.java
│       │   │   └── OrderItem.java
│       │   ├── repository/
│       │   │   ├── BookRepository.java
│       │   │   ├── UserRepository.java
│       │   │   └── OrderRepository.java
│       │   └── service/
│       │       ├── BookService.java
│       │       ├── UserService.java
│       │       └── OrderService.java
│       └── resources/
│           └── application.properties       # mongodb://localhost:27017/bookstore_db
│
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── types/index.ts                   # TypeScript interfaces
        ├── services/api.ts                  # Axios REST client
        ├── context/
        │   ├── AuthContext.tsx              # Auth state & localStorage
        │   ├── CartContext.tsx              # Cart state, discounts, drawer
        │   └── ToastContext.tsx             # Notification system
        ├── components/
        │   ├── Navbar.tsx                   # Responsive navbar with cart badge
        │   ├── Footer.tsx                   # Footer with links & features
        │   ├── BookCard.tsx                 # Book card with quick-view
        │   ├── BookDetailModal.tsx          # Synopsis & quantity modal
        │   ├── CartDrawer.tsx               # Slide-over cart sheet
        │   └── CheckoutModal.tsx            # Order confirmation & payment
        ├── pages/
        │   ├── HomePage.tsx
        │   ├── CataloguePage.tsx
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   └── OrdersPage.tsx
        ├── App.tsx
        └── main.tsx
```

---

## How to Run Locally

### 1. MongoDB
Ensure MongoDB is running on port 27017:
```bash
mongod
```

### 2. Start Backend Server
```bash
cd backend
mvn spring-boot:run
```
*Backend runs on `http://localhost:8080`.*
*(The application will automatically seed 12 curated books and a demo user if the collections are empty).*

### 3. Start Frontend Dev Server
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5180`.*

---

## Demo Credentials
- **Email**: `demo@bookstore.com`
- **Password**: `demo123`
- *(Or click the "Fill Demo" helper button on the Login page)*
- **Promo Code for Cart**: `BOOKWORM10` (10% discount) or `READ20` (20% discount)
