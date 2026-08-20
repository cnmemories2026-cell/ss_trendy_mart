import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, Clock, CheckCircle2, Box } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getNormalizedColors, getProductTotalStock } from '../utils/stockUtils';

export const ProductCard = ({ product }) => {
  const { addToCart } = useStore();
  const navigate = useNavigate();
  const [addedToast, setAddedToast] = useState(false);

  const normColors = getNormalizedColors(product);
  const hasColorVariants = normColors.length > 0;
  const currentStock = getProductTotalStock(product);
  const isAvailable = product.available !== false && currentStock > 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) return;

    // Requirement 9: If product has colour variants, navigate to detail page so customer MUST select a colour
    if (hasColorVariants) {
      navigate(`/product/${product.id}`);
      return;
    }

    const res = addToCart(product, 1);
    if (res && res.success !== false) {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2000);
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between card-3d">
      
      {/* Product Image Container with OBJECT-CONTAIN (No Cropping!) */}
      <div className="relative aspect-square w-full bg-peach-50/50 p-4 flex items-center justify-center overflow-hidden border-b border-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Availability Badge */}
        {!isAvailable && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
            Out of Stock
          </div>
        )}

        {/* PDF Code Badge */}
        <div className="absolute top-3 right-3 bg-gray-900/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
          {product.pdfCode || 'PDF'}
        </div>

        {/* Quick Actions Hover Overlay */}
        <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/product/${product.id}`}
            className="p-3 bg-white text-gray-900 rounded-full shadow-lg hover:bg-brand-600 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </Link>
          {isAvailable && (
            <button
              onClick={handleAdd}
              className="p-3 bg-brand-600 text-white rounded-full shadow-lg hover:bg-brand-700 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
              title="Add to Cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-extrabold text-brand-600 uppercase tracking-widest block">
              {product.category || 'General'}
            </span>
            {product.colors && product.colors.length > 0 && (
              <span className="text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded-md">
                🎨 {product.colors.length} Colors
              </span>
            )}
          </div>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm sm:text-base font-extrabold text-gray-900 hover:text-brand-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Stock & Add Button */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <div>
            {product.price && product.price > 0 ? (
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-gray-900">₹{product.price}</span>
              </div>
            ) : (
              <span className="inline-flex items-center text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Clock className="w-3 h-3 mr-1 text-amber-600" /> Price – Contact us
              </span>
            )}
            <div className="text-[10px] text-gray-400 font-semibold mt-0.5">
              Stock: {currentStock}
            </div>
          </div>

          {isAvailable ? (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 text-xs font-black text-white bg-brand-600 hover:bg-brand-700 px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {hasColorVariants ? 'Select Colour' : 'Add'}
            </button>
          ) : (
            <span className="text-[11px] text-gray-400 font-bold">Unavailable</span>
          )}
        </div>

        {/* Added to Cart Feedback Toast */}
        {addedToast && (
          <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] font-bold border border-emerald-200 flex items-center justify-center gap-1 animate-bounce-subtle">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ✨ Added to Cart!
          </div>
        )}
      </div>

    </div>
  );
};
