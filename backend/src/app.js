import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Parse JSON
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Static uploads
const uploadDir = process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api', routes);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// Error handler
app.use(errorHandler);

export default app;
