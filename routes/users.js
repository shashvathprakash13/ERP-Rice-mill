const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { verifyToken, authorize } = require('../middleware/auth');

// Note: In a beginner setup we enforce admin role for sensitive operations
router.get('/', verifyToken, authorize('admin'), usersController.listUsers);
router.get('/:id', verifyToken, authorize('admin'), usersController.getUser);
router.post('/', verifyToken, authorize('admin'), usersController.createUser);
router.put('/:id', verifyToken, authorize('admin'), usersController.updateUser);
router.delete('/:id', verifyToken, authorize('admin'), usersController.deleteUser);

module.exports = router;
