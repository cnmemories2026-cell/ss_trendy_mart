import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { PackageX, Sparkles } from 'lucide-react';

export const ProductsPage = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.pdfCode && product.pdfCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'name_asc') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'price_low') {
          return (a.price || 0) - (b.price || 0);
        } else if (sortBy === 'price_high') {
          return (b.price || 0) - (a.price || 0);
        }
        return 0; // Default PDF order
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-purple-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-purple-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Owner PDF Product Catalog
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Product Catalog
        </h1>
        <p className="text-sm text-purple-200 max-w-xl">
          Showing all products imported directly from the official SS Trendy Mart PDF catalog. Select your items and add them to cart!
        </p>
      </div>

      {/* Category & Search Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Product Count Header */}
      <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
        <span>Showing {filteredProducts.length} Products</span>
        {selectedCategory !== 'All' && <span>Category: {selectedCategory}</span>}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-warm-100 text-brand-600 flex items-center justify-center mx-auto">
            <PackageX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Products Available</h3>
          <p className="text-xs text-gray-500">
            {products.length === 0
              ? "All products have been cleared. Upload new products from the Admin Panel!"
              : `No products match your search query "${searchQuery}". Try another search term.`}
          </p>
          {products.length > 0 && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
