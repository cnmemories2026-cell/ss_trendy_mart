import React, { useState } from 'react';
import { Search, PackageCheck, Clock, MapPin, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { StatusBadge } from '../components/StatusBadge';
import { getOwnerWhatsAppLink } from '../utils/whatsapp';

export const OrderTrackingPage = () => {
  const { orders } = useStore();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedOrders, setMatchedOrders] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const cleanQuery = query.trim().toUpperCase().replace('#', '');
    const cleanPhone = query.trim().replace(/\D/g, '');

    const found = orders.filter(o => {
      const matchId = o.id.toUpperCase() === cleanQuery;
      const matchPhone = cleanPhone && o.customerPhone.replace(/\D/g, '').includes(cleanPhone);
      return matchId || matchPhone;
    });

    setMatchedOrders(found);
    setSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
          <PackageCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order Tracking</h1>
        <p className="text-xs text-gray-500">
          Enter your Order ID (e.g. #SS001) or Mobile Phone Number to check your live order status.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Order ID (#SS001) or Phone Number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-brand-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-4" />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-md transition-colors"
          >
            Track Order
          </button>
        </form>
      </div>

      {/* Results Section */}
      {searched && (
        <div className="space-y-6">
          {matchedOrders.length > 0 ? (
            matchedOrders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-2">
                  <div>
                    <span className="text-xs font-bold text-gray-400">Order Reference</span>
                    <h3 className="text-2xl font-black text-brand-600">#{order.id}</h3>
                    <p className="text-xs text-gray-500">
                      Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-left sm:text-right space-y-1">
                    <span className="text-xs font-bold text-gray-400 block">Current Status</span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-gray-400 font-medium block">Customer Name</span>
                    <strong className="text-gray-900 text-sm">{order.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">Mobile Phone</span>
                    <strong className="text-gray-900 text-sm">{order.customerPhone}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-400 font-medium block">Delivery Address</span>
                    <strong className="text-gray-900">{order.deliveryAddress}</strong>
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Purchased Products</h4>
                  <div className="space-y-2">
                    {order.products.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl text-xs">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-50 border" />
                          <div>
                            <h5 className="font-bold text-gray-900">{item.name}</h5>
                            <span className="text-gray-500">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="font-extrabold text-gray-900">
                          {item.price && item.price > 0 ? `₹${item.price * item.quantity}` : 'Contact us'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-100 gap-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Total: </span>
                    <strong className="font-extrabold text-brand-600 text-base">
                      {order.total > 0 ? `₹${order.total.toLocaleString('en-IN')}` : 'To be confirmed by owner'}
                    </strong>
                  </div>

                  <a
                    href={getOwnerWhatsAppLink(order)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" /> Message Owner on WhatsApp
                  </a>
                </div>

              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center space-y-3 max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900">No Order Found</h3>
              <p className="text-xs text-gray-500">
                We could not find any order matching "{query}". Please check your Order ID or phone number.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
