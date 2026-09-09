import React from 'react';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { Book } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

import { BookCover } from './BookCover';

interface BookCardProps {
  book: Book;
  onQuickView: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onQuickView }) => {
  const { addToCart, items } = useCart();
  const toast = useToast();

  const isItemInCart = items.some((item) => item.book.id === book.id);
  const discountPercent =
    book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book, 1);
    toast.success('Added to Cart', `"${book.title.slice(0, 30)}..." added.`);
  };

  return (
    <div
      onClick={() => onQuickView(book)}
      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-book-hover hover:border-brand-300 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden select-none">
        <BookCover
          coverImage={book.coverImage}
          title={book.title}
          author={book.author}
          category={book.category}
          className="group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(book);
              }}
              className="p-2 rounded-xl bg-white/90 text-slate-800 hover:bg-white hover:text-brand-600 shadow-md transition-transform hover:scale-110"
              title="Quick Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs font-semibold text-white/95 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg self-start">
            Click for full synopsis
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {book.featured && (
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-brand-600 text-white rounded-lg shadow-sm">
              Featured
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white rounded-md shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Book Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider truncate">
              {book.category}
            </span>
            <div className="flex items-center gap-1 shrink-0 text-amber-500 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{book.rating.toFixed(1)}</span>
              <span className="text-slate-400 text-[10px] font-normal">({book.reviewsCount})</span>
            </div>
          </div>

          {/* Book Title */}
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-slate-500 mt-1 font-medium truncate">
            by <span className="text-slate-700">{book.author}</span>
          </p>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900">
                ${book.price.toFixed(2)}
              </span>
              {book.originalPrice > book.price && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  ${book.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block">In Stock</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
              isItemInCart
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                : 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-500/20 hover:shadow-md'
            }`}
          >
            {isItemInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
