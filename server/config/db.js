const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Reusable MongoDB Connection Utility with Serverless Caching
 * Connects to MongoDB using process.env.MONGO_URI.
 * Caches connection across serverless function invocations on Vercel.
 */
const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI || mongoURI.trim() === '') {
    console.warn('\n⚠️  [MongoDB Warning]: MONGO_URI environment variable is not defined.');
    console.warn('👉 To connect a database, set MONGO_URI in your Vercel Environment Variables or .env file.\n');
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(mongoURI, opts).then((mongooseInstance) => {
      console.log(`✅ [MongoDB Connected]: Host -> ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      console.error('\n❌ [MongoDB Connection Error]: Failed to establish connection to database.');
      console.error(`Details: ${err.message}`);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    return null;
  }
};

module.exports = connectDB;
