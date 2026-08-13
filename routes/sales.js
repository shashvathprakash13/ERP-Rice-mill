const express = require('express');
const router = express.Router();
const sc = require('../controllers/salesController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/', verifyToken, authorize('admin','manager','supervisor'), sc.listSales);
router.get('/:id', verifyToken, authorize('admin','manager','supervisor'), sc.getSale);
router.post('/', verifyToken, authorize('admin','manager','supervisor'), sc.createSale);
router.put('/:id', verifyToken, authorize('admin','manager'), sc.updateSale);
router.delete('/:id', verifyToken, authorize('admin'), sc.deleteSale);

module.exports = router;
