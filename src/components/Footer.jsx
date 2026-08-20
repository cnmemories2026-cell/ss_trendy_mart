import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, MessageSquare, ShieldCheck, Heart, MapPin, Truck, CheckCircle2, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer = () => {
  const { settings } = useStore();
  const location = useLocation();

  // CRITICAL FIX: Footer Home link ALWAYS resets scroll position to absolute top (top: 0)
  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  return (
    <footer className="bg-gray-950 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-gray-800">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-900/60 border border-gray-800/80">
            <div className="p-3 rounded-xl bg-brand-600/20 text-brand-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">WhatsApp Support</h4>
              <p className="text-xs text-gray-400">Personal order assistance 24/7</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-900/60 border border-gray-800/80">
            <div className="p-3 rounded-xl bg-amber-600/20 text-amber-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Easy Ordering</h4>
              <p className="text-xs text-gray-400">No online payment required</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-900/60 border border-gray-800/80">
            <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Trusted Quality</h4>
              <p className="text-xs text-gray-400">Direct from product PDF catalog</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-900/60 border border-gray-800/80">
            <div className="p-3 rounded-xl bg-orange-600/20 text-orange-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Fast Processing</h4>
              <p className="text-xs text-gray-400">Instant owner notifications</p>
            </div>
          </div>
        </div>

        {/* Footer Main Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.jpg'; }}
                alt="SS Trendy Mart Logo"
                className="w-10 h-10 rounded-2xl border border-gray-800 object-cover shadow-md"
              />
              <span className="text-xl font-black text-white">SS Trendy Mart</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your one-stop destination for trendy miniature figurines, cute collectibles, and unique gifting items. Modern e-commerce experience powered by direct WhatsApp ordering.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/91${settings.ownerPhone}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Chat on WhatsApp ({settings.ownerPhone})
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Quick Navigation</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" onClick={handleHomeClick} className="hover:text-brand-400 transition-colors">
                  Home Page
                </Link>
              </li>
              <li><Link to="/products" className="hover:text-brand-400 transition-colors">All Products Catalog</Link></li>
              <li><Link to="/videos" className="hover:text-brand-400 transition-colors">Videos & Reels Gallery</Link></li>
              <li><Link to="/cart" className="hover:text-brand-400 transition-colors">Shopping Cart</Link></li>
              <li><Link to="/tracking" className="hover:text-brand-400 transition-colors">Track Your Order</Link></li>
              <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Business Info */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Business Details</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <span>Call / WhatsApp: <strong className="text-white">{settings.ownerPhone}</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <span>SS Trendy Mart Headquarters, Tamil Nadu, India</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <span>Official PDF Catalog Products</span>
              </li>
            </ul>
          </div>

          {/* Admin Area Link (Preserved at bottom) */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Store Administration</h3>
            <p className="text-xs text-gray-400 mb-4">
              Authorized admin panel to manage product pricing, names, catalog items, stock levels, and customer orders.
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-orange-300 hover:text-white rounded-xl font-extrabold text-xs border border-gray-800 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              Owner Admin Panel Login
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} SS Trendy Mart. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-brand-500 fill-current" /> for SS Trendy Mart
          </p>
        </div>

      </div>
    </footer>
  );
};
