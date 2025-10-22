import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Validation des entrées
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation des entrées
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email format' 
      });
    }
    
    if (!validatePassword(password)) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
      });
    }
    
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({ 
      success: true,
      token, 
      user: userResponse,
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during authentication' 
    });
  }
});

// Register new user (public route - modifié pour permettre l'inscription publique)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, position } = req.body;
    
    // Validation des entrées
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Name, email and password are required' 
      });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email format' 
      });
    }
    
    if (!validatePassword(password)) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }
    
    // Create new user (role par défaut: user)
    const user = new User({
      name,
      email,
      password,
      role: role || 'user', // Par défaut 'user' pour les inscriptions publiques
      department: department || null,
      position: position || null,
    });
    
    await user.save();
    
    // Generate JWT token for auto-login after registration
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse
    });
    
  } catch (error) {
    console.error('Register error:', error);
    
    // Gestion des erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors 
      });
    }
    
    // Erreur de duplication (email unique)
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration' 
    });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true,
      user 
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching user data' 
    });
  }
});

// Admin only - Create user (pour les administrateurs)
router.post('/admin/create-user', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin only.' 
      });
    }
    
    const { name, email, password, role, department, position } = req.body;
    
    // Validation des entrées
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email format' 
      });
    }
    
    if (!validatePassword(password)) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      department,
      position,
    });
    
    await user.save();
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({ 
      success: true,
      message: 'User created successfully',
      user: userResponse
    });
    
  } catch (error) {
    console.error('Admin create user error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors 
      });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating user' 
    });
  }
});

// Change password
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validation des entrées
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Current password and new password are required' 
      });
    }
    
    if (!validatePassword(newPassword)) {
      return res.status(400).json({ 
        success: false,
        message: 'New password must be at least 6 characters long' 
      });
    }
    
    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ 
      success: true,
      message: 'Password updated successfully' 
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while changing password' 
    });
  }
});

// Refresh token route
router.post('/refresh-token', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Generate new JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    
    res.json({ 
      success: true,
      token,
      message: 'Token refreshed successfully'
    });
    
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while refreshing token' 
    });
  }
});

export default router;