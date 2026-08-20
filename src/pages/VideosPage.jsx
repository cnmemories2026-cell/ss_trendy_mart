import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Instagram, Eye, Play, ArrowRight, Sparkles, Film } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const VideosPage = () => {
  const { products } = useStore();

  // Filter products that have uploaded videos or Instagram links
  const videoProducts = products.filter(p => p.video || p.instagramVideoUrl);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-brand-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-purple-200">
          <Film className="w-3.5 h-3.5 text-amber-300" /> Video Catalog & Reels
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Product Video Gallery
        </h1>
        <p className="text-sm text-purple-200 max-w-xl">
          Watch live video demonstrations, unboxing clips, and Instagram Reels of our trendy miniature products catalog.
        </p>
      </div>

      {/* Video Products Grid */}
      {videoProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videoProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Media Section */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                {product.video ? (
                  <video
                    src={product.video}
                    controls
                    className="w-full h-full object-cover"
                    poster={product.image}
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-lg animate-pulse">
                        <Instagram className="w-7 h-7" />
                      </div>
                    </div>
                  </div>
                )}

                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {product.pdfCode}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-brand-600 uppercase tracking-widest">
                    {product.category}
                  </span>
                  <h3 className="text-base font-extrabold text-gray-900 line-clamp-1">{product.name}</h3>
                  <div className="pt-1">
                    {product.price && product.price > 0 ? (
                      <span className="text-sm font-extrabold text-gray-900">₹{product.price}</span>
                    ) : (
                      <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-semibold border border-amber-200">
                        Price – Contact us
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
                  >
                    <Eye className="w-4 h-4" /> View Product
                  </Link>

                  {product.instagramVideoUrl && (
                    <a
                      href={product.instagramVideoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
                    >
                      <Instagram className="w-4 h-4" /> View on Instagram
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-gray-900">No Product Videos Available Yet</h3>
          <p className="text-xs text-gray-500">
            Check back soon! Product videos uploaded from device or Instagram Reels will appear here automatically.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-extrabold text-xs rounded-xl"
          >
            Explore Catalog Products
          </Link>
        </div>
      )}

    </div>
  );
};
