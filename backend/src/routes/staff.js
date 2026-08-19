const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { getAllStaff, getLabBoys, getStaffById } = require('../controllers/staffController');

router.get('/',         authenticate, requireRole('admin'), getAllStaff);
router.get('/labboys',  authenticate, requireRole('admin'), getLabBoys);
router.get('/:id',      authenticate, requireRole('admin'), getStaffById);

module.exports = router;
