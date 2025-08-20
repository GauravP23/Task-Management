const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Mock users for development
const mockUsers = [
  {
    _id: 'mock_user_1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    isActive: true
  },
  {
    _id: 'mock_user_2', 
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    isActive: true
  }
];

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if we're in mock mode
    if (!global.isMongoConnected) {
      // Mock mode - find user in mock data
      const user = mockUsers.find(u => u._id === decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: 'Account has been deactivated' });
      }
      
      req.user = user;
      return next();
    }

    // MongoDB mode - original logic
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account has been deactivated' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
