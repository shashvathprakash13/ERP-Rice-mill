const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId, userRole) => {
  return jwt.sign(
    { id: userId, role: userRole },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @POST /api/auth/register
// Register new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName, department, phone, role } = req.body;

    // Validate required fields
    if (!username || !email || !password || !fullName || !department) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      fullName,
      department,
      phone,
      role: role || 'viewer', // Default role
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/auth/login
// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user with password field
    const user = await User.findOne({ $or: [{ username }, { email: username }] }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'User account is inactive' });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: user.toJSON(),
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/auth/logout
// Logout user (frontend should delete token)
exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      message: 'Logout successful. Please delete the token on the client side.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/auth/profile
// Get user profile (requires token)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/auth/profile
// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { fullName, email, phone },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/auth/change-password
// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const user = await User.findById(req.userId).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/auth/users
// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      count: users.length,
      users: users.map(u => u.toJSON()),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/auth/users/:userId/role
// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const validRoles = ['admin', 'manager', 'supervisor', 'operator', 'viewer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User role updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
