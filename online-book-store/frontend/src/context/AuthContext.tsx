import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<AuthResponse>;
  register: (data: {
    fullName: string;
    email: string;
    username: string;
    password: string;
    phone?: string;
    address?: string;
  }) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('readvault_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse saved user', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (identifier: string, password: string): Promise<AuthResponse> => {
    try {
      const res = await api.auth.login(identifier, password);
      if (res.success && res.id) {
        const loggedUser: User = {
          id: res.id,
          fullName: res.fullName || '',
          email: res.email || '',
          username: res.username || '',
          phone: res.phone,
          address: res.address,
        };
        setUser(loggedUser);
        localStorage.setItem('readvault_user', JSON.stringify(loggedUser));
      }
      return res;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      return { success: false, message: msg };
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    username: string;
    password: string;
    phone?: string;
    address?: string;
  }): Promise<AuthResponse> => {
    try {
      const res = await api.auth.register(data);
      if (res.success && res.id) {
        const newUser: User = {
          id: res.id,
          fullName: res.fullName || data.fullName,
          email: res.email || data.email,
          username: res.username || data.username,
          phone: res.phone || data.phone,
          address: res.address || data.address,
        };
        setUser(newUser);
        localStorage.setItem('readvault_user', JSON.stringify(newUser));
      }
      return res;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your details.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('readvault_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
