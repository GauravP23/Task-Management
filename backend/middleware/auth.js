const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // Temporarily disabled

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Mock user data (temporary)
    const mockUser = {
      _id: decoded.id,
      name: 'Test User',
      email: 'test@example.com',
      role: 'member'
    };
    
    req.user = mockUser;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
