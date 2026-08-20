import express from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

export const createOrderRouter = (io) => {
  const router = express.Router();

  // GET /api/orders
  router.get('/', async (req, res) => {
    try {
      let orders = [];
      if (Order.db.readyState === 1) {
        orders = await Order.find().sort({ createdAt: -1 });
      }
      res.json({ success: true, count: orders.length, data: orders });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // POST /api/orders - Place Website Order
  router.post('/', async (req, res) => {
    try {
      const body = req.body;
      let newOrder = body;

      if (Order.db.readyState === 1) {
        newOrder = await Order.create(body);

        // Deduct Stock in MongoDB
        if (body.products && Array.isArray(body.products)) {
          for (const item of body.products) {
            const prod = await Product.findOne({ id: item.id });
            if (prod) {
              const currentStock = prod.stock !== undefined ? prod.stock : 20;
              const newStock = Math.max(0, currentStock - item.quantity);
              
              // If color variant selected, deduct variant stock
              if (item.selectedColor && prod.variants && prod.variants.length > 0) {
                prod.variants = prod.variants.map(v => {
                  if (v.color.toLowerCase() === item.selectedColor.toLowerCase()) {
                    return { ...v, qty: Math.max(0, v.qty - item.quantity) };
                  }
                  return v;
                });
              }

              prod.stock = newStock;
              prod.soldCount = (prod.soldCount || 0) + item.quantity;
              prod.available = newStock > 0;
              await prod.save();

              if (io) {
                io.emit('product:updated', prod);
              }
            }
          }
        }
      }

      if (io) {
        io.emit('order:placed', newOrder);
      }

      res.status(201).json({ success: true, data: newOrder });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  return router;
};
