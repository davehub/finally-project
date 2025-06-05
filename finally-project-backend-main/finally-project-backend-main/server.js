import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Routes
import authRoutes from './routes/auth.js';
import equipmentRoutes from './routes/equipment.js';
import userRoutes from './routes/users.js';
import maintenanceRoutes from './routes/maintenance.js';
import notificationRoutes from './routes/notifications.js';

// Middleware
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/it-asset-management')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/equipment', authMiddleware, equipmentRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/maintenance', authMiddleware, maintenanceRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);

// Base route
app.get('/api', (req, res) => {
  res.json({ message: 'IT Asset Management API' });
});

// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;