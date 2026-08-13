const express = require('express');
const router = express.Router();
const pc = require('../controllers/paymentsController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/', verifyToken, authorize('admin','manager','finance'), pc.listPayments);
router.get('/:id', verifyToken, authorize('admin','manager','finance'), pc.getPayment);
router.post('/', verifyToken, authorize('admin','manager','finance'), pc.createPayment);
router.delete('/:id', verifyToken, authorize('admin','finance'), pc.deletePayment);

module.exports = router;
