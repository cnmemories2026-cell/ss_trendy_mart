import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, Clock, Sparkles, Tag, CheckCircle2, X, MessageSquare, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getOwnerWhatsAppLink } from '../utils/whatsapp';

export const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, applyCoupon, removeCoupon, appliedCoupon, settings } = useStore();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const hasPricedItems = cart.some(item => item.price && item.price > 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount || 0 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponMessage(null);

    const res = applyCoupon(couponInput, subtotal);
    setCouponMessage(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm space-y-6 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Cart is Currently Empty</h2>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Browse our official PDF product catalog and add your favorite miniature items to the cart!
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-brand-500/25 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Browse PDF Products Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-brand-600" /> Shopping Cart
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review your selected products ({totalItems} items), apply coupon discounts, and proceed to order.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors w-fit border border-red-100"
        >
          <Trash2 className="w-3.5 h-3.5" /> Empty Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Active Offer Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-brand-900 to-indigo-900 text-white rounded-3xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-2xl text-amber-300 shrink-0">
                <Tag className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest">Available Promo Coupon</span>
                <h4 className="text-sm font-black text-white">Use Code: <span className="underline decoration-amber-400">TRENDY10</span></h4>
                <p className="text-[11px] text-purple-200">Get 10% instant discount on all catalog items!</p>
              </div>
            </div>

            <button
              onClick={() => {
                setCouponInput('TRENDY10');
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs rounded-xl shadow-md transition-all whitespace-nowrap self-stretch sm:self-auto text-center"
            >
              Use TRENDY10
            </button>
          </div>

          {/* Cart Item Cards */}
          <div className="space-y-3">
            {cart.map(item => {
              const itemKey = item.cartItemId || item.id;
              return (
                <div
                  key={itemKey}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  {/* Thumbnail & Product Info */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-2xl object-cover bg-gray-50 border border-gray-100 shadow-sm"
                      />
                      <span className="absolute -top-2 -left-2 bg-brand-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                        {item.pdfCode || 'PDF'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-brand-600 uppercase tracking-widest">
                        {item.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-extrabold text-gray-900 line-clamp-1">
                        {item.name}
                      </h3>
                      {item.selectedColor && (
                        <div className="inline-flex items-center text-[11px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          🎨 Color: {item.selectedColor}
                        </div>
                      )}
                      <div>
                        {item.price && item.price > 0 ? (
                          <span className="text-xs font-extrabold text-gray-700">₹{item.price} per item</span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Clock className="w-3 h-3 mr-1 text-amber-600" /> Price – Contact us
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls, Total & Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
                      <button
                        onClick={() => updateCartQuantity(itemKey, item.quantity - 1)}
                        className="p-1.5 hover:bg-white rounded-lg text-gray-700 transition-colors"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-extrabold text-xs text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(itemKey, item.quantity + 1)}
                        disabled={item.variantStock !== undefined && item.quantity >= item.variantStock}
                        className="p-1.5 hover:bg-white rounded-lg text-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={item.variantStock !== undefined && item.quantity >= item.variantStock ? "Maximum available stock reached" : "Increase quantity"}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-20">
                      {item.price && item.price > 0 ? (
                        <span className="text-base font-black text-gray-900">₹{item.price * item.quantity}</span>
                      ) : (
                        <span className="text-[11px] text-amber-600 font-bold">To be quoted</span>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(itemKey)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3">Order Price Summary</h2>

          {/* Coupon Input Form */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Have a Promo Coupon?
            </label>
            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>{appliedCoupon.code}</span>
                  <span className="text-emerald-700 font-semibold">(-₹{appliedCoupon.discountAmount})</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 text-emerald-700 hover:text-red-600 transition-colors"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. TRENDY10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2.5 text-xs font-bold uppercase bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
                >
                  Apply
                </button>
              </form>
            )}

            {couponMessage && (
              <p className={`text-xs font-bold mt-1 ${couponMessage.success ? 'text-emerald-600' : 'text-red-500'}`}>
                {couponMessage.message}
              </p>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-3 text-xs pt-3 border-t border-gray-100">
            <div className="flex justify-between text-gray-600">
              <span>Total Items:</span>
              <span className="font-bold text-gray-900">{totalItems} Products</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              {hasPricedItems ? (
                <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
              ) : (
                <span className="font-semibold text-amber-600">Price – Contact us</span>
              )}
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Coupon Discount ({appliedCoupon.code}):</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee:</span>
              <span className="font-bold text-emerald-600">Calculated by Owner</span>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
              <span className="text-sm font-black text-gray-900">Total Payable:</span>
              {hasPricedItems ? (
                <span className="text-2xl font-black text-brand-600">₹{finalTotal.toLocaleString('en-IN')}</span>
              ) : (
                <span className="text-sm font-bold text-amber-600">Price – Contact us</span>
              )}
            </div>
          </div>

          {/* Direct Checkout Button */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-500/25 active:scale-95 transition-all"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/91${settings.ownerPhone}?text=${encodeURIComponent(`Hi SS Trendy Mart, I have ${totalItems} products in my cart. Please confirm my order.`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Quick Order via WhatsApp
            </a>
          </div>

          {/* Payment Notice */}
          <div className="p-3 bg-purple-50 text-purple-900 rounded-2xl text-[11px] space-y-1 border border-purple-100">
            <div className="flex items-center gap-1.5 font-bold text-purple-800">
              <ShieldCheck className="w-4 h-4 text-brand-600" /> Direct WhatsApp Confirmation
            </div>
            <p className="text-purple-700 leading-normal">
              No online payment or UPI card is needed now. After placing your order, the owner will personally contact you on WhatsApp to collect payment manually.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
