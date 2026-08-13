const express = require('express');
const router = express.Router();
const buyersController = require('../controllers/buyersController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/', verifyToken, authorize('admin','manager','supervisor'), buyersController.listBuyers);
router.get('/:id', verifyToken, authorize('admin','manager','supervisor'), buyersController.getBuyer);
router.post('/', verifyToken, authorize('admin','manager'), buyersController.createBuyer);
router.put('/:id', verifyToken, authorize('admin','manager'), buyersController.updateBuyer);
router.delete('/:id', verifyToken, authorize('admin'), buyersController.deleteBuyer);

module.exports = router;
