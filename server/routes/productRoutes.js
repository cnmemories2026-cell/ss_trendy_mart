import express from 'express';
import { Product } from '../models/Product.js';

export const createProductRouter = (io) => {
  const router = express.Router();

  // GET /api/products - Get all products
  router.get('/', async (req, res) => {
    try {
      let products = [];
      if (Product.db.readyState === 1) {
        products = await Product.find().sort({ createdAt: -1 });
      }
      res.json({ success: true, count: products.length, data: products });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // GET /api/products/:id - Get single product
  router.get('/:id', async (req, res) => {
    try {
      const product = await Product.findOne({ id: req.params.id });
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.json({ success: true, data: product });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // POST /api/products - Create product (Synchronizes to MongoDB & emits Socket.IO event)
  router.post('/', async (req, res) => {
    try {
      const body = req.body;
      const computedStock = body.variants && body.variants.length > 0
        ? body.variants.reduce((sum, v) => sum + Number(v.qty || 0), 0)
        : Number(body.stock || 20);

      const productData = {
        id: body.id || `prod_${Date.now()}`,
        pdfCode: body.pdfCode || `CUSTOM-${Date.now().toString().slice(-4)}`,
        name: body.name,
        category: body.category || 'Miniature',
        price: body.price !== null ? Number(body.price) : null,
        discountPrice: body.discountPrice !== null ? Number(body.discountPrice) : null,
        description: body.description || '',
        image: body.image,
        video: body.video || null,
        instagramVideoUrl: body.instagramVideoUrl || '',
        variants: body.variants || [],
        stock: computedStock,
        soldCount: 0,
        available: computedStock > 0,
        featured: body.featured || false
      };

      let savedProduct = productData;
      if (Product.db.readyState === 1) {
        savedProduct = await Product.create(productData);
      }

      // Real-time synchronization emission
      if (io) {
        io.emit('product:added', savedProduct);
      }

      res.status(201).json({ success: true, data: savedProduct });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  // PUT /api/products/:id - Update product (Synchronizes across all open devices via Socket.IO!)
  router.put('/:id', async (req, res) => {
    try {
      const body = req.body;
      let computedStock = body.stock;
      if (body.variants && body.variants.length > 0) {
        computedStock = body.variants.reduce((sum, v) => sum + Number(v.qty || 0), 0);
      }

      const updatePayload = {
        ...body,
        stock: computedStock !== undefined ? computedStock : body.stock,
        available: (computedStock !== undefined ? computedStock : body.stock) > 0
      };

      let updatedProduct = { id: req.params.id, ...updatePayload };
      if (Product.db.readyState === 1) {
        updatedProduct = await Product.findOneAndUpdate(
          { id: req.params.id },
          updatePayload,
          { new: true, runValidators: true }
        );
      }

      // Real-time synchronization emission (Laptop updates -> Phone receives immediately!)
      if (io) {
        io.emit('product:updated', updatedProduct);
      }

      res.json({ success: true, data: updatedProduct });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  // DELETE /api/products/:id - Delete product
  router.delete('/:id', async (req, res) => {
    try {
      if (Product.db.readyState === 1) {
        await Product.deleteOne({ id: req.params.id });
      }

      // Real-time synchronization emission
      if (io) {
        io.emit('product:deleted', { id: req.params.id });
      }

      res.json({ success: true, message: 'Product deleted', id: req.params.id });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  return router;
};
