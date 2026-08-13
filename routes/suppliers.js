const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/suppliersController');
const { verifyToken, authorize } = require('../middleware/auth');

// Listing available to admin/manager/supervisor
router.get('/', verifyToken, authorize('admin','manager','supervisor'), suppliersController.listSuppliers);
router.get('/:id', verifyToken, authorize('admin','manager','supervisor'), suppliersController.getSupplier);
router.post('/', verifyToken, authorize('admin','manager'), suppliersController.createSupplier);
router.put('/:id', verifyToken, authorize('admin','manager'), suppliersController.updateSupplier);
router.delete('/:id', verifyToken, authorize('admin'), suppliersController.deleteSupplier);

module.exports = router;
