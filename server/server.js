import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { createProductRouter } from './routes/productRoutes.js';
import { createDashboardRouter } from './routes/dashboardRoutes.js';
import { createOrderRouter } from './routes/orderRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO with CORS enabled for all client devices
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware (Increased limit to 50mb to support base64 image & video uploads)
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to Centralized MongoDB Database
connectDB();

// API Routes (Passing io instance for real-time emissions)
app.use('/api/products', createProductRouter(io));
app.use('/api/dashboard', createDashboardRouter(io));
app.use('/api/orders', createOrderRouter(io));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    store: 'SS Trendy Mart API',
    timestamp: new Date().toISOString()
  });
});

// Socket.IO Real-Time Connection Event
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Device connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Device disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 SS Trendy Mart Central Backend API running on port ${PORT}`);
  console.log(`📡 Socket.IO Real-Time Sync enabled on http://localhost:${PORT}`);
  console.log(`====================================================`);
});
