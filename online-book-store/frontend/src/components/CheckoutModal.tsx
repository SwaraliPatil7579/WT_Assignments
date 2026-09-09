import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShoppingBag, CreditCard, Banknote, QrCode, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Order, OrderPayload } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { items, subtotal, discount, shippingFee, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      setCustomerName(user.fullName || '');
      setCustomerEmail(user.email || '');
      setCustomerPhone(user.phone || '');
      setShippingAddress(user.address || '');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !shippingAddress) {
      toast.error('Missing Details', 'Please complete all required fields.');
      return;
    }

    if (items.length === 0) {
      toast.error('Cart Empty', 'Please add books to your cart first.');
      return;
    }

    setIsSubmitting(true);

    const payload: OrderPayload = {
      userId: user?.id,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod,
      items: items.map((item) => ({
        bookId: item.book.id,
        title: item.book.title,
        author: item.book.author,
        price: item.book.price,
        quantity: item.quantity,
        coverImage: item.book.coverImage,
      })),
      subtotal,
      discount,
      shippingFee,
      totalAmount,
    };

    try {
      const order = await api.orders.create(payload);
      setCompletedOrder(order);
      clearCart();
      toast.success('Order Placed!', `Order #${order.id?.slice(-6) || '101'} has been confirmed.`);
      onOrderSuccess(order);
    } catch (err: any) {
      console.error('Order creation failed:', err);
      toast.error('Checkout Failed', 'Unable to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={handleClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto z-10 border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                {completedOrder ? 'Order Confirmed!' : 'Checkout & Payment'}
              </h2>
              <p className="text-xs text-slate-500">
                {completedOrder
                  ? 'Thank you for supporting authors and literature'
                  : 'Fast, secure checkout backed by MongoDB'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {completedOrder ? (
          /* Order Confirmation Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Status: {completedOrder.status}
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Order Confirmed!
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                We’ve received your order and are preparing your books for dispatch. A confirmation receipt
                has been logged in the system.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3">
              <div className="flex justify-between text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-500">Order Reference:</span>
                <span className="font-mono font-bold text-slate-900">
                  {completedOrder.id || 'ORD-9842'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold text-slate-800">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Shipping Address:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[280px] truncate">
                  {completedOrder.shippingAddress}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-semibold text-slate-800">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-200 font-bold text-slate-900">
                <span>Total Paid / Payable:</span>
                <span className="text-brand-600">${completedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3.5 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                1. Shipping Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Street, City, State, ZIP"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                2. Select Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-brand-600 bg-brand-50/50 text-brand-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <Banknote className="w-6 h-6 mb-1.5 text-brand-600" />
                  <span className="text-xs font-bold">Cash on Delivery</span>
                  <span className="text-[10px] text-slate-400">Pay at doorstep</span>
                </label>

                <label
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'Credit / Debit Card'
                      ? 'border-brand-600 bg-brand-50/50 text-brand-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Credit / Debit Card"
                    checked={paymentMethod === 'Credit / Debit Card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <CreditCard className="w-6 h-6 mb-1.5 text-brand-600" />
                  <span className="text-xs font-bold">Cards</span>
                  <span className="text-[10px] text-slate-400">Visa, Mastercard</span>
                </label>

                <label
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'UPI / Instant Pay'
                      ? 'border-brand-600 bg-brand-50/50 text-brand-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="UPI / Instant Pay"
                    checked={paymentMethod === 'UPI / Instant Pay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <QrCode className="w-6 h-6 mb-1.5 text-brand-600" />
                  <span className="text-xs font-bold">UPI / QR</span>
                  <span className="text-[10px] text-slate-400">Instant scan</span>
                </label>
              </div>
            </div>

            {/* Order Summary Recap */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items ({items.length} titles):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping:</span>
                <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Total Due:</span>
                <span className="text-brand-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-base rounded-2xl shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <span>Confirm Order (${totalAmount.toFixed(2)})</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>256-bit Encrypted Transaction & Direct MongoDB Storage</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
