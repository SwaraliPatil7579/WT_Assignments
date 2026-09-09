import React, { useEffect, useState } from 'react';
import { Package, Clock, ShoppingBag, ArrowRight, CheckCircle2, ChevronRight, Search } from 'lucide-react';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BookCover } from '../components/BookCover';

interface OrdersPageProps {
  onNavigate: (page: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [lookupEmail, setLookupEmail] = useState(user?.email || '');

  const fetchOrders = async (emailToUse?: string) => {
    setLoading(true);
    try {
      if (user?.id) {
        const data = await api.orders.getByUser(user.id);
        setOrders(data);
      } else if (emailToUse) {
        const data = await api.orders.getByEmail(emailToUse);
        setOrders(data);
      } else {
        const all = await api.orders.getAll();
        setOrders(all);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(user?.email);
  }, [user]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupEmail) {
      fetchOrders(lookupEmail);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Order Management</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Order History</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track real-time statuses, view past receipts, and manage purchased books
          </p>
        </div>

        {/* Email Lookup form if not signed in or wants to check another email */}
        <form onSubmit={handleLookup} className="flex gap-2 w-full md:w-auto">
          <input
            type="email"
            value={lookupEmail}
            onChange={(e) => setLookupEmail(e.target.value)}
            placeholder="Search orders by email..."
            className="px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500 bg-slate-50 text-slate-900"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" />
            Find
          </button>
        </form>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No orders found</h3>
          <p className="text-sm text-slate-500">
            You haven't placed any orders with this email yet. Explore our bestsellers and start reading today!
          </p>
          <button
            onClick={() => onNavigate('catalogue')}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 mx-auto"
          >
            <span>Browse Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Top Order Bar */}
              <div className="p-4 sm:p-6 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Order ID
                  </span>
                  <p className="font-mono font-bold text-slate-800 text-sm">#{order.id}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Date Placed
                  </span>
                  <p className="font-semibold text-slate-700">
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Today'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Total Amount
                  </span>
                  <p className="font-black text-slate-900 text-sm">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Payment
                  </span>
                  <p className="font-semibold text-slate-700">{order.paymentMethod}</p>
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 sm:p-6 divide-y divide-slate-100">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                    <BookCover
                      coverImage={item.coverImage}
                      title={item.title}
                      author={item.author}
                      size="sm"
                      className="w-12 h-16 rounded-lg border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                      <p className="text-xs text-slate-500 truncate">by {item.author}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Qty: <span className="font-bold text-slate-700">{item.quantity}</span> ×{' '}
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-sm font-black text-slate-900 shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Shipping Address */}
              <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                <span>Shipping to: <strong className="text-slate-700">{order.shippingAddress}</strong> ({order.customerName})</span>
                <span className="text-brand-600 font-semibold cursor-pointer hover:underline">Download Invoice</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
