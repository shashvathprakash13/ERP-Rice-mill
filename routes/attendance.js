const express = require('express');
const router = express.Router();
const ac = require('../controllers/attendanceController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/', verifyToken, authorize('admin','manager','supervisor'), ac.list);
router.post('/', verifyToken, authorize('admin','manager'), ac.create);
router.get('/:date', verifyToken, authorize('admin','manager','supervisor'), ac.getByDate);

module.exports = router;
