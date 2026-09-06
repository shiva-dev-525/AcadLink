const mongoose = require('mongoose');

let isConnected = false;

/**
 * Connect to MongoDB with graceful error handling.
 * If MongoDB is offline, the backend continues to run in degraded mode
 * so health-check and initial endpoints remain testable.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/academia_portal';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000 // Short timeout to prevent blocking startup
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] Notice: MongoDB is currently unreachable at ${mongoUri}`);
    console.warn(`[Database] Details: ${error.message}`);
    console.warn(`[Database] The server will continue running. Health check remains operational.`);
  }

  // Handle runtime connection loss
  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[Database] Lost connection to MongoDB.');
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    console.log('[Database] Reconnected to MongoDB.');
  });
};

const getDbStatus = () => {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
};

module.exports = { connectDB, getDbStatus };
