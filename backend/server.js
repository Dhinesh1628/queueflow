const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const queueRoutes = require('./routes/queueRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB Database
connectDB();

// 1. Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible API calls and local dev
    crossOriginEmbedderPolicy: false,
  })
);

// 2. Strict Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40, // Stricter limit on auth endpoints to prevent brute-force attacks
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});

app.use('/api', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 3. CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server, Postman)
      if (!origin) return callback(null, true);

      // Allow localhost, vercel.app domains, configured CLIENT_URL, or any Vercel execution
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production' ||
        process.env.VERCEL
      ) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS security policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 4. Input Sanitization against XSS
app.use((req, res, next) => {
  const sanitize = (val) => {
    if (typeof val === 'string') {
      return val.replace(/<[^>]*>?/gm, '').trim();
    }
    if (typeof val === 'object' && val !== null) {
      for (const k of Object.keys(val)) {
        val[k] = sanitize(val[k]);
      }
    }
    return val;
  };
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  next();
});

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// System Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'QueueFlow API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    security: {
      helmet: 'enabled',
      rateLimiting: 'active',
      cors: 'enforced',
    },
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/queues', queueRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/analytics', analyticsRoutes);

// Catch-all for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

let server;
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  server = app.listen(PORT, () => {
    console.log(`[QueueFlow] Server active & listening on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
}

// Graceful process termination
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

module.exports = app;
