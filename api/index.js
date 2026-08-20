import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../server/config/db.js';
import { createProductRouter } from '../server/routes/productRoutes.js';
import { createDashboardRouter } from '../server/routes/dashboardRoutes.js';
import { createOrderRouter } from '../server/routes/orderRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/products', createProductRouter(null));
app.use('/api/dashboard', createDashboardRouter(null));
app.use('/api/orders', createOrderRouter(null));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    store: 'SS Trendy Mart Vercel API',
    timestamp: new Date().toISOString()
  });
});

export default app;
