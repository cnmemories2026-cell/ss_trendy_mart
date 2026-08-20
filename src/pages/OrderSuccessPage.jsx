import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, MessageSquare, ShoppingBag, ArrowRight, PackageCheck, Copy, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getOwnerWhatsAppLink } from '../utils/whatsapp';
import { StatusBadge } from '../components/StatusBadge';

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const { orders, settings } = useStore();
  const [copied, setCopied] = React.useState(false);

  const order = orders.find(o => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Order Not Found</h2>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-bold text-sm">
          Return Home
        </Link>
      </div>
    );
  }

  const whatsappLink = getOwnerWhatsAppLink(order);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(`#${order.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Success Card Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Order Submitted Successfully!
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Thank you for ordering from SS Trendy Mart.
          </h1>
          <p className="text-sm text-gray-600 max-w-lg mx-auto">
            Our team will contact you through WhatsApp regarding payment and order confirmation.
          </p>
        </div>

        {/* Order ID Badge */}
        <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 px-5 py-3 rounded-2xl">
          <span className="text-xs text-gray-500 font-semibold uppercase">Order ID:</span>
          <span className="text-xl font-black text-brand-600">#{order.id}</span>
          <button
            onClick={handleCopyOrderId}
            className="p-1.5 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-gray-200 transition-colors"
            title="Copy Order ID"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary WhatsApp Action Button */}
        <div className="pt-2">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all"
          >
            <MessageSquare className="w-6 h-6" />
            Send Order Details to WhatsApp ({settings.ownerPhone})
          </a>
          <p className="text-xs text-gray-400 mt-2">
            Clicking this will automatically send your order items & address to the owner's WhatsApp!
          </p>
        </div>
      </div>

      {/* Order Details Breakdown Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-lg font-extrabold text-gray-900">Order Overview</h2>
          <StatusBadge status={order.status} />
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div>
            <span className="text-gray-400 font-medium block">Customer Name</span>
            <strong className="text-gray-900 text-sm">{order.customerName}</strong>
          </div>
          <div>
            <span className="text-gray-400 font-medium block">Phone / WhatsApp</span>
            <strong className="text-gray-900 text-sm">{order.customerPhone}</strong>
          </div>
          <div className="sm:col-span-2">
            <span className="text-gray-400 font-medium block">Delivery Address</span>
            <strong className="text-gray-900 text-xs leading-relaxed">{order.deliveryAddress}</strong>
          </div>
        </div>

        {/* Ordered Products Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Ordered Products</h3>
          <div className="space-y-2">
            {order.products.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-50 border" />
                  <div>
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <div className="flex items-center gap-2 text-gray-500">
                      <span>Qty: {item.quantity}</span>
                      {item.selectedColor && (
                        <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                          {item.selectedColor}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="font-extrabold text-gray-900">
                  {item.price && item.price > 0 ? `₹${item.price * item.quantity}` : 'Contact us'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-sm">
          <span className="font-bold text-gray-700">Total Amount:</span>
          <span className="text-xl font-black text-brand-600">
            {order.total > 0 ? `₹${order.total.toLocaleString('en-IN')}` : 'To be confirmed by owner'}
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors"
        >
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
        <Link
          to="/tracking"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
        >
          <PackageCheck className="w-4 h-4" /> Track Order Status
        </Link>
      </div>

    </div>
  );
};
