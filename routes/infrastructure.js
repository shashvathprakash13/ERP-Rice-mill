const express = require('express');
const router = express.Router();
const infra = require('../controllers/infrastructureController');
const { verifyToken, authorize } = require('../middleware/auth');

// Spares
router.get('/spares', verifyToken, authorize('admin','manager','supervisor'), infra.listSpares);
router.post('/spares', verifyToken, authorize('admin','manager'), infra.createSpare);
router.get('/spares/:id', verifyToken, authorize('admin','manager','supervisor'), infra.getSpare);
router.put('/spares/:id', verifyToken, authorize('admin','manager'), infra.updateSpare);
router.delete('/spares/:id', verifyToken, authorize('admin'), infra.deleteSpare);

module.exports = router;
