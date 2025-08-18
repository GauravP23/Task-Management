const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Task Management API is running!' });
});

// MongoDB Connection - temporarily disabled for development
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log('Connected to MongoDB Atlas');
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error:', error);
//     console.log('Starting server without MongoDB connection for development...');
//   });

console.log('Running in development mode without MongoDB');

// Start server regardless of MongoDB connection status
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
