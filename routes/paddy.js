const express = require('express');
const router = express.Router();
const paddyController = require('../controllers/paddyController');
const { verifyToken, authorize } = require('../middleware/auth');

// Paddy entry routes — require authenticated user
router.get('/', verifyToken, authorize('admin','manager','supervisor','operator'), paddyController.listEntries);
router.get('/:id', verifyToken, authorize('admin','manager','supervisor','operator'), paddyController.getEntry);
router.post('/', verifyToken, authorize('admin','manager','operator'), paddyController.createEntry);
router.put('/:id', verifyToken, authorize('admin','manager','operator'), paddyController.updateEntry);
router.delete('/:id', verifyToken, authorize('admin','manager'), paddyController.deleteEntry);

module.exports = router;
