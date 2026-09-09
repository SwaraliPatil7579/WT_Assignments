import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { BookCover } from './BookCover';

interface CartDrawerProps {
  onCheckout: () => void;
  onExplore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onExplore }) => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    totalAmount,
    promoCode,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const toast = useToast();
  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const result = applyPromoCode(couponInput);
    if (result.success) {
      toast.success('Coupon Applied!', result.message);
      setCouponInput('');
    } else {
      toast.error('Invalid Coupon', result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">Your Cart</h2>
                <p className="text-xs text-slate-500">
                  {items.length} {items.length === 1 ? 'unique title' : 'unique titles'}
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-20 h-20 rounded-3xl bg-brand-50 text-brand-500 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Your cart is empty</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">
                  Discover remarkable reads from our vast catalog and fill your reading basket!
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    onExplore();
                  }}
                  className="mt-6 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
                >
                  Explore Books
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.book.id} className="pt-4 first:pt-0 flex gap-4 items-start">
                    {/* Thumbnail */}
                    <BookCover
                      coverImage={item.book.coverImage}
                      title={item.book.title}
                      author={item.book.author}
                      category={item.book.category}
                      size="sm"
                      className="w-16 h-22 rounded-xl border border-slate-200"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">
                          {item.book.title}
                        </h4>
                        <button
                          onClick={() => {
                            removeFromCart(item.book.id);
                            toast.info('Item Removed', `Removed from cart.`);
                          }}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{item.book.author}</p>
                      <p className="text-xs font-semibold text-brand-600 mt-1">
                        ${item.book.price.toFixed(2)} each
                      </p>

                      {/* Quantity adjustment */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-black text-slate-900">
                          ${(item.book.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={clearCart}
                    className="text-xs text-slate-400 hover:text-rose-600 font-semibold transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear entire cart
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50/70 space-y-4">
              {/* Promo Code Form */}
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Code: {promoCode}</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-emerald-700 hover:text-rose-600 font-semibold text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon code (e.g. BOOKWORM10)"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500 bg-white uppercase font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-slate-800">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase tracking-wider">
                        FREE
                      </span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-[11px] text-amber-600">
                    Add ${(50 - subtotal).toFixed(2)} more for Free Shipping!
                  </p>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  closeCart();
                  onCheckout();
                }}
                className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
