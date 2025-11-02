const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const projectRoutes = require('./routes/project');

// Load environment variables from backend/.env file
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '500kb' }));

// MongoDB connection with validation and better error handling
// Supports both local MongoDB and MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/adaptive-generator';
const isAtlas = MONGO_URI.includes('mongodb+srv://') || MONGO_URI.includes('mongodb.net');

if (!process.env.MONGO_URI) {
  console.warn('⚠️  WARNING: MONGO_URI not found in .env file, using default local connection');
  console.warn('   For MongoDB Atlas, set MONGO_URI in backend/.env with your Atlas connection string');
}

console.log('Attempting to connect to MongoDB...');
if (isAtlas) {
  console.log('📍 Connection type: MongoDB Atlas (Cloud)');
} else {
  console.log('📍 Connection type: Local MongoDB');
}

// Connection options optimized for both local and Atlas
const connectionOptions = {
  // These are defaults in Mongoose 7.0+, but explicit for clarity
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

// Add Atlas-specific options if using Atlas
if (isAtlas) {
  connectionOptions.retryWrites = true;
  connectionOptions.w = 'majority';
  // TLS is handled automatically by Atlas SRV connections
}

mongoose.connect(MONGO_URI, connectionOptions)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    const dbName = mongoose.connection.name || 'adaptive-generator';
    const host = isAtlas ? 'MongoDB Atlas' : mongoose.connection.host;
    console.log(`📊 Database: ${dbName}`);
    console.log(`🌐 Host: ${host}`);
    if (isAtlas) {
      console.log('☁️  Connected to MongoDB Atlas cloud cluster');
    }
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:');
    console.error('Error message:', err.message);
    console.error('Error code:', err.code || 'N/A');
    
    // Provide helpful error messages for common issues
    if (err.message.includes('ECONNREFUSED')) {
      console.error('\n💡 SUGGESTION: MongoDB server is not running or not accessible.');
      if (!isAtlas) {
        console.error('   For local MongoDB: Make sure MongoDB service is running.');
      } else {
        console.error('   For Atlas: Check your network connection and IP whitelist settings.');
      }
    } else if (err.message.includes('authentication failed') || err.message.includes('bad auth')) {
      console.error('\n💡 SUGGESTION: Authentication failed.');
      if (isAtlas) {
        console.error('   - Verify username and password in your Atlas connection string');
        console.error('   - Check that the database user exists in Atlas');
        console.error('   - Ensure the user has proper permissions');
      } else {
        console.error('   - Check your username and password in the connection string');
      }
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('DNS')) {
      console.error('\n💡 SUGGESTION: Cannot resolve hostname.');
      if (isAtlas) {
        console.error('   - Check your Atlas cluster address in the connection string');
        console.error('   - Verify your cluster is active in Atlas dashboard');
        console.error('   - Check internet connectivity');
      } else {
        console.error('   - Verify the MongoDB server address is correct');
      }
    } else if (err.message.includes('IP') || err.message.includes('whitelist')) {
      console.error('\n💡 SUGGESTION: IP address not whitelisted (MongoDB Atlas).');
      console.error('   - Go to Atlas Dashboard → Network Access');
      console.error('   - Add your current IP address or 0.0.0.0/0 (for all IPs - less secure)');
      console.error('   - Wait a few minutes for changes to propagate');
    } else if (err.message.includes('timeout') || err.code === 'ENOTFOUND') {
      console.error('\n💡 SUGGESTION: Connection timeout.');
      if (isAtlas) {
        console.error('   - Check your internet connection');
        console.error('   - Verify IP whitelist in Atlas Network Access');
        console.error('   - Check if your network blocks MongoDB Atlas');
      } else {
        console.error('   - Ensure MongoDB is running and accessible');
      }
    }
    
    // Don't exit - let the server start anyway so health endpoint works
    console.error('\n⚠️  Server will continue but database operations will fail.');
    console.error('   Fix the connection issue and restart the server.');
  });

app.use('/', projectRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server listening on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

