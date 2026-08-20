import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MessageSquare, Sparkles, ArrowRight, ShieldCheck, Truck, Star, Headphones, PackageCheck, Instagram, Film, Gift } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const HomePage = () => {
  const { products, settings } = useStore();

  const availableProducts = products.filter(p => p.available !== false);
  const featuredProducts = availableProducts.slice(0, 8);

  const categoriesWithEmojis = [
    { name: 'Mobile Charm', emoji: '📱', desc: 'Cute mobile charms & phone straps' },
    { name: 'Bracelet', emoji: '📿', desc: 'Handmade & trendy bracelets' },
    { name: 'Toys', emoji: '🧸', desc: 'Cute plush & figurine toys' },
    { name: 'Miniature', emoji: '🎨', desc: 'Resin & ceramic miniatures' },
    { name: 'Keychain', emoji: '🔑', desc: 'Aesthetic & charm keychains' },
    { name: 'Watch', emoji: '⌚', desc: 'Trendy & stylish watches' }
  ];

  const instagramHandle = settings.instagramProfileUrl ? 'ss_trendy_mart' : 'ss_trendy_mart';

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section (Warm Orange/Coral Theme) */}
      <section className="relative overflow-hidden hero-gradient text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-2xl mt-4">
        {/* Background decorative glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          {/* Logo Badge in Hero */}
          <div className="flex justify-center">
            <img
              src="/logo.svg"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.jpg'; }}
              alt="SS Trendy Mart Hand Crafted Logo"
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white/40 shadow-2xl object-cover hover:scale-105 transition-transform"
            />
          </div>

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide text-warm-100 shadow-inner">
            <Sparkles className="w-4 h-4 text-warm-300 animate-spin" />
            Hand Crafted • Mobile Charm • Bracelet • Toys • Miniature • Keychain • Watch
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            SS Trendy Mart 🛍️
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-warm-100 max-w-2xl mx-auto">
            “Trendy Products. Easy Shopping.”
          </p>

          <p className="text-sm sm:text-base text-warm-100/90 max-w-xl mx-auto leading-relaxed font-medium">
            Browse our hand-picked catalog of high quality mobile charms, handmade bracelets, cute toys, miniatures, keychains, and watches.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-900 hover:bg-warm-100 font-black text-base rounded-2xl shadow-xl hover:scale-105 transition-all"
            >
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              Shop Catalog 🛍️
            </Link>

            <a
              href={`https://wa.me/91${settings.ownerPhone}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-xl hover:scale-105 transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              WhatsApp ({settings.ownerPhone})
            </a>
          </div>
        </div>
      </section>

      {/* 2. Category Cards Section (With Emojis & 3D Hover) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-brand-600 uppercase tracking-widest">
            Explore Categories
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            Browse By Category 🎨
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesWithEmojis.map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?search=${encodeURIComponent(cat.name)}`}
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all card-3d text-center space-y-2 flex flex-col justify-between"
            >
              <div className="text-3xl mx-auto p-3 rounded-2xl bg-warm-100 w-16 h-16 flex items-center justify-center">
                {cat.emoji}
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-gray-900 line-clamp-1">{cat.name}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <span className="text-xs font-extrabold text-brand-600 uppercase tracking-widest">
              🔥 Trending Catalog Items
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Featured Products ✨
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors group"
          >
            Explore All Products ({products.length})
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. INSTAGRAM SECTION (Account: ss_trendy_mart) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 via-coral-500 to-amber-500 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
              <Instagram className="w-4 h-4" /> Official Instagram
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Follow SS Trendy Mart on Instagram 📸
            </h2>
            <p className="text-xs text-orange-100 max-w-lg">
              Check out our official Instagram account <strong>@{instagramHandle}</strong> for product Reels, customer reviews, unboxings, and new arrivals!
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href={settings.instagramProfileUrl || `https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-brand-900 hover:bg-orange-50 font-black text-sm rounded-2xl shadow-lg hover:scale-105 transition-all"
            >
              <Instagram className="w-5 h-5 text-brand-600" /> Visit @{instagramHandle}
            </a>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="bg-gradient-to-b from-cream-50 to-peach-100/40 py-16 px-4 sm:px-6 lg:px-8 border-y border-orange-100">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-brand-600 uppercase tracking-widest">
              Why Customers Love Us
            </span>
            <h2 className="text-3xl font-black text-gray-900">
              Why Choose SS Trendy Mart? 💖
            </h2>
            <p className="text-sm text-gray-600">
              We make shopping for trendy products simple, personal, and reliable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto text-xl font-bold">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Easy Ordering 🛒</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Add products to your cart and submit details in seconds. No complex checkout steps.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
                <PackageCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Multiple Products 📦</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Browse our complete catalog extracted directly from the official owner PDF portfolio.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">WhatsApp Support 💬</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Direct personal communication with the business owner for custom pricing & order tracking.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-coral-100 text-coral-600 flex items-center justify-center mx-auto text-xl font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Trusted Service ⭐</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Manual payment collection upon owner confirmation gives you total security and trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WhatsApp CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 max-w-xl text-center md:text-left z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
              <Headphones className="w-3.5 h-3.5" /> Need Assistance?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Need help? Chat with us on WhatsApp 💬
            </h2>
            <p className="text-sm text-emerald-100">
              Have questions about product details or custom orders? Reach out directly to our team!
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 z-10">
            <span className="text-xs text-emerald-200 font-semibold uppercase tracking-wider">
              Business WhatsApp Number
            </span>
            <a
              href={`https://wa.me/91${settings.ownerPhone}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-800 hover:bg-emerald-50 font-black text-lg rounded-2xl shadow-lg hover:scale-105 transition-all"
            >
              <MessageSquare className="w-6 h-6 text-emerald-600" />
              {settings.ownerPhone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
