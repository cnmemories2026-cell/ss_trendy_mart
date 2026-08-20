import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MessageSquare, Sparkles, ArrowRight, ShieldCheck, Truck, Headphones, PackageCheck, Instagram, Film } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

const LOGO_SRC = "file:///C:/Users/chand/.gemini/antigravity/brain/a34f9639-09bb-4036-8430-167eb5d2a829/.user_uploaded/media_1787203872270.jpg";

export const HomePage = () => {
  const { products, settings } = useStore();

  const availableProducts = products.filter(p => p.available !== false);
  const featuredProducts = availableProducts.slice(0, 8);

  // 6 Official User Categories
  const officialCategories = [
    { name: 'Mobile Charm', emoji: '📱', desc: 'Handcrafted mobile straps & charms' },
    { name: 'Bracelet', emoji: '📿', desc: 'Trendy handcrafted beaded bracelets' },
    { name: 'Toys', emoji: '🧸', desc: 'Cute plushies & toy collectibles' },
    { name: 'Miniature', emoji: '🎨', desc: 'Detailed resin & ceramic miniatures' },
    { name: 'Keychain', emoji: '🔑', desc: 'Trendy keychains & bag charms' },
    { name: 'Watch', emoji: '⌚', desc: 'Fashionable watches & wristwear' }
  ];

  const instagramHandle = 'ss_trendy_mart';

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section (Hand Crafted Logo Theme Colors) */}
      <section className="relative overflow-hidden hero-gradient text-[#FDF8F2] py-20 px-4 sm:px-6 lg:px-8 rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-2xl mt-4">
        {/* Background Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4A373]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#8C5221]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Logo Badge in Hero */}
          <div className="flex justify-center">
            <img
              src={LOGO_SRC}
              alt="SS Trendy Mart Logo"
              className="w-28 h-28 rounded-full object-contain shadow-2xl border-4 border-gold-500 bg-[#FAF5EE] animate-bounce-subtle"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          <div className="inline-flex items-center gap-2 bg-[#FFFDF9]/15 backdrop-blur-md border border-[#D4A373]/30 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide text-gold-100 shadow-inner">
            <Sparkles className="w-4 h-4 text-gold-400 animate-spin" />
            Hand Crafted Portfolio & PDF Product Catalogue
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#FDF8F2] leading-tight font-serif">
            SS Trendy Mart
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-gold-200 max-w-2xl mx-auto">
            “Trendy Products. Easy Shopping.”
          </p>

          <p className="text-sm sm:text-base text-gold-100/90 max-w-xl mx-auto leading-relaxed font-medium">
            Explore Handcrafted Mobile Charms, Bracelets, Toys, Miniatures, Keychains, and Watches. Direct WhatsApp ordering with zero hassle.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FFFDF9] text-brand-900 hover:bg-gold-100 font-black text-base rounded-2xl shadow-xl hover:scale-105 transition-all"
            >
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              Shop Now 🛍️
            </Link>

            <a
              href={`https://wa.me/91${settings.ownerPhone}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base rounded-2xl shadow-xl hover:scale-105 transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              WhatsApp ({settings.ownerPhone})
            </a>
          </div>
        </div>
      </section>

      {/* 2. Official 6 Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-brand-600 uppercase tracking-widest">
            Handcrafted Collections
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-900 font-serif">
            Our Official Categories 🎨
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {officialCategories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?search=${encodeURIComponent(cat.name)}`}
              className="bg-[#FFFDF9] p-5 rounded-3xl border border-brand-200/60 shadow-sm hover:shadow-xl transition-all card-3d text-center space-y-3 flex flex-col justify-between"
            >
              <div className="text-3xl mx-auto p-3 rounded-2xl bg-brand-100/60 w-16 h-16 flex items-center justify-center">
                {cat.emoji}
              </div>
              <div>
                <h3 className="text-xs font-black text-brand-900 line-clamp-1 uppercase tracking-wide">{cat.name}</h3>
                <p className="text-[10px] text-brand-700/70 mt-1 line-clamp-2">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-brand-200/60 pb-4">
          <div>
            <span className="text-xs font-extrabold text-brand-600 uppercase tracking-widest">
              🔥 Handcrafted Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-900 tracking-tight mt-1 font-serif">
              Featured Products ✨
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-600 hover:text-brand-800 transition-colors group"
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
        <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-gold-600 rounded-3xl p-8 sm:p-10 text-[#FDF8F2] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-xs font-bold uppercase tracking-wider text-gold-200">
              <Instagram className="w-4 h-4 text-gold-400" /> Official Instagram
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif">
              Follow SS Trendy Mart on Instagram 📸
            </h2>
            <p className="text-xs text-gold-100 max-w-lg">
              Check out our official Instagram account <strong>@{instagramHandle}</strong> for product Reels, customer reviews, unboxings, and new arrivals!
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href={`https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FFFDF9] text-brand-900 hover:bg-gold-100 font-black text-sm rounded-2xl shadow-lg hover:scale-105 transition-all"
            >
              <Instagram className="w-5 h-5 text-brand-600" /> Visit @{instagramHandle}
            </a>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="bg-gradient-to-b from-brand-50/50 to-cream-200/30 py-16 px-4 sm:px-6 lg:px-8 border-y border-brand-200/50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-brand-600 uppercase tracking-widest">
              Why Customers Love Us
            </span>
            <h2 className="text-3xl font-black text-brand-900 font-serif">
              Why Choose SS Trendy Mart? 💖
            </h2>
            <p className="text-sm text-brand-800/80">
              We make shopping for handcrafted & trendy products simple, personal, and reliable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-brand-200/60 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto text-xl font-bold">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-900">Easy Ordering 🛒</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Add products to your cart and submit details in seconds. No complex checkout steps.
              </p>
            </div>

            <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-brand-200/60 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center mx-auto text-xl font-bold">
                <PackageCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-900">Multiple Products 📦</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Browse Mobile Charms, Bracelets, Toys, Miniatures, Keychains, and Watches.
              </p>
            </div>

            <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-brand-200/60 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-900">WhatsApp Support 💬</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Direct personal communication with the business owner for custom pricing & order tracking.
              </p>
            </div>

            <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-brand-200/60 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-900">Trusted Service ⭐</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Manual payment collection upon owner confirmation gives you total security and trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WhatsApp CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 max-w-xl text-center md:text-left z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
              <Headphones className="w-3.5 h-3.5" /> Need Assistance?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif">
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-900 hover:bg-emerald-50 font-black text-lg rounded-2xl shadow-lg hover:scale-105 transition-all"
            >
              <MessageSquare className="w-6 h-6 text-emerald-700" />
              {settings.ownerPhone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
