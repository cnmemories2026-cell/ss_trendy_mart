import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CheckCircle2, User, Phone, MessageSquare, MapPin, FileText, Sparkles, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CheckoutPage = () => {
  const { cart, placeOrder, appliedCoupon } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerWhatsApp: '',
    deliveryAddress: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500">Please add items to cart before proceeding to checkout.</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-bold text-sm rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Go to Catalog
        </Link>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!formData.customerName.trim()) errs.customerName = 'Full name is required';
    if (!formData.customerPhone.trim()) {
      errs.customerPhone = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.customerPhone.replace(/\D/g, ''))) {
      errs.customerPhone = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.deliveryAddress.trim()) errs.deliveryAddress = 'Delivery address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newOrder = placeOrder(formData);
    navigate(`/order-success/${newOrder.id}`);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount || 0 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/cart')}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Customer Details Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Customer Checkout</h1>
            <p className="text-xs text-gray-500 mt-1">
              Enter your details so the business owner can deliver your order and contact you on WhatsApp.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border ${errors.customerName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none`}
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
              {errors.customerName && <p className="text-xs text-red-500 mt-1 font-medium">{errors.customerName}</p>}
            </div>

            {/* Phone & WhatsApp Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mobile Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border ${errors.customerPhone ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none`}
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
                {errors.customerPhone && <p className="text-xs text-red-500 mt-1 font-medium">{errors.customerPhone}</p>}
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  WhatsApp Number (Optional)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Same as mobile if empty"
                    value={formData.customerWhatsApp}
                    onChange={(e) => setFormData({ ...formData, customerWhatsApp: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
                  />
                  <MessageSquare className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Complete Delivery Address *
              </label>
              <div className="relative">
                <textarea
                  rows="3"
                  placeholder="Door No, Street Name, Area, City, Pincode"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border ${errors.deliveryAddress ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none`}
                />
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
              {errors.deliveryAddress && <p className="text-xs text-red-500 mt-1 font-medium">{errors.deliveryAddress}</p>}
            </div>

            {/* Delivery Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Optional Notes for Business Owner
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Special timing preference or packaging request"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
                />
                <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black text-base rounded-2xl shadow-xl shadow-brand-500/30 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                Place Order Now
              </button>
            </div>
          </form>
        </div>

        {/* Order Review Sidebar */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-fit space-y-6">
          <h2 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3">Order Items ({totalItems})</h2>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
            {cart.map(item => (
              <div key={item.cartItemId || item.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-50 border" />
                  <div>
                    <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
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

          {/* Pricing Breakdown */}
          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>{subtotal > 0 ? `₹${subtotal.toLocaleString('en-IN')}` : 'To be quoted'}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Coupon ({appliedCoupon.code}):</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-gray-900 text-sm pt-2 border-t">
              <span>Total Amount:</span>
              <span className="text-brand-600 text-base">{finalTotal > 0 ? `₹${finalTotal.toLocaleString('en-IN')}` : 'To be quoted'}</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl text-xs space-y-1.5 border border-emerald-100">
            <div className="flex items-center gap-1.5 font-extrabold text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" /> WhatsApp Payment Notice
            </div>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              No online payment or UPI card is needed now. After placing your order, click the WhatsApp button to send your order directly to owner <strong>9342044060</strong>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
