import React, { useState } from 'react';
import { BookOpen, ShoppingBag, User as UserIcon, Menu, X, LogOut, Package, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSearchFocus?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'catalogue', label: 'Catalogue' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Read<span className="text-brand-600">Vault</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded">
                  Books
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-1 hidden sm:block">
                Curated Literary Haven
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  currentPage === link.id
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => onNavigate('orders')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  currentPage === 'orders'
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                My Orders
              </button>
            )}
          </nav>

          {/* Action Icons & User Account */}
          <div className="flex items-center gap-3">
            {/* Quick Catalogue Search Jump */}
            <button
              onClick={() => onNavigate('catalogue')}
              className="p-2.5 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors"
              title="Search Catalogue"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-slate-100 transition-colors group"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-brand-600 rounded-full shadow-md animate-bounce ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Profile / Auth State */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-slate-50 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                      {user.fullName}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[110px]">
                      @{user.username}
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-medium text-slate-500">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('orders');
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                      >
                        <Package className="w-4 h-4 text-brand-600" />
                        My Order History
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentPage === 'login'
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-500/25 transition-all duration-200 hover:shadow-md"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold ${
                currentPage === link.id
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          ))}

          {isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  onNavigate('orders');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-100"
              >
                My Orders
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-rose-600 hover:bg-rose-50"
              >
                Sign Out ({user?.username})
              </button>
            </>
          ) : (
            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  onNavigate('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl text-center font-semibold text-slate-700 bg-slate-100"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  onNavigate('register');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl text-center font-semibold text-white bg-brand-600"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
