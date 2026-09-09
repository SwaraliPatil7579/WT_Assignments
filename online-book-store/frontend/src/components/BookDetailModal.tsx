import React, { useState } from 'react';
import { X, Star, ShoppingBag, Truck, ShieldCheck, BookOpen, Layers, Check } from 'lucide-react';
import { Book } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

import { BookCover } from './BookCover';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onDirectCheckout?: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose, onDirectCheckout }) => {
  const { addToCart, openCart } = useCart();
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);

  if (!book) return null;

  const handleAdd = () => {
    addToCart(book, quantity);
    toast.success('Added to Cart', `${quantity}x "${book.title.slice(0, 25)}..." added.`);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(book, quantity);
    onClose();
    if (onDirectCheckout) {
      onDirectCheckout();
    } else {
      openCart();
    }
  };

  const discountPercent =
    book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto z-10 border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Cover Column */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative aspect-[3/4] w-full max-w-[260px] rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-slate-100">
              <BookCover
                coverImage={book.coverImage}
                title={book.title}
                author={book.author}
                category={book.category}
              />
              {discountPercent > 0 && (
                <div className="absolute top-3 left-3 bg-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-md">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Quick specifications */}
            <div className="w-full mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>ISBN:</span>
                <span className="font-mono text-slate-800 font-semibold">{book.isbn}</span>
              </div>
              {book.publisher && (
                <div className="flex justify-between text-slate-500">
                  <span>Publisher:</span>
                  <span className="text-slate-800 font-semibold">{book.publisher}</span>
                </div>
              )}
              {book.pages && (
                <div className="flex justify-between text-slate-500">
                  <span>Pages:</span>
                  <span className="text-slate-800 font-semibold">{book.pages} pages</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Stock Status:</span>
                <span className="text-emerald-600 font-semibold">
                  {book.inStock ? `In Stock (${book.stockQuantity} available)` : 'Out of stock'}
                </span>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              {/* Category Pill */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                  {book.category}
                </span>
                {book.featured && (
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                    Bestseller
                  </span>
                )}
              </div>

              {/* Title & Author */}
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {book.title}
              </h2>
              <p className="text-sm font-medium text-slate-600 mt-1">
                By <span className="text-slate-900 font-semibold">{book.author}</span>
              </p>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(book.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-800">{book.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">({book.reviewsCount} customer reviews)</span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl font-black text-slate-900">${book.price.toFixed(2)}</span>
                {book.originalPrice > book.price && (
                  <span className="text-base text-slate-400 line-through">
                    ${book.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Synopsis */}
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Synopsis & Overview
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed max-h-48 overflow-y-auto pr-1">
                  {book.description}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 mt-6 border-t border-slate-200 space-y-4">
              {/* Quantity selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-bold text-sm text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(book.stockQuantity, quantity + 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Subtotal: ${(book.price * quantity).toFixed(2)}
                </span>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAdd}
                  className="w-full py-3 px-4 rounded-xl border-2 border-brand-600 text-brand-600 hover:bg-brand-50 font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
