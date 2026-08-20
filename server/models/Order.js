import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerWhatsApp: { type: String },
  deliveryAddress: { type: String },
  notes: { type: String, default: '' },
  products: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
      selectedColor: String,
      image: String
    }
  ],
  subtotal: { type: Number, required: true },
  couponCode: { type: String, default: null },
  discountAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, default: 'New Order' },
  type: { type: String, default: 'Website Order' } // 'Website Order' or 'POS Sale'
}, {
  timestamps: true
});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
