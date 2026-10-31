const mongoose = require('mongoose');
const path = require('path');

// Ensure environment variables are loaded
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes('<db_user>') || uri.includes('<db_password>')) {
    console.warn('\n⚠️  MongoDB Notice: MONGO_URI is missing or contains placeholder values (<db_user>/<db_password>) in .env.');
    console.warn('👉 Please open .env and set your MongoDB Atlas connection string.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    console.error('👉 If using MongoDB Atlas:');
    console.error('   1. Check Network Access allows 0.0.0.0/0 (allow from anywhere)');
    console.error('   2. Verify your database username and password in .env');
    return null;
  }
};

module.exports = connectDB;

