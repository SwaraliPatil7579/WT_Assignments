import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, BookOpen, RefreshCw } from 'lucide-react';
import { Book } from '../types';
import { api } from '../services/api';
import { BookCard } from '../components/BookCard';

interface CataloguePageProps {
  initialCategory?: string;
  onQuickView: (book: Book) => void;
}

export const CataloguePage: React.FC<CataloguePageProps> = ({ initialCategory = 'All', onQuickView }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(60);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Load books and categories
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const [bookData, catData] = await Promise.all([
        api.books.getAll({
          search: searchQuery || undefined,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          maxPrice: maxPrice,
        }),
        api.books.getCategories(),
      ]);
      setBooks(bookData);
      setCategories(['All', ...catData]);
    } catch (e) {
      console.error('Error fetching catalogue:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    fetchBooks();
  }, [selectedCategory, maxPrice]);

  // Handle live search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Client-side sort and in-stock filter
  const filteredAndSortedBooks = useMemo(() => {
    let list = [...books];

    if (inStockOnly) {
      list = list.filter((b) => b.inStock);
    }

    switch (sortBy) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'title-az':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return list;
  }, [books, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMaxPrice(60);
    setSortBy('featured');
    setInStockOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Complete Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Catalogue & Library
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Browse our comprehensive collection. Filter by genre, search titles or authors,
            and discover the exact book you've been looking for.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="w-full md:w-80 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, author, topic..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Genre:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Second Row: Price Filter, In-Stock, Sort */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          {/* Price Range Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Max Price:</span>
            <input
              type="range"
              min="15"
              max="60"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-32 accent-brand-600"
            />
            <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
              ${maxPrice}
            </span>
          </div>

          {/* In Stock toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
            <span className="text-xs font-semibold text-slate-700">In Stock Only</span>
          </label>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:border-brand-500"
            >
              <option value="featured">Featured / Bestselling</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="title-az">Title (A - Z)</option>
            </select>
          </div>

          {/* Reset button */}
          {(selectedCategory !== 'All' || searchQuery || maxPrice < 60 || inStockOnly) && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 ml-auto sm:ml-0"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-600">
          Showing <span className="font-bold text-slate-900">{filteredAndSortedBooks.length}</span>{' '}
          {filteredAndSortedBooks.length === 1 ? 'book' : 'books'}
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
        </p>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filteredAndSortedBooks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No books found</h3>
          <p className="text-sm text-slate-500">
            We couldn't find any books matching your criteria. Try adjusting your filters or search query.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedBooks.map((book) => (
            <BookCard key={book.id} book={book} onQuickView={onQuickView} />
          ))}
        </div>
      )}
    </div>
  );
};
