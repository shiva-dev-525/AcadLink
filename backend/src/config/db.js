const mongoose = require('mongoose');

let isConnected = false;
let retryTimer = null;
let connectionPromise = null;

/**
 * Connect to MongoDB with connection reuse for serverless environments.
 * If already connected or connecting, reuses existing connection.
 */
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2 && connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/academia_portal';

  try {
    connectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });

    const conn = await connectionPromise;
    isConnected = true;
    if (retryTimer) {
      clearInterval(retryTimer);
      retryTimer = null;
    }
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    connectionPromise = null;
    isConnected = false;
    console.warn(`[Database] Notice: MongoDB is currently unreachable at ${mongoUri.replace(/:[^:]*@/, ':****@')}`);
    console.warn(`[Database] Details: ${error.message}`);

    if (error.message.includes('whitelisted') || error.message.includes('ReplicaSetNoPrimary') || error.message.includes('SSL')) {
      console.warn(`[Database] 💡 Quick Fix: Add your current public IP to MongoDB Atlas Network Access.`);
    }

    // Schedule background auto-retry in local environments only (not serverless)
    if (!process.env.VERCEL && !retryTimer) {
      retryTimer = setInterval(async () => {
        if (mongoose.connection.readyState !== 1) {
          try {
            console.log('[Database] Retrying MongoDB Atlas connection...');
            const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
            isConnected = true;
            clearInterval(retryTimer);
            retryTimer = null;
            console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
          } catch (retryErr) {
            // Keep waiting
          }
        } else {
          isConnected = true;
          clearInterval(retryTimer);
          retryTimer = null;
        }
      }, 15000);

      if (retryTimer.unref) {
        retryTimer.unref();
      }
    }
  }

  // Handle runtime connection loss
  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    connectionPromise = null;
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
