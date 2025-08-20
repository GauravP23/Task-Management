const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Global variable to track database status
global.isMongoConnected = false;

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/comments', require('./routes/comments'));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Task Management API is running!',
    database: global.isMongoConnected ? 'MongoDB Connected' : 'Mock Data Mode'
  });
});

// MongoDB Connection with timeout and fallback
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000,
    });
    global.isMongoConnected = true;
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('🔄 Starting server in mock data mode for development...');
    global.isMongoConnected = false;
  }
};

// Try to connect to MongoDB
connectToMongoDB();

// Start server regardless of MongoDB connection status
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  if (!global.isMongoConnected) {
    console.log('💡 Using mock data mode - perfect for frontend development!');
  }
});

module.exports = app;
