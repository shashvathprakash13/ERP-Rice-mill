const express = require('express');
const router = express.Router();
const payments = require('../controllers/paymentsController');
const ledger = require('../controllers/ledgerController');
const { verifyToken, authorize } = require('../middleware/auth');

// Payments
router.get('/payments', verifyToken, authorize('admin','manager','finance'), payments.listPayments);
router.post('/payments', verifyToken, authorize('admin','manager','finance'), payments.createPayment);
router.get('/payments/:id', verifyToken, authorize('admin','manager','finance'), payments.getPayment);
router.delete('/payments/:id', verifyToken, authorize('admin','finance'), payments.deletePayment);

// Ledger
router.get('/ledger', verifyToken, authorize('admin','manager','finance'), ledger.listEntries);
router.post('/ledger', verifyToken, authorize('admin','finance'), ledger.createEntry);
router.get('/ledger/:id', verifyToken, authorize('admin','manager','finance'), ledger.getEntry);
router.delete('/ledger/:id', verifyToken, authorize('admin','finance'), ledger.deleteEntry);

module.exports = router;
