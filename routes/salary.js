const express = require('express');
const router = express.Router();
const sc = require('../controllers/salaryController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/', verifyToken, authorize('admin','manager','hr'), sc.list);
router.post('/', verifyToken, authorize('admin','manager','hr'), sc.create);
router.get('/:id', verifyToken, authorize('admin','manager','hr'), sc.get);

module.exports = router;
