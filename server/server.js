import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './src/config/db.js';
import apiRoutes from './src/routes/api.routes.js';
import { notFound, errorHandler } from './src/middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Initialize Express application
const app = express();

// Middleware: Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware: CORS configured to allow client and admin origins with credentials
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://gift-shop-webapp-rho.vercel.app',
  'https://gift-shop-webapp-qw5r.vercel.app',
]
  .filter(Boolean)
  .flatMap((u) => u.split(',').map((item) => item.trim().replace(/\/$/, '')));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, server-to-server, Postman)
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);

// Middleware: Body parsing & cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static file serving for uploads fallback
app.use('/uploads', express.static('public/uploads'));

// Connect to Database (gracefully continues if DB is unavailable)
connectDB();

// API Routes (supports both /api prefix and root paths like /auth/login)
app.use('/api', apiRoutes);
app.use(apiRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);

  // Prevent Render free-tier idle shutdown by self-pinging every 10 minutes
  const externalUrl = process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL;
  if (externalUrl) {
    const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes
    setInterval(async () => {
      try {
        const pingUrl = `${externalUrl.replace(/\/$/, '')}/api/health`;
        await fetch(pingUrl);
        console.log(`[Keep-Alive] Pinged ${pingUrl} to prevent inactivity shutdown`);
      } catch (err) {
        console.warn('[Keep-Alive] Self-ping failed:', err.message);
      }
    }, PING_INTERVAL);
  }
});

export default app;
