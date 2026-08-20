import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CheckCircle2, Clock, ShieldCheck, MessageSquare, Plus, Minus, Video, Instagram, Film, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { getNormalizedColors, getColorStock, getProductTotalStock } from '../utils/stockUtils';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, settings } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const product = products.find(p => p.id === id);
  const normColors = getNormalizedColors(product);
  const hasColorVariants = normColors.length > 0;

  // Requirement 3: Initially when no colour is selected, selectedColor is null
  const [selectedColor, setSelectedColor] = useState(null);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-sm text-gray-500">The product you are looking for does not exist in our catalog.</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-bold rounded-xl text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const totalStock = getProductTotalStock(product);
  const currentVariantStock = hasColorVariants
    ? (selectedColor ? getColorStock(product, selectedColor) : 0)
    : totalStock;

  const handleAddToCart = () => {
    setErrorMessage('');
    if (hasColorVariants && !selectedColor) {
      setErrorMessage('Please select a colour before adding to cart.');
      return;
    }

    const res = addToCart(product, quantity, selectedColor);
    if (res && res.success === false) {
      setErrorMessage(res.message);
      return;
    }

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
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
        
        {/* Left: Image Container */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
              {product.pdfCode}
            </span>
          </div>
        </div>

        {/* Right: Product Meta */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full uppercase tracking-wider">
              {product.category}
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {product.name}
            </h1>

            {/* Price Tag */}
            <div className="pt-2">
              {product.price && product.price > 0 ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-900">₹{product.price}</span>
                  <span className="text-xs text-gray-400">Inclusive of all taxes</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-bold">Price – Contact us</span>
                </div>
              )}
            </div>

            {/* Overall Availability Status */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              {totalStock > 0 ? (
                <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" /> Total Catalog Stock ({totalStock} available)
                </span>
              ) : (
                <span className="text-red-500 bg-red-50 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-b border-gray-100 py-4 text-sm text-gray-600 leading-relaxed">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Product Description</h3>
              <p>{product.description}</p>
            </div>

            {/* REQUIREMENT 1-8: COLOUR-WISE PRODUCT STOCK SELECTOR */}
            {hasColorVariants && (
              <div className="space-y-3 pt-2 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-purple-950 uppercase tracking-wider">
                    Select Colour *
                  </label>
                  {!selectedColor ? (
                    <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md animate-pulse">
                      Please select a colour
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-purple-900">
                      Selected: <strong className="text-brand-700">{selectedColor}</strong> ({currentVariantStock > 0 ? `${currentVariantStock} left` : 'Out of Stock'})
                    </span>
                  )}
                </div>

                {/* Colour Options Buttons */}
                <div className="flex flex-wrap gap-2.5">
                  {normColors.map(col => {
                    const cStock = Number(col.stock) || 0;
                    const isSelected = selectedColor === col.name;
                    const isOutOfStock = cStock <= 0;

                    return (
                      <button
                        key={col.name}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => {
                          setSelectedColor(col.name);
                          setErrorMessage('');
                          setQuantity(1);
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all border flex items-center gap-2 ${
                          isOutOfStock
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60 line-through'
                            : isSelected
                            ? 'bg-brand-600 text-white border-brand-600 shadow-md ring-2 ring-brand-500/40 scale-105'
                            : 'bg-white text-gray-800 border-gray-200 hover:border-brand-400 hover:bg-purple-50'
                        }`}
                      >
                        🎨 {col.name}
                        {isOutOfStock ? (
                          <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-black">Out of Stock</span>
                        ) : (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                            {cStock} left
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {!selectedColor && (
                  <p className="text-[11px] text-amber-800 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Please pick your preferred colour variant to enable Add to Cart.
                  </p>
                )}
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-white rounded-lg text-gray-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-extrabold text-sm text-gray-900">{quantity}</span>
                  <button
                    onClick={() => {
                      if (currentVariantStock > 0 && quantity < currentVariantStock) {
                        setQuantity(quantity + 1);
                      }
                    }}
                    disabled={currentVariantStock > 0 && quantity >= currentVariantStock}
                    className="p-2 hover:bg-white rounded-lg text-gray-700 transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {hasColorVariants && selectedColor && (
                  <span className="text-xs text-gray-500 font-semibold">Max: {currentVariantStock} units</span>
                )}
              </div>

              {/* Requirement 3: Disable Add to Cart if no colour selected */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={(hasColorVariants && !selectedColor) || currentVariantStock <= 0}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 font-extrabold text-base rounded-2xl shadow-lg transition-all ${
                    (hasColorVariants && !selectedColor) || currentVariantStock <= 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25 active:scale-95'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {hasColorVariants && !selectedColor
                    ? 'Add to Cart (Select Colour)'
                    : currentVariantStock <= 0
                    ? 'Out of Stock'
                    : `Add to Cart ${selectedColor ? `(${selectedColor})` : ''}`}
                </button>

                <a
                  href={`https://wa.me/91${settings.ownerPhone}?text=${encodeURIComponent(`Hi SS Trendy Mart, I want to inquire about ${product.name}${selectedColor ? ` (Color: ${selectedColor})` : ''} (${product.pdfCode}).`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-emerald-600/25 transition-all"
                >
                  <MessageSquare className="w-5 h-5" />
                  Inquire on WhatsApp
                </a>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" /> {errorMessage}
                </div>
              )}

              {addedToast && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Added {quantity} x {product.name} {selectedColor ? `[Colour: ${selectedColor}]` : ''} to your cart!
                </div>
              )}
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-4 text-xs text-gray-500">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0" />
              <span>Official PDF Catalog Product</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Manual WhatsApp Confirmation</span>
            </div>
          </div>

        </div>
      </div>

      {/* NEW MEDIA SECTION: Displays Product Video & Instagram Reel if available */}
      {hasMedia && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Film className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-extrabold text-gray-900">Product Video & Media</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Uploaded Video Player */}
            {product.video && (
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-purple-600" /> Product Video Demo
                </h3>
                <div className="rounded-2xl overflow-hidden bg-black border border-gray-200 shadow-md">
                  <video src={product.video} controls className="w-full max-h-80 object-contain" />
                </div>
              </div>
            )}

            {/* Instagram Reel Button */}
            {product.instagramVideoUrl && (
              <div className="p-6 bg-gradient-to-br from-pink-500 to-purple-700 text-white rounded-2xl space-y-4 shadow-md text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Instagram className="w-6 h-6 text-pink-200" />
                  <h3 className="text-lg font-black">Watch on Instagram</h3>
                </div>
                <p className="text-xs text-pink-100 leading-relaxed">
                  View the complete Reel video, customer reviews, and styling ideas directly on Instagram.
                </p>
                <a
                  href={product.instagramVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pink-900 hover:bg-pink-50 font-black text-xs rounded-xl shadow-md transition-all"
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
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
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
