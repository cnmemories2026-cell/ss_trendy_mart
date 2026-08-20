import express from 'express';
import { Dashboard } from '../models/Dashboard.js';

export const createDashboardRouter = (io) => {
  const router = express.Router();

  // GET /api/dashboard
  router.get('/', async (req, res) => {
    try {
      let data = {
        storeName: 'SS Trendy Mart',
        ownerPhone: '9342044060',
        tagline: 'Hand Crafted • Trendy Products. Easy Shopping.',
        adminPassword: 'ChaNish@1724',
        instagramProfileUrl: 'https://instagram.com/ss_trendy_mart'
      };

      if (Dashboard.db.readyState === 1) {
        const found = await Dashboard.findOne();
        if (found) data = found;
      }

      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // PUT /api/dashboard - Update dashboard & store settings
  router.put('/', async (req, res) => {
    try {
      const updateData = req.body;
      let updated = updateData;

      if (Dashboard.db.readyState === 1) {
        let doc = await Dashboard.findOne();
        if (doc) {
          Object.assign(doc, updateData);
          updated = await doc.save();
        } else {
          updated = await Dashboard.create(updateData);
        }
      }

      // Real-time synchronization emission (Phone updates -> Laptop receives immediately!)
      if (io) {
        io.emit('dashboard:updated', updated);
      }

      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  return router;
};
