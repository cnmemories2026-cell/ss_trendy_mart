import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, RefreshCw, X, Image as ImageIcon, Video, Instagram, Box, Upload, Sparkles, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getNormalizedColors, getProductTotalStock } from '../../utils/stockUtils';

export const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct, clearAllProducts, categories: storeCategories, addCategory, deleteCategory, isAdminLoggedIn } = useStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Category management modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatInput, setNewCatInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    pdfCode: '',
    category: storeCategories[0] || 'Mobile Charm',
    price: '',
    colorsList: [],
    stock: 20,
    image: '',
    video: null,
    instagramVideoUrl: '',
    description: '',
    available: true
  });

  React.useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  const categoryFilterList = ['All', ...storeCategories];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.pdfCode && p.pdfCode.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Handle direct device Image Upload (JPG, JPEG, PNG, WEBP)
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle direct device Video Upload (MP4, WEBM, MOV)
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, video: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Color Variant Row Handlers
  const handleAddColorRow = () => {
    setFormData(prev => ({
      ...prev,
      colorsList: [...prev.colorsList, { name: '', stock: 5 }]
    }));
  };

  const handleColorChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.colorsList];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, colorsList: updated };
    });
  };

  const handleRemoveColorRow = (index) => {
    setFormData(prev => ({
      ...prev,
      colorsList: prev.colorsList.filter((_, idx) => idx !== index)
    }));
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: `Product ${String(products.length + 1).padStart(2, '0')}`,
      pdfCode: `PDF-${String(products.length + 1).padStart(2, '0')}`,
      category: storeCategories[0] || 'Mobile Charm',
      price: '',
      colorsList: [
        { name: 'Pink', stock: 5 },
        { name: 'Blue', stock: 3 }
      ],
      stock: 8,
      image: '',
      video: null,
      instagramVideoUrl: '',
      description: 'Original catalog product from SS Trendy Mart.',
      available: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    const existingNormColors = getNormalizedColors(product);

    setFormData({
      name: product.name,
      pdfCode: product.pdfCode || '',
      category: product.category || storeCategories[0] || 'Mobile Charm',
      price: product.price || '',
      colorsList: existingNormColors.length > 0 ? existingNormColors : [],
      stock: getProductTotalStock(product),
      image: product.image || '',
      video: product.video || null,
      instagramVideoUrl: product.instagramVideoUrl || '',
      description: product.description || '',
      available: product.available !== false
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Product name is required');
      return;
    }

    // Validation 1: Color cannot be empty
    if (formData.colorsList.some(c => !c.name.trim())) {
      alert('Colour names cannot be empty.');
      return;
    }

    // Validation 2: Stock cannot be negative
    if (formData.colorsList.some(c => Number(c.stock) < 0)) {
      alert('Colour stock cannot be negative.');
      return;
    }

    // Validation 3: Duplicate colour entries not allowed
    const colorNamesClean = formData.colorsList.map(c => c.name.trim().toLowerCase());
    if (new Set(colorNamesClean).size !== colorNamesClean.length) {
      alert('Duplicate colour entries are not allowed for the same product.');
      return;
    }

    const cleanColorsList = formData.colorsList.map(c => ({
      name: c.name.trim(),
      stock: Number(c.stock) || 0
    }));

    // Requirement 9: Do NOT maintain one common stock number when colour variants are enabled
    const computedTotalStock = cleanColorsList.length > 0
      ? cleanColorsList.reduce((sum, c) => sum + c.stock, 0)
      : (Number(formData.stock) || 0);

    const productPayload = {
      name: formData.name.trim(),
      pdfCode: formData.pdfCode.trim(),
      category: formData.category,
      price: formData.price !== '' ? Number(formData.price) : null,
      colors: cleanColorsList,
      stock: computedTotalStock,
      image: formData.image || (editingProduct ? editingProduct.image : '/products/page_1.jpg'),
      video: formData.video,
      instagramVideoUrl: formData.instagramVideoUrl,
      description: formData.description,
      available: formData.available && computedTotalStock > 0
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Product Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            Upload product images & videos directly from your device, attach Instagram Reel links, and manage stock levels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs rounded-xl transition-colors border border-purple-200"
            title="Add or edit store categories"
          >
            🎨 Manage Categories ({storeCategories.length})
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to remove ALL products from the store?')) {
                clearAllProducts();
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition-colors border border-red-200"
            title="Wipe all products"
          >
            <Trash2 className="w-4 h-4" /> Remove All Products
          </button>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by name or PDF code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 custom-scrollbar">
          {categoryFilterList.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-extrabold tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">Image</th>
                <th className="py-3.5 px-4">Product Name & PDF Code</th>
                <th className="py-3.5 px-4">Media Indicators</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                  
                  {/* Image */}
                  <td className="py-3 px-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover bg-gray-50 border"
                    />
                  </td>

                  {/* Name & Code */}
                  <td className="py-3 px-4">
                    <div className="font-extrabold text-gray-900 text-sm">{product.name}</div>
                    <span className="text-[10px] text-gray-400 font-semibold">{product.pdfCode}</span>
                  </td>

                  {/* Media Indicators */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {/* Image Indicator */}
                      <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg" title="Product Image Available">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </span>

                      {/* Video Indicator */}
                      {product.video ? (
                        <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg" title="Uploaded Video Available">
                          <Video className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="p-1.5 bg-gray-100 text-gray-300 rounded-lg" title="No Uploaded Video">
                          <Video className="w-3.5 h-3.5" />
                        </span>
                      )}

                      {/* Instagram Indicator */}
                      {product.instagramVideoUrl ? (
                        <span className="p-1.5 bg-pink-50 text-pink-600 rounded-lg" title="Instagram Link Attached">
                          <Instagram className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="p-1.5 bg-gray-100 text-gray-300 rounded-lg" title="No Instagram Link">
                          <Instagram className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4">
                    {product.price && product.price > 0 ? (
                      <span className="font-extrabold text-gray-900 text-sm">₹{product.price}</span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold text-[11px] border border-amber-200">
                        Price – Contact us
                      </span>
                    )}
                  </td>

                  {/* Stock Level (Requirement 10: Admin inventory clearly shows colour-wise stock) */}
                  <td className="py-3 px-4">
                    {getNormalizedColors(product).length > 0 ? (
                      <div className="space-y-1">
                        <div className="font-black text-xs text-purple-950">
                          Total: {getProductTotalStock(product)} units
                        </div>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {getNormalizedColors(product).map(col => (
                            <span
                              key={col.name}
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                Number(col.stock) > 0
                                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                                  : 'bg-red-50 text-red-600 border-red-200 line-through'
                              }`}
                            >
                              {col.name}: {col.stock}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5 text-gray-400" />
                        <span className={`font-extrabold text-xs ${product.stock > 5 ? 'text-gray-900' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                          {product.stock !== undefined ? product.stock : 20} in stock
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Availability Toggle */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => updateProduct(product.id, { available: !product.available })}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        product.available !== false && (product.stock === undefined || product.stock > 0)
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {product.available !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {product.available !== false ? 'Available' : 'Hidden / Out of Stock'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="p-2 text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${product.name}?`)) {
                          deleteProduct(product.id);
                        }
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-fade-in">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-black text-gray-900">
                {editingProduct ? `Edit ${editingProduct.name}` : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Product 01 or Miniature Bunny Set"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              {/* Price, Stock & SKU */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 150 (or blank)"
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Stock Qty *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">PDF Code</label>
                  <input
                    type="text"
                    value={formData.pdfCode}
                    onChange={(e) => setFormData({ ...formData, pdfCode: e.target.value })}
                    placeholder="e.g. PDF-01"
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Category</label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="text-[11px] font-bold text-purple-700 hover:underline"
                  >
                    + Add New Category
                  </button>
                </div>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none font-semibold text-gray-800"
                >
                  {storeCategories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* REQUIREMENT 7 & 8: COLOUR & STOCK SECTION */}
              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-purple-950 uppercase tracking-wider">
                    🎨 Colour & Stock Management
                  </label>
                  <button
                    type="button"
                    onClick={handleAddColorRow}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Colour Variant
                  </button>
                </div>
                <p className="text-[11px] text-purple-800">
                  Set independent stock quantity for each colour option. The system will track stock per colour variant separately.
                </p>

                {formData.colorsList && formData.colorsList.length > 0 ? (
                  <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pt-1">
                    {formData.colorsList.map((col, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-purple-100 shadow-sm">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Colour Name (e.g. Green)"
                            value={col.name}
                            onChange={(e) => handleColorChange(idx, 'name', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg font-bold focus:bg-white focus:border-brand-500 focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-1 w-32">
                          <span className="text-[10px] font-bold text-gray-500">Stock:</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={col.stock}
                            onChange={(e) => handleColorChange(idx, 'stock', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg font-black text-center focus:bg-white focus:border-brand-500 focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveColorRow(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove Colour"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="text-[11px] font-bold text-purple-900 pt-1 text-right">
                      Total Variant Stock: {formData.colorsList.reduce((sum, c) => sum + (Number(c.stock) || 0), 0)} units
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-xl border border-dashed border-purple-200 text-center text-xs text-gray-400">
                    No colour variants added. Single general product stock will apply.
                  </div>
                )}
              </div>

              {/* 1. DIRECT PRODUCT IMAGE UPLOAD FROM DEVICE */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <label className="block text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-brand-600" /> Upload Product Image (Direct Device File)
                </label>
                <p className="text-[11px] text-gray-500">Supports JPG, JPEG, PNG, WEBP format.</p>

                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-sm transition-all">
                    <Upload className="w-4 h-4" /> Select Image File
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Delete Image
                    </button>
                  )}
                </div>

                {/* Preview Thumbnail */}
                {formData.image && (
                  <div className="flex items-center gap-3 pt-2">
                    <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-xl object-cover border" />
                    <span className="text-xs text-emerald-600 font-bold">Image Loaded & Ready!</span>
                  </div>
                )}
              </div>

              {/* 2. DIRECT PRODUCT VIDEO UPLOAD FROM DEVICE (OPTIONAL) */}
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-3">
                <label className="block text-xs font-extrabold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-purple-600" /> Product Video (Optional Direct Device Upload)
                </label>
                <p className="text-[11px] text-purple-700">Supports MP4, WEBM, MOV format.</p>

                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-sm transition-all">
                    <Upload className="w-4 h-4" /> Select Video File
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      onChange={handleVideoFileChange}
                      className="hidden"
                    />
                  </label>
                  {formData.video && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, video: null })}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Delete Video
                    </button>
                  )}
                </div>

                {/* Preview Video */}
                {formData.video && (
                  <div className="pt-2 space-y-1">
                    <span className="text-xs text-purple-800 font-bold block">Video Preview:</span>
                    <video src={formData.video} controls className="w-full max-h-40 rounded-xl border bg-black" />
                  </div>
                )}
              </div>

              {/* 3. OPTIONAL INSTAGRAM REEL / VIDEO LINK */}
              <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-100 space-y-2">
                <label className="block text-xs font-extrabold text-pink-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Instagram className="w-4 h-4 text-pink-600" /> Instagram Reel / Video Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.instagramVideoUrl}
                  onChange={(e) => setFormData({ ...formData, instagramVideoUrl: e.target.value })}
                  placeholder="e.g. https://www.instagram.com/reel/C3xyz..."
                  className="w-full px-4 py-2.5 text-xs bg-white border border-pink-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description..."
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="availCheck"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
                />
                <label htmlFor="availCheck" className="text-xs font-bold text-gray-700 cursor-pointer">
                  Product is Available & Visible on Website
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold shadow-md"
                >
                  {editingProduct ? 'Save Product Changes' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                🎨 Category Options Management
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add New Category Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newCatInput.trim()) {
                  addCategory(newCatInput);
                  setNewCatInput('');
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Enter new category name..."
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
              >
                + Add
              </button>
            </form>

            {/* Category Items List */}
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pt-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Current Categories ({storeCategories.length}):</span>
              {storeCategories.map(cat => (
                <div key={cat} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                  <span className="font-extrabold text-gray-800">{cat}</span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete category "${cat}"?`)) {
                        deleteCategory(cat);
                      }
                    }}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    title="Remove Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
