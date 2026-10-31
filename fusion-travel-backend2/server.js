const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = require('./src/app');
const connectDB = require('./src/config/db');

// Production में JWT_SECRET के बिना server चालू ही नहीं होगा (default secret असुरक्षित है)
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ JWT_SECRET is required in production. Set it in your environment variables.');
    process.exit(1);
  }
  process.env.JWT_SECRET = 'dev_only_jwt_secret_change_me';
  console.warn('⚠️  JWT_SECRET missing: using a development-only secret.');
}

const PORT = process.env.PORT || 5000;

(async () => {
  const conn = await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    console.log(`Admin dashboard: http://localhost:${PORT}/dashboard`);
    if (!conn) console.log('⚠️  MongoDB is not connected. Set MONGO_URI in .env.');
  });
})();
