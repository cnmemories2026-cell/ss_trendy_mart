import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Filter, Image, Video, Instagram, ArrowLeft, X, Save, RefreshCw, Layers } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct, resetToDefaultCatalog, isAdminLoggedIn, officialCategories } = useStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    pdfCode: '',
    category: 'Miniature',
    price: '',
    description: '',
    image: '',
    video: null,
    instagramVideoUrl: '',
    variants: [{ color: 'pink', qty: 2 }, { color: 'blue', qty: 2 }]
  });

  const [newColorName, setNewColorName] = useState('');
  const [newColorQty, setNewColorQty] = useState('');

  React.useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  // Image Upload Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Video Upload Handler
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, video: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Color Variant
  const handleAddVariant = () => {
    if (!newColorName.trim() || !newColorQty) return;
    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), { color: newColorName.trim(), qty: Number(newColorQty) }]
    }));
    setNewColorName('');
    setNewColorQty('');
  };

  // Remove Color Variant
  const handleRemoveVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  // Open Modal for Create or Edit
  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        pdfCode: product.pdfCode || '',
        category: product.category || 'Miniature',
        price: product.price !== null ? product.price : '',
        description: product.description || '',
        image: product.image || '',
        video: product.video || null,
        instagramVideoUrl: product.instagramVideoUrl || '',
        variants: product.variants || [{ color: 'pink', qty: 2 }]
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        pdfCode: `PDF-${products.length + 1}`,
        category: officialCategories[0] || 'Miniature',
        price: '25',
        description: '',
        image: '',
        video: null,
        instagramVideoUrl: '',
        variants: [{ color: 'pink', qty: 2 }, { color: 'blue', qty: 2 }]
      });
    }
    setIsModalOpen(true);
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Total stock = sum of color variants
    const computedStock = formData.variants && formData.variants.length > 0
      ? formData.variants.reduce((sum, v) => sum + (v.qty || 0), 0)
      : 20;

    const payload = {
      name: formData.name,
      pdfCode: formData.pdfCode,
      category: formData.category,
      price: formData.price !== '' ? Number(formData.price) : null,
      description: formData.description,
      image: formData.image || 'https://via.placeholder.com/400?text=No+Image',
      video: formData.video,
      instagramVideoUrl: formData.instagramVideoUrl,
      variants: formData.variants,
      stock: computedStock
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    setIsModalOpen(false);
  };

  // Filter Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.pdfCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-brand-200/60 pb-6">
        <div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-black text-brand-900 tracking-tight font-serif">
            Product Catalogue & Color Variant Stock
          </h1>
          <p className="text-xs text-brand-700 mt-1">
            Manage product images, prices, videos, Instagram Reel links, and color variant stock breakdown.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-brand-600/25 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-brand-200/60 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by product name or PDF code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-brand-50 border border-brand-200 rounded-xl focus:bg-white focus:border-brand-600 focus:outline-none"
          />
          <Search className="w-4 h-4 text-brand-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-brand-500 shrink-0" />
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${selectedCategory === 'All' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-800'}`}
          >
            All ({products.length})
          </button>
          {officialCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${selectedCategory === cat ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table with Color Variant Stock Breakdown */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-brand-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-100/60 text-brand-900 font-black uppercase tracking-wider border-b border-brand-200/60">
              <tr>
                <th className="py-4 px-4">Image</th>
                <th className="py-4 px-4">Product Info</th>
                <th className="py-4 px-4">Media</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Color Variant Stock Breakdown</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {filteredProducts.map(product => {
                const totalUnits = product.variants && product.variants.length > 0
                  ? product.variants.reduce((sum, v) => sum + (v.qty || 0), 0)
                  : (product.stock !== undefined ? product.stock : 20);

                return (
                  <tr key={product.id} className="hover:bg-brand-50/50 transition-colors">
                    
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-brand-50 border border-brand-200 p-1 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                      </div>
                    </td>

                    {/* Info */}
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-brand-900 text-sm">{product.name}</div>
                      <div className="text-[10px] text-brand-600 font-bold tracking-wider">{product.pdfCode} • {product.category}</div>
                    </td>

                    {/* Media Indicators */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`p-1.5 rounded-lg ${product.image ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`} title="Image uploaded">
                          <Image className="w-4 h-4" />
                        </span>
                        <span className={`p-1.5 rounded-lg ${product.video ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-400'}`} title="Video uploaded">
                          <Video className="w-4 h-4" />
                        </span>
                        <span className={`p-1.5 rounded-lg ${product.instagramVideoUrl ? 'bg-pink-50 text-pink-600' : 'bg-gray-100 text-gray-400'}`} title="Instagram Reel linked">
                          <Instagram className="w-4 h-4" />
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-black text-brand-900 text-sm">
                      {product.price !== null && product.price > 0 ? (
                        <span>₹{product.price}</span>
                      ) : (
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-bold whitespace-nowrap">Price – Contact us</span>
                      )}
                    </td>

                    {/* COLOR VARIANT STOCK BREAKDOWN (As shown in Screenshot 1) */}
                    <td className="py-3 px-4">
                      <div className="space-y-1.5 max-w-md">
                        <div className="text-xs font-black text-brand-900">
                          Total: <strong className="text-purple-700">{totalUnits} units</strong>
                        </div>
                        
                        {/* Variant Pills */}
                        <div className="flex flex-wrap gap-1.5">
                          {product.variants && product.variants.length > 0 ? (
                            product.variants.map((v, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-800 rounded-lg text-[11px] font-extrabold border border-purple-200"
                              >
                                {v.color}: <strong className="text-purple-900">{v.qty}</strong>
                              </span>
                            ))
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[10px] font-bold">
                              Standard Stock: {totalUnits}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Availability Status */}
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1 ${totalUnits > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        👁 {totalUnits > 0 ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="p-2 text-brand-700 hover:text-brand-900 hover:bg-brand-100 rounded-xl transition-colors"
                          title="Edit Product & Color Variants"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal with Color Variant Management */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-brand-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between border-b border-brand-200 pb-4">
              <h3 className="text-xl font-black text-brand-900 font-serif">
                {editingProduct ? 'Edit Product & Stock Breakdown' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name & PDF Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-brand-200 rounded-xl focus:border-brand-600 focus:outline-none"
                    placeholder="e.g. dolphin"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider mb-1">PDF Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.pdfCode}
                    onChange={(e) => setFormData({ ...formData, pdfCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-brand-200 rounded-xl focus:border-brand-600 focus:outline-none font-bold"
                    placeholder="e.g. PDF-39"
                  />
                </div>
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-brand-200 rounded-xl focus:border-brand-600 focus:outline-none font-bold"
                  >
                    {officialCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 25"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-brand-200 rounded-xl focus:border-brand-600 focus:outline-none font-bold"
                  />
                </div>
              </div>

              {/* COLOR VARIANT STOCK MANAGEMENT (As shown in Screenshot 1) */}
              <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-700" /> Color Variant Stock Breakdown
                  </h4>
                  <span className="text-xs font-black text-purple-800">
                    Total Units: <strong>{formData.variants.reduce((sum, v) => sum + (v.qty || 0), 0)}</strong>
                  </span>
                </div>

                {/* Existing Variants list */}
                <div className="flex flex-wrap gap-2">
                  {formData.variants.map((v, index) => (
                    <div key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-xl border border-purple-300 text-xs font-extrabold text-purple-900 shadow-sm">
                      <span>{v.color}: <strong>{v.qty}</strong></span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="text-red-500 hover:text-red-700 ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Variant */}
                <div className="flex items-center gap-2 pt-2 border-t border-purple-200/60">
                  <input
                    type="text"
                    placeholder="Color Name (e.g. pink, blue)"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-white border border-purple-200 rounded-xl focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Qty (e.g. 4)"
                    value={newColorQty}
                    onChange={(e) => setNewColorQty(e.target.value)}
                    className="w-24 px-3 py-2 text-xs bg-white border border-purple-200 rounded-xl focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs rounded-xl shadow-sm"
                  >
                    Add Color
                  </button>
                </div>
              </div>

              {/* Direct Image Upload */}
              <div>
                <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider mb-1">Direct Device Image Upload *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-brand-100 file:text-brand-800 hover:file:bg-brand-200"
                />
                {formData.image && (
                  <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden bg-brand-50 border border-brand-200 p-1">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              {/* Direct Video Upload */}
              <div>
                <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider mb-1">Direct Device Video Upload (Optional)</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-purple-100 file:text-purple-800 hover:file:bg-purple-200"
                />
              </div>

              {/* Instagram Reel Link */}
              <div>
                <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider mb-1">Instagram Reel Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/reel/..."
                  value={formData.instagramVideoUrl}
                  onChange={(e) => setFormData({ ...formData, instagramVideoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-brand-200 rounded-xl focus:border-brand-600 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-brand-200 rounded-xl focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-600/25 transition-all"
                >
                  <Save className="w-4 h-4" /> Save Product & Stock Breakdown
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
