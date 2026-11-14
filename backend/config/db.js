const mongoose = require('mongoose');
const dns = require('dns');

// Only use fallback DNS on local Windows if needed; NEVER on Vercel/Linux serverless
if (process.platform === 'win32' && !process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  } catch (e) {
    console.warn('DNS server override warning:', e.message);
  }
}

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }
  if (!cachedPromise) {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }
    cachedPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: false,
    }).then((conn) => {
      console.log(`[QueueFlow] MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }).catch((err) => {
      cachedPromise = null;
      console.error(`[QueueFlow] Database connection failed: ${err.message}`);
      throw err;
    });
  }
  return cachedPromise;
};

module.exports = connectDB;
