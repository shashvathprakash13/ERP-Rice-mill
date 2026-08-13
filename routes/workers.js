const express = require('express');
const router = express.Router();
const wc = require('../controllers/workersController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/', verifyToken, authorize('admin','manager','supervisor'), wc.listWorkers);
router.get('/:id', verifyToken, authorize('admin','manager','supervisor'), wc.getWorker);
router.post('/', verifyToken, authorize('admin','manager'), wc.createWorker);
router.put('/:id', verifyToken, authorize('admin','manager'), wc.updateWorker);
router.delete('/:id', verifyToken, authorize('admin'), wc.deleteWorker);

module.exports = router;
