const mongoose = require('mongoose');
const dns = require('dns');

// Configure fallback public DNS servers for Windows SRV record resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  console.warn('DNS server override warning:', e.message);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: true,
    });
    console.log(`[QueueFlow] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[QueueFlow] Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
