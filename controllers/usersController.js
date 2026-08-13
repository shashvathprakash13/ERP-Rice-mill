const mongoose = require('mongoose');
const User = require('../models/User');

// Simple helper to detect DB availability
const dbIsUp = () => mongoose.connection.readyState === 1;

// Mock users for when DB is down (helps learners continue frontend development)
const mockUsers = [
  { _id: 'u-001', username: 'admin', email: 'admin@grr.com', fullName: 'Admin User', role: 'admin', department: 'it', isActive: true },
  { _id: 'u-002', username: 'manager', email: 'manager@grr.com', fullName: 'Manager User', role: 'manager', department: 'production', isActive: true },
];

// GET /api/users - List users (admin)
exports.listUsers = async (req, res) => {
  try {
    if (!dbIsUp()) {
      return res.json({ data: mockUsers, note: 'DB offline - returning mock data' });
    }

    const users = await User.find().select('-password');
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:id - Get single user
exports.getUser = async (req, res) => {
  try {
    if (!dbIsUp()) {
      const u = mockUsers.find(m => m._id === req.params.id) || null;
      return res.json({ data: u, note: 'DB offline - returning mock data' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/users - Create a user (admin)
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, fullName, department, role, phone } = req.body;
    if (!username || !email || !password || !fullName || !department) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!dbIsUp()) {
      return res.status(503).json({ message: 'DB offline - cannot create user in demo mode' });
    }

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(409).json({ message: 'Username or email already exists' });

    const newUser = new User({ username, email, password, fullName, department, role: role || 'viewer', phone });
    await newUser.save();
    res.status(201).json({ message: 'User created', data: newUser.toJSON() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/:id - Update user (admin)
exports.updateUser = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot update user in demo mode' });

    const updates = req.body;
    // Prevent password update here; use change-password endpoint
    delete updates.password;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated', data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/users/:id - Delete user (admin)
exports.deleteUser = async (req, res) => {
  try {
    if (!dbIsUp()) return res.status(503).json({ message: 'DB offline - cannot delete user in demo mode' });

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
