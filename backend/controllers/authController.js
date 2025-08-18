const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // Temporarily disabled

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

// Register User - Mock implementation
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Mock user creation (temporary)
    const mockUser = {
      _id: 'mock-user-id-' + Date.now(),
      name,
      email,
      role: 'member'
    };

    res.status(201).json({
      _id: mockUser._id,
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
      token: generateToken(mockUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User - Mock implementation
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Mock authentication (temporary)
    if (email && password) {
      const mockUser = {
        _id: 'mock-user-id-login',
        name: 'Test User',
        email: email,
        role: 'member'
      };

      res.json({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        token: generateToken(mockUser._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile - Mock implementation
const getUserProfile = async (req, res) => {
  try {
    const mockUser = {
      _id: 'mock-user-id-profile',
      name: 'Test User',
      email: 'test@example.com',
      role: 'member'
    };
    res.json(mockUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
