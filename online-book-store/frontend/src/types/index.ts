export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  coverImage: string;
  description: string;
  isbn: string;
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  publisher?: string;
  pages?: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  phone?: string;
  address?: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface OrderItemPayload {
  bookId: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  coverImage: string;
}

export interface OrderPayload {
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItemPayload[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItemPayload[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  status: string;
  orderDate: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  id?: string;
  fullName?: string;
  email?: string;
  username?: string;
  phone?: string;
  address?: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}
