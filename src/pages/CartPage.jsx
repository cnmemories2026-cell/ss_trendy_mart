import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingBag, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, appliedCoupon, applyCoupon, removeCoupon, settings } = useStore();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState({ message: '', error: false });

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minSpend) {
    discountAmount = appliedCoupon.type === 'percentage'
      ? Math.round((subtotal * appliedCoupon.discount) / 100)
      : appliedCoupon.discount;
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponStatus({ message: '', error: false });
    const result = applyCoupon(couponInput, subtotal);
    setCouponStatus({ message: result.message, error: !result.success });
    if (result.success) {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-brand-900 font-serif">Your Cart is Currently Empty</h2>
        <p className="text-xs text-brand-700 max-w-sm mx-auto">
          Explore our handcrafted catalog of Mobile Charms, Bracelets, Toys, Miniatures, Keychains, and Watches.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-200/60 pb-4">
        <div>
          <h1 className="text-3xl font-black text-brand-900 tracking-tight font-serif">Shopping Cart 🛒</h1>
          <p className="text-xs text-brand-700 mt-1">Review your handcrafted items before ordering.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, idx) => (
            <div
              key={`${item.id}_${item.selectedColor || ''}_${idx}`}
              className="bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 border border-brand-200/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Product Thumbnail */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-brand-50 border border-brand-200 p-1 flex items-center justify-center shrink-0">
                  <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{item.category}</span>
                  <h3 className="text-base font-extrabold text-brand-900">{item.name}</h3>
                  <div className="text-xs text-brand-700 font-bold mt-0.5">
                    {item.pdfCode} {item.selectedColor && <span className="ml-1 px-2 py-0.5 bg-purple-100 text-purple-900 rounded-md">Color: {item.selectedColor}</span>}
                  </div>
                  <div className="text-xs font-black text-brand-900 mt-1">
                    {item.price > 0 ? `₹${item.price} each` : 'Price – Contact us'}
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Subtotal */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-brand-100">
                <div className="flex items-center bg-brand-100/60 rounded-xl p-1 border border-brand-200">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 hover:bg-white rounded-lg text-brand-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-extrabold text-xs text-brand-900">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 hover:bg-white rounded-lg text-brand-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-brand-900">
                    {item.price > 0 ? `₹${item.price * item.quantity}` : '—'}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[11px] font-bold text-red-500 hover:text-red-700 mt-0.5"
                  >
                    Remove
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Right: Order Summary & Coupon */}
        <div className="space-y-6">
          <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-brand-200/60 shadow-sm space-y-5">
            <h3 className="text-lg font-black text-brand-900 border-b border-brand-200/60 pb-3 font-serif">Order Summary</h3>

            {/* Coupon Code Engine */}
            <div className="space-y-3 pt-1">
              <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider">
                Apply Promo Coupon
              </label>

              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>{appliedCoupon.code} ({appliedCoupon.discountAmount} OFF)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. TRENDY10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 text-xs font-bold uppercase bg-brand-50 border border-brand-200 rounded-xl focus:bg-white focus:border-brand-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-sm"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponStatus.message && (
                <p className={`text-xs font-bold flex items-center gap-1 ${couponStatus.error ? 'text-red-600' : 'text-emerald-700'}`}>
                  {couponStatus.error ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {couponStatus.message}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 pt-3 border-t border-brand-200/60 text-xs">
              <div className="flex justify-between text-brand-800">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-bold">₹{subtotal}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-brand-800">
                <span>Estimated Delivery</span>
                <span className="font-bold text-emerald-700">Calculated on Order</span>
              </div>

              <div className="flex justify-between text-base font-black text-brand-900 pt-3 border-t border-brand-200/60">
                <span>Total Amount</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            {/* Proceed to Checkout */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full inline-flex items-center justify-center gap-2 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-brand-600/25 active:scale-95 transition-all"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
