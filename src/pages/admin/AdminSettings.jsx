import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Save, Phone, Store, Lock, CheckCircle2, RefreshCw, Tag, Plus, Trash2, Instagram } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSettings = () => {
  const { settings, updateSettings, resetToDefaultCatalog, coupons, addCoupon, deleteCoupon, toggleCouponStatus, isAdminLoggedIn } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    storeName: settings.storeName || 'SS Trendy Mart',
    ownerPhone: settings.ownerPhone || '9342044060',
    tagline: settings.tagline || 'Trendy Products. Easy Shopping.',
    adminPassword: settings.adminPassword || 'admin123',
    instagramProfileUrl: settings.instagramProfileUrl || 'https://instagram.com/sstrendymart'
  });

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    discount: '',
    minSpend: '',
    description: ''
  });

  const [savedToast, setSavedToast] = useState(false);
  const [couponToast, setCouponToast] = useState(false);

  React.useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  const handleSubmitSettings = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim() || !newCoupon.discount) return;

    addCoupon(newCoupon);
    setNewCoupon({ code: '', type: 'percentage', discount: '', minSpend: '', description: '' });
    setCouponToast(true);
    setTimeout(() => setCouponToast(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Store Settings & Instagram Integration</h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage business phone number, Instagram profile link, admin password, and discount coupon codes.
        </p>
      </div>

      {/* 1. Coupon Management Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">Manage Promo Coupons</h2>
              <p className="text-xs text-gray-500">Create discount codes for customer checkout</p>
            </div>
          </div>
          {couponToast && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Coupon Added!
            </span>
          )}
        </div>

        {/* Existing Coupons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {coupons.map(c => (
            <div key={c.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="font-black text-brand-600 text-sm tracking-wider uppercase">{c.code}</span>
                <button
                  onClick={() => toggleCouponStatus(c.id)}
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}
                >
                  {c.active ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="text-xs text-gray-700 font-extrabold">
                {c.type === 'percentage' ? `${c.discount}% OFF` : `₹${c.discount} Flat OFF`}
                {c.minSpend > 0 && <span className="text-[10px] text-gray-500 font-normal block">Min Spend: ₹{c.minSpend}</span>}
              </div>

              <p className="text-[11px] text-gray-500 line-clamp-1">{c.description}</p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => deleteCoupon(c.id)}
                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Coupon Form */}
        <form onSubmit={handleAddCoupon} className="pt-4 border-t border-gray-100 space-y-4">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Create New Coupon Code</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              required
              placeholder="Code (e.g. SUMMER15)"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
              className="px-3 py-2 text-xs font-bold uppercase bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
            />

            <select
              value={newCoupon.type}
              onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
              className="px-3 py-2 text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
            >
              <option value="percentage">Percentage (%) OFF</option>
              <option value="flat">Flat Amount (₹) OFF</option>
            </select>

            <input
              type="number"
              required
              placeholder="Discount Value"
              value={newCoupon.discount}
              onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
              className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
            />

            <input
              type="number"
              placeholder="Min Spend (₹)"
              value={newCoupon.minSpend}
              onChange={(e) => setNewCoupon({ ...newCoupon, minSpend: e.target.value })}
              className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Short Description (e.g. 15% discount on all figurines)"
              value={newCoupon.description}
              onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
              className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Coupon
            </button>
          </div>
        </form>
      </div>

      {/* 2. Store Settings & Instagram Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3">General Store & Instagram Profile</h2>

        <form onSubmit={handleSubmitSettings} className="space-y-5">
          {/* Store Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Store Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
              />
              <Store className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Business Phone / WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Business Owner Phone / WhatsApp Number *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.ownerPhone}
                onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none font-bold text-emerald-800"
              />
              <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Instagram Profile URL */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Instagram Profile URL (Optional - Controls Homepage Instagram Banner)
            </label>
            <div className="relative">
              <input
                type="url"
                value={formData.instagramProfileUrl}
                onChange={(e) => setFormData({ ...formData, instagramProfileUrl: e.target.value })}
                placeholder="e.g. https://www.instagram.com/sstrendymart (leave blank to hide)"
                className="w-full pl-10 pr-4 py-3 text-sm bg-pink-50/50 border border-pink-200 rounded-xl focus:bg-white focus:border-pink-500 focus:outline-none"
              />
              <Instagram className="w-4 h-4 text-pink-600 absolute left-3.5 top-3.5" />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              If provided, an attractive "Follow SS Trendy Mart on Instagram" section will appear on the homepage.
            </p>
          </div>

          {/* Admin Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={formData.adminPassword}
                onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none font-mono"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-brand-500/25 transition-all"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>

            {savedToast && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Settings Saved!
              </span>
            )}
          </div>
        </form>
      </div>

    </div>
  );
};
