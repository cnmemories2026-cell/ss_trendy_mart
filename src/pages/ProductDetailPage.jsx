import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CheckCircle2, Clock, ShieldCheck, MessageSquare, Plus, Minus, Video, Instagram, Film, Layers } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, settings } = useStore();
  
  const product = products.find(p => p.id === id);

  const [selectedColor, setSelectedColor] = useState(
    product && product.variants && product.variants.length > 0 ? product.variants[0].color : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-brand-900">Product Not Found</h2>
        <p className="text-xs text-gray-500">The product you are looking for does not exist in our PDF catalog.</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-bold rounded-xl text-xs">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const totalUnits = product.variants && product.variants.length > 0
    ? product.variants.reduce((sum, v) => sum + (v.qty || 0), 0)
    : (product.stock !== undefined ? product.stock : 20);

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      selectedColor: selectedColor || (product.variants && product.variants.length > 0 ? product.variants[0].color : '')
    };
    addToCart(itemToAdd, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const hasMedia = product.video || product.instagramVideoUrl;

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-extrabold text-brand-700 hover:text-brand-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 border border-brand-200/60 shadow-sm">
        
        {/* Left: Image Container with Object-Contain (No Cropping!) */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-brand-50 p-6 border border-brand-200 relative group flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-4 left-4 bg-brand-900/80 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full">
              {product.pdfCode}
            </span>
          </div>
        </div>

        {/* Right: Product Meta */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-brand-100 text-brand-800 text-xs font-black rounded-full uppercase tracking-wider">
              {product.category}
            </div>

            <h1 className="text-3xl font-black text-brand-900 tracking-tight font-serif capitalize">
              {product.name}
            </h1>

            {/* Price Tag */}
            <div className="pt-2">
              {product.price && product.price > 0 ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-brand-900">₹{product.price}</span>
                  <span className="text-xs text-gray-400">Inclusive of all taxes</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-900 rounded-2xl border border-amber-200">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-black">Price – Contact us</span>
                </div>
              )}
            </div>

            {/* Availability Status */}
            <div className="flex items-center gap-2 text-xs font-black">
              {totalUnits > 0 ? (
                <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> In Stock ({totalUnits} available)
                </span>
              ) : (
                <span className="text-red-500 bg-red-50 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* COLOR VARIANT SELECTOR */}
            {product.variants && product.variants.length > 0 && (
              <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-2">
                <label className="block text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-700" /> Choose Available Color Variant:
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(v.color)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${selectedColor === v.color ? 'bg-purple-700 text-white border-purple-700 shadow-md' : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-100'}`}
                    >
                      {v.color} ({v.qty} in stock)
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="border-t border-b border-brand-200/60 py-4 text-xs text-brand-800/80 leading-relaxed">
              <h3 className="text-xs font-bold text-brand-900 uppercase tracking-wider mb-2">Product Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Quantity Selector & Add to Cart */}
            {totalUnits > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-brand-900 uppercase tracking-wider">Quantity:</span>
                  <div className="flex items-center bg-brand-100/60 rounded-xl p-1 border border-brand-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-white rounded-lg text-brand-900 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-extrabold text-xs text-brand-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-white rounded-lg text-brand-900 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-600/25 active:scale-95 transition-all"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart {selectedColor && `(${selectedColor})`}
                  </button>

                  <a
                    href={`https://wa.me/91${settings.ownerPhone}?text=${encodeURIComponent(`Hi SS Trendy Mart, I want to inquire about ${product.name} (${product.pdfCode})${selectedColor ? ` Color: ${selectedColor}` : ''}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-700/25 transition-all"
                  >
                    <MessageSquare className="w-5 h-5" />
                    WhatsApp Inquiry
                  </a>
                </div>

                {addedToast && (
                  <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Added {quantity} x {product.name} {selectedColor && `(${selectedColor})`} to your cart!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-4 text-xs text-brand-800/70">
            <div className="flex items-center gap-2 p-3 bg-brand-50 rounded-xl border border-brand-200/60">
              <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0" />
              <span>Official PDF Catalog Product</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-brand-50 rounded-xl border border-brand-200/60">
              <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Manual WhatsApp Order Confirmation</span>
            </div>
          </div>

        </div>
      </div>

      {/* MEDIA SECTION */}
      {hasMedia && (
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 border border-brand-200/60 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-brand-200/60 pb-4">
            <Film className="w-6 h-6 text-brand-600" />
            <h2 className="text-xl font-black text-brand-900 font-serif">Product Video & Media</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {product.video && (
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-brand-600" /> Product Video Demo
                </h3>
                <div className="rounded-2xl overflow-hidden bg-black border border-brand-200 shadow-md">
                  <video src={product.video} controls className="w-full max-h-80 object-contain" />
                </div>
              </div>
            )}

            {product.instagramVideoUrl && (
              <div className="p-6 bg-gradient-to-br from-pink-600 to-purple-800 text-white rounded-2xl space-y-4 shadow-md text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Instagram className="w-6 h-6 text-pink-200" />
                  <h3 className="text-lg font-black">Watch on Instagram</h3>
                </div>
                <p className="text-xs text-pink-100 leading-relaxed">
                  View the complete Reel video directly on Instagram.
                </p>
                <a
                  href={product.instagramVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pink-900 font-black text-xs rounded-xl shadow-md transition-all"
                >
                  <Instagram className="w-4 h-4 text-pink-600" /> Open Instagram Reel
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-brand-900 tracking-tight font-serif">
            Similar Catalog Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
