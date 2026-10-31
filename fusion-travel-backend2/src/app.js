const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Render/Vercel जैसे proxy के पीछे असली IP पढ़ने के लिए
app.set('trust proxy', 1);

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:3000,https://fusion-travel-agancy.vercel.app')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean);

// FIX: production में सिर्फ CLIENT_URL वाले origins allowed हैं।
// FIX 2: Browser same-origin POST/PUT/PATCH पर भी "Origin" header भेजता है। पहले इसी वजह से
// production में /dashboard का login और save बटन "CORS blocked" देते थे। अब अपने ही host को allow किया है।
app.use(cors((req, callback) => {
  const origin = req.header('Origin');
  const host = req.header('X-Forwarded-Host') || req.header('Host');
  let allow = false;
  if (!origin || !isProd) allow = true; // Postman / curl / development
  else if (allowedOrigins.includes(origin.replace(/\/$/, ''))) allow = true;
  else {
    try { allow = new URL(origin).host === host; } catch { allow = false; } // same-origin dashboard
  }
  if (!allow) return callback(new Error(`CORS blocked for origin: ${origin}`));
  return callback(null, { origin: true, credentials: true });
}));

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({ limit: '1mb' }));
if (!isProd) app.use(morgan('dev'));

// ---------- Admin Dashboard (same server से serve होता है: http://localhost:5000/dashboard) ----------
app.use('/dashboard', express.static(path.join(__dirname, '..', 'dashboard'), { index: 'index.html' }));

// सब API पर: 15 मिनट में अधिकतम 300 requests
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get('/', (req, res) => res.json({ success: true, message: 'Fusion Travel API is running', dashboard: '/dashboard' }));
app.get('/api/health', (req, res) => {
  res.json({ success: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// DB जुड़ा नहीं है तो 10 सेकंड हैंग होने की जगह तुरंत साफ़ error दो
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Database is not connected. Check MONGO_URI in .env and restart the server.' });
  }
  next();
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
