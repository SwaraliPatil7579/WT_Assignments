import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  promoCode: string;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('readvault_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem('readvault_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [items]);

  const addToCart = (book: Book, quantity: number = 1) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.book.id === book.id);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          quantity: updated[index].quantity + quantity,
        };
        return updated;
      } else {
        return [...prev, { book, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (bookId: string) => {
    setItems((prev) => prev.filter((item) => item.book.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.book.id === bookId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
    setDiscountPercent(0);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Number(
    items.reduce((sum, item) => sum + item.book.price * item.quantity, 0).toFixed(2)
  );

  const discount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  // Free shipping over $50, else $4.99; 0 if empty
  const shippingFee = items.length === 0 ? 0 : subtotal > 50 ? 0 : 4.99;
  const totalAmount = Number(
    Math.max(0, subtotal - discount + shippingFee).toFixed(2)
  );

  const applyPromoCode = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'BOOKWORM10' || cleaned === 'WELCOME10') {
      setPromoCode(cleaned);
      setDiscountPercent(10);
      return { success: true, message: 'Promo code applied: 10% discount!' };
    } else if (cleaned === 'READ20') {
      setPromoCode(cleaned);
      setDiscountPercent(20);
      return { success: true, message: 'Promo code applied: 20% discount!' };
    } else {
      return { success: false, message: 'Invalid promo code. Try "BOOKWORM10"' };
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercent(0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        totalItems,
        subtotal,
        discount,
        shippingFee,
        totalAmount,
        promoCode,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
