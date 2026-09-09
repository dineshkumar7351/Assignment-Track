const mongoose = require('mongoose');

/**
 * Reusable MongoDB Connection Utility
 * Connects to MongoDB using process.env.MONGO_URI.
 * Displays clear, descriptive server-side messages if unavailable or on error.
 */
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return true;
  }

  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI || mongoURI.trim() === '') {
    console.warn('\n⚠️  [MongoDB Warning]: MONGO_URI environment variable is not defined.');
    console.warn('👉 To connect a database, set MONGO_URI in your server/.env file (e.g., mongodb://localhost:27017/smart-assignment-tracker or MongoDB Atlas URI).\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ [MongoDB Connected]: Host -> ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('\n❌ [MongoDB Connection Error]: Failed to establish connection to database.');
    console.error(`Details: ${error.message}`);
    console.error('👉 Troubleshooting: Check that your MongoDB service is active and the connection string is valid.\n');
    return false;
  }
};

module.exports = connectDB;
