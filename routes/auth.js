const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected routes (require valid token)
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.post('/change-password', verifyToken, authController.changePassword);

// Admin-only routes
router.get('/users', verifyToken, authorize('admin'), authController.getAllUsers);
router.put('/users/:userId/role', verifyToken, authorize('admin'), authController.updateUserRole);

module.exports = router;
