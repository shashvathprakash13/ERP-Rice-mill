const express = require('express');
const router = express.Router();
const wc = require('../controllers/warehouseController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/', verifyToken, authorize('admin','manager','supervisor'), wc.listWarehouses);
router.get('/:id', verifyToken, authorize('admin','manager','supervisor'), wc.getWarehouse);
router.post('/', verifyToken, authorize('admin','manager'), wc.createWarehouse);
router.put('/:id', verifyToken, authorize('admin','manager'), wc.updateWarehouse);
router.delete('/:id', verifyToken, authorize('admin'), wc.deleteWarehouse);

module.exports = router;
