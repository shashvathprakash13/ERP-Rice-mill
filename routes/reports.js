const express = require('express');
const router = express.Router();
const rc = require('../controllers/reportsController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/summary', verifyToken, authorize('admin','manager','supervisor'), rc.summary);
router.get('/export/inventory', verifyToken, authorize('admin','manager','supervisor'), rc.exportCSV);

module.exports = router;
