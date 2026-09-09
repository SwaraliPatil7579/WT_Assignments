import axios from 'axios';
import { Book, User, Order, OrderPayload, AuthResponse } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  auth: {
    register: async (data: {
      fullName: string;
      email: string;
      username: string;
      password: string;
      phone?: string;
      address?: string;
    }): Promise<AuthResponse> => {
      const res = await client.post<AuthResponse>('/auth/register', data);
      return res.data;
    },

    login: async (identifier: string, password: string): Promise<AuthResponse> => {
      const res = await client.post<AuthResponse>('/auth/login', { identifier, password });
      return res.data;
    },
  },

  books: {
    getAll: async (params?: { search?: string; category?: string; maxPrice?: number }): Promise<Book[]> => {
      const res = await client.get<Book[]>('/books', { params });
      return res.data;
    },

    getById: async (id: string): Promise<Book> => {
      const res = await client.get<Book>(`/books/${id}`);
      return res.data;
    },

    getFeatured: async (): Promise<Book[]> => {
      const res = await client.get<Book[]>('/books/featured');
      return res.data;
    },

    getCategories: async (): Promise<string[]> => {
      const res = await client.get<string[]>('/books/categories');
      return res.data;
    },
  },

  orders: {
    create: async (order: OrderPayload): Promise<Order> => {
      const res = await client.post<Order>('/orders', order);
      return res.data;
    },

    getByUser: async (userId: string): Promise<Order[]> => {
      const res = await client.get<Order[]>(`/orders/user/${userId}`);
      return res.data;
    },

    getByEmail: async (email: string): Promise<Order[]> => {
      const res = await client.get<Order[]>(`/orders/email/${encodeURIComponent(email)}`);
      return res.data;
    },

    getAll: async (): Promise<Order[]> => {
      const res = await client.get<Order[]>('/orders');
      return res.data;
    }
  },
};
