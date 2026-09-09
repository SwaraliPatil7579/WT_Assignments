import React from 'react';
import { BookOpen, Heart, Mail, Phone, MapPin, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-14 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Free Express Shipping</h4>
              <p className="text-xs text-slate-400 mt-1">On all domestic orders over $50</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">100% Genuine Editions</h4>
              <p className="text-xs text-slate-400 mt-1">Directly sourced from publishers</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">30-Day Easy Returns</h4>
              <p className="text-xs text-slate-400 mt-1">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Curated Selection</h4>
              <p className="text-xs text-slate-400 mt-1">Handpicked by literary experts</p>
            </div>
          </div>
        </div>

        {/* Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Read<span className="text-brand-400">Vault</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your premier digital bookstore offering a curated universe of computing literature,
              classic fiction, business masteries, and timeless thoughts.
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                University Campus Road, Tech Avenue
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                +1 (800) 555-READ
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                support@readvault.com
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('catalogue')}
                  className="hover:text-white transition-colors"
                >
                  All Books & Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue')}
                  className="hover:text-white transition-colors"
                >
                  Featured Bestsellers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue')}
                  className="hover:text-white transition-colors"
                >
                  Computer Science & Tech
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue')}
                  className="hover:text-white transition-colors"
                >
                  New Arrivals
                </button>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="hover:text-white transition-colors"
                >
                  Member Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register')}
                  className="hover:text-white transition-colors"
                >
                  Create Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('orders')}
                  className="hover:text-white transition-colors"
                >
                  Track My Orders
                </button>
              </li>
              <li>
                <span className="text-slate-500">Terms of Service & Privacy</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Subscribe for literary recommendations, flash discounts, and author interviews.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
              />
              <button className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold transition-colors shrink-0">
                Join
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Use code <span className="text-amber-400 font-mono">BOOKWORM10</span> for 10% off.</p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} ReadVault Online Bookstore. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> using React, TypeScript, Spring Boot & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};
