import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, PhoneCall, Menu, X, PackageCheck, Sparkles, Film } from 'lucide-react';
import { useStore } from '../context/StoreContext';

// Relative Public Logo Image Path (Fixes Vercel & Production Blank Screen Issues!)
const LOGO_SRC = "/logo.jpg";

export const Navbar = () => {
  const { cart, settings } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // CRITICAL FIX: Home Click ALWAYS resets scroll position to absolute top (top: 0)
  const handleHomeClick = (e) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EADBC8] shadow-sm">
      {/* Top Announcement Banner */}
      <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-brand-900 text-[#FDF8F2] text-xs font-medium py-1.5 px-4 text-center">
        <div className="hidden sm:flex items-center justify-between max-w-7xl mx-auto w-full">
          <span className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            Hand Crafted • <strong>SS Trendy Mart</strong> • Special Coupon: <strong className="text-gold-400">TRENDY10</strong> (10% OFF)
          </span>
          <span className="flex items-center gap-3">
            <a
              href={`https://wa.me/91${settings.ownerPhone}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1 text-gold-100 hover:text-white font-bold"
            >
              <PhoneCall className="w-3 h-3 text-gold-400" /> WhatsApp: {settings.ownerPhone}
            </a>
          </span>
        </div>
        <div className="sm:hidden text-center w-full font-bold">
          Hand Crafted • SS Trendy Mart • WhatsApp: {settings.ownerPhone}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo with Public Logo Asset */}
          <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3 group">
            <img
              src={LOGO_SRC}
              alt="SS Trendy Mart Logo"
              className="w-14 h-14 rounded-full object-contain shadow-md border-2 border-brand-300 group-hover:scale-105 transition-transform bg-[#FAF5EE]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <div>
              <span className="text-xl sm:text-2xl font-black text-brand-900 tracking-tight flex items-center gap-1">
                SS Trendy <span className="text-brand-600">Mart</span>
              </span>
              <span className="text-[10px] text-brand-500 font-extrabold block -mt-1 tracking-widest uppercase font-serif">
                Hand Crafted • 9342044060
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search mobile charm, bracelet, toys, miniature, keychain, watch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-brand-50 border border-brand-200 rounded-full focus:bg-white focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
            />
            <Search className="w-4 h-4 text-brand-400 absolute left-3.5 top-3" />
          </form>

          {/* Nav Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-6 font-extrabold text-xs tracking-wide">
            <Link
              to="/"
              onClick={handleHomeClick}
              className={`transition-colors hover:text-brand-600 ${isActive('/') ? 'text-brand-600 font-black border-b-2 border-brand-600 pb-0.5' : 'text-gray-700'}`}
            >
              HOME
            </Link>
            <Link
              to="/products"
              className={`transition-colors hover:text-brand-600 ${isActive('/products') ? 'text-brand-600 font-black border-b-2 border-brand-600 pb-0.5' : 'text-gray-700'}`}
            >
              CATALOGUE
            </Link>
            <Link
              to="/videos"
              className={`transition-colors hover:text-brand-600 flex items-center gap-1 ${isActive('/videos') ? 'text-brand-600 font-black border-b-2 border-brand-600 pb-0.5' : 'text-gray-700'}`}
            >
              <Film className="w-3.5 h-3.5 text-gold-600" />
              VIDEOS
            </Link>
            <Link
              to="/tracking"
              className={`transition-colors hover:text-brand-600 flex items-center gap-1 ${isActive('/tracking') ? 'text-brand-600 font-black border-b-2 border-brand-600 pb-0.5' : 'text-gray-700'}`}
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
              TRACK ORDER
            </Link>
            <Link
              to="/contact"
              className={`transition-colors hover:text-brand-600 ${isActive('/contact') ? 'text-brand-600 font-black border-b-2 border-brand-600 pb-0.5' : 'text-gray-700'}`}
            >
              CONTACT
            </Link>
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2.5 text-brand-900 hover:text-brand-600 rounded-full hover:bg-brand-100 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce-subtle">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-brand-900 hover:text-brand-600 rounded-lg hover:bg-brand-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden py-2 border-t border-brand-100">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-brand-50 border border-brand-200 rounded-full focus:bg-white focus:border-brand-600 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-brand-400 absolute left-3 top-2.5" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF9] border-b border-brand-200 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={handleHomeClick}
            className="block py-2 text-sm font-extrabold text-brand-900 hover:text-brand-600 border-b border-brand-100"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-extrabold text-brand-900 hover:text-brand-600 border-b border-brand-100"
          >
            Products Catalogue
          </Link>
          <Link
            to="/videos"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-extrabold text-brand-900 hover:text-brand-600 border-b border-brand-100"
          >
            Videos & Reels
          </Link>
          <Link
            to="/tracking"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-extrabold text-brand-900 hover:text-brand-600 border-b border-brand-100"
          >
            Track Order
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-extrabold text-brand-900 hover:text-brand-600"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
};
