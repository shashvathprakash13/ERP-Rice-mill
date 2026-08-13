const express = require('express');
const router = express.Router();
const ic = require('../controllers/inventoryController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/', verifyToken, authorize('admin','manager','supervisor'), ic.listItems);
router.get('/:id', verifyToken, authorize('admin','manager','supervisor'), ic.getItem);
router.post('/', verifyToken, authorize('admin','manager'), ic.createItem);
router.put('/:id', verifyToken, authorize('admin','manager'), ic.updateItem);
router.delete('/:id', verifyToken, authorize('admin'), ic.deleteItem);

module.exports = router;
