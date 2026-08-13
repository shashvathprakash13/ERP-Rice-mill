const express = require('express');
const router = express.Router();
const farmersController = require('../controllers/farmersController');
const { verifyToken, authorize } = require('../middleware/auth');

// Public listing allowed, but creation/updation restricted to logged-in users (manager/admin)
router.get('/', verifyToken, authorize('admin','manager','supervisor'), farmersController.listFarmers);
router.get('/:id', verifyToken, authorize('admin','manager','supervisor'), farmersController.getFarmer);
router.post('/', verifyToken, authorize('admin','manager'), farmersController.createFarmer);
router.put('/:id', verifyToken, authorize('admin','manager'), farmersController.updateFarmer);
router.delete('/:id', verifyToken, authorize('admin'), farmersController.deleteFarmer);

module.exports = router;
