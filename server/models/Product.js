import mongoose from 'mongoose';

const colorVariantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  qty: { type: Number, required: true, default: 0 }
});

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  pdfCode: { type: String, required: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Mobile Charm', 'Bracelet', 'Toys', 'Miniature', 'Keychain', 'Watch'] 
  },
  price: { type: Number, default: null },
  discountPrice: { type: Number, default: null },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  video: { type: String, default: null },
  instagramVideoUrl: { type: String, default: '' },
  variants: [colorVariantSchema],
  stock: { type: Number, default: 20 },
  soldCount: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
