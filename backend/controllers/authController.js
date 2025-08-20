const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Mock data for development when MongoDB is not available
const mockUsers = [
  {
    _id: 'mock_user_1',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$12$placeholder_hash', // 'password123'
    role: 'user',
    isActive: true
  },
  {
    _id: 'mock_user_2', 
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$12$placeholder_hash', // 'admin123'
    role: 'admin',
    isActive: true
  }
];

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if we're in mock mode
    if (!global.isMongoConnected) {
      // Mock mode - check if user exists in mock data
      const userExists = mockUsers.find(user => user.email === email);
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create mock user
      const mockUser = {
        _id: `mock_user_${Date.now()}`,
        name,
        email,
        password: '$2a$12$placeholder_hash',
        role: 'user',
        isActive: true
      };
      
      mockUsers.push(mockUser);

      return res.status(201).json({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        token: generateToken(mockUser._id),
      });
    }

    // MongoDB mode - original logic
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if we're in mock mode
    if (!global.isMongoConnected) {
      // Mock mode authentication
      const mockUser = mockUsers.find(user => user.email === email);
      if (!mockUser) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // For demo purposes, accept any password that's at least 6 characters
      if (password.length < 6) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      return res.json({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        token: generateToken(mockUser._id),
      });
    }

    // MongoDB mode - original logic
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account has been deactivated' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    // Check if we're in mock mode
    if (!global.isMongoConnected) {
      const mockUser = mockUsers.find(user => user._id === req.user.id);
      if (!mockUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password, ...userWithoutPassword } = mockUser;
      return res.json(userWithoutPassword);
    }

    // MongoDB mode - original logic
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
