const express = require('express');
const router = express.Router();
const pc = require('../controllers/productionController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/', verifyToken, authorize('admin','manager','supervisor'), pc.listBatches);
router.get('/:id', verifyToken, authorize('admin','manager','supervisor'), pc.getBatch);
router.post('/', verifyToken, authorize('admin','manager'), pc.createBatch);
router.put('/:id', verifyToken, authorize('admin','manager'), pc.updateBatch);
router.delete('/:id', verifyToken, authorize('admin'), pc.deleteBatch);

module.exports = router;
