import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, BookOpen, Star, ShieldCheck, Truck, Clock, Award, ChevronRight } from 'lucide-react';
import { Book } from '../types';
import { api } from '../services/api';
import { BookCard } from '../components/BookCard';
import { BookCover } from '../components/BookCover';

interface HomePageProps {
  onNavigate: (page: string, category?: string) => void;
  onQuickView: (book: Book) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onQuickView }) => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const books = await api.books.getFeatured();
        setFeaturedBooks(books.slice(0, 8));
      } catch (e) {
        console.error('Error fetching featured books:', e);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  const categories = [
    { name: 'Computer Science', count: '120+ Books', icon: '💻', color: 'from-blue-500/20 to-cyan-500/20' },
    { name: 'Self-Help', count: '85+ Books', icon: '🌱', color: 'from-emerald-500/20 to-teal-500/20' },
    { name: 'Sci-Fi & Fantasy', count: '94+ Books', icon: '🚀', color: 'from-purple-500/20 to-indigo-500/20' },
    { name: 'Business & Finance', count: '68+ Books', icon: '📈', color: 'from-amber-500/20 to-orange-500/20' },
    { name: 'Non-Fiction & History', count: '55+ Books', icon: '🏛️', color: 'from-rose-500/20 to-pink-500/20' },
    { name: 'Psychology', count: '40+ Books', icon: '🧠', color: 'from-sky-500/20 to-blue-500/20' },
  ];

  const testimonials = [
    {
      name: 'Dr. Emily Vance',
      role: 'Software Architect',
      comment: 'ReadVault has the best curated tech collection. Clean Code and DDIA arrived in mint condition within 2 days!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating: 5,
    },
    {
      name: 'Marcus Chen',
      role: 'Philosophy Graduate',
      comment: 'The interface is fluid, the recommendations are spot on, and customer service is stellar.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      rating: 5,
    },
    {
      name: 'Aisha Patel',
      role: 'Book Club Lead',
      comment: 'We buy all our monthly club books here. The discounts with coupon codes make it the best value bookstore online.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-bold tracking-wide shadow-sm">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>SPRING SPECIAL • EXTRA 10% OFF WITH 'BOOKWORM10'</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Where Curiosity Meets{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-brand-500 to-sky-500">
                  Timeless Wisdom
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Explore thousands of premier titles in Computer Science, Fiction, Personal Growth,
                and Business. Built for students, engineers, and passionate readers.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('catalogue')}
                  className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-base rounded-2xl shadow-xl shadow-brand-500/25 transition-all duration-200 flex items-center justify-center gap-3 group"
                >
                  <span>Explore Full Catalogue</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onNavigate('catalogue', 'Computer Science')}
                  className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-base rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5 text-brand-600" />
                  <span>Tech & CS Collection</span>
                </button>
              </div>

              {/* Stats Ticker */}
              <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 text-center sm:text-left">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">10,000+</p>
                  <p className="text-xs text-slate-500 font-medium">Verified Titles</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">4.9 ★</p>
                  <p className="text-xs text-slate-500 font-medium">Reader Rating</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">24/7</p>
                  <p className="text-xs text-slate-500 font-medium">Express Dispatch</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Stack */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Decorative glow circles */}
                <div className="absolute -top-6 -left-6 w-60 h-60 bg-brand-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-6 -right-6 w-60 h-60 bg-sky-400/20 rounded-full blur-3xl" />

                {/* Hero Showcase Card */}
                <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                      Trending Right Now
                    </span>
                    <div className="flex items-center text-amber-500 text-xs font-bold gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>4.9 / 5.0</span>
                    </div>
                  </div>

                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                    <BookCover
                      coverImage="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
                      title="Atomic Habits"
                      author="James Clear"
                      category="Self-Help"
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-xs text-slate-400">Limited-Time Special</p>
                      <p className="text-2xl font-black text-slate-900">$21.99</p>
                    </div>
                    <button
                      onClick={() => onNavigate('catalogue')}
                      className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                    >
                      View Deals
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Browse Categories
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Discover by Genre</h2>
          </div>
          <button
            onClick={() => onNavigate('catalogue')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>Browse All Genres</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onNavigate('catalogue', cat.name)}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:scale-110 flex items-center justify-center text-2xl mb-3 shadow-inner transition-transform">
                {cat.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-sm group-hover:text-brand-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Handpicked Essentials
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Featured Bestsellers</h2>
          </div>
          <button
            onClick={() => onNavigate('catalogue')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>See All Books ({featuredBooks.length}+)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} onQuickView={onQuickView} />
            ))}
          </div>
        )}
      </section>

      {/* Value Proposition Perks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Free Doorstep Delivery</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Complimentary tracked shipping on all orders over $50 across nationwide locations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Authentic Print Guarantee</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Every book is certified 100% genuine, directly licensed from top publishers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Exclusive Member Perks</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Enjoy seasonal promotional coupons, book club discussions, and author signatures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reader Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            Community Love
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-1">What Our Readers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center text-amber-500 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 italic leading-relaxed mb-6">
                  "{t.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-800 leading-tight">{t.name}</h4>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
