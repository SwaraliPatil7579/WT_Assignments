import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { BookDetailModal } from './components/BookDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { HomePage } from './pages/HomePage';
import { CataloguePage } from './pages/CataloguePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OrdersPage } from './pages/OrdersPage';
import { Book, Order } from './types';

export function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [catalogueCategory, setCatalogueCategory] = useState<string>('All');
  const [quickViewBook, setQuickViewBook] = useState<Book | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  const handleNavigate = (page: string, category?: string) => {
    if (category) {
      setCatalogueCategory(category);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickView = (book: Book) => {
    setQuickViewBook(book);
  };

  const handleDirectCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (_order: Order) => {
    // Order placed successfully
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onQuickView={handleQuickView}
          />
        )}

        {currentPage === 'catalogue' && (
          <CataloguePage
            initialCategory={catalogueCategory}
            onQuickView={handleQuickView}
          />
        )}

        {currentPage === 'login' && (
          <LoginPage
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'register' && (
          <RegisterPage
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'orders' && (
          <OrdersPage
            onNavigate={handleNavigate}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Interactive Cart Slide-over Drawer */}
      <CartDrawer
        onCheckout={() => setIsCheckoutOpen(true)}
        onExplore={() => handleNavigate('catalogue')}
      />

      {/* Book Detail & Synopsis Modal */}
      <BookDetailModal
        book={quickViewBook}
        onClose={() => setQuickViewBook(null)}
        onDirectCheckout={handleDirectCheckout}
      />

      {/* Checkout & Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
