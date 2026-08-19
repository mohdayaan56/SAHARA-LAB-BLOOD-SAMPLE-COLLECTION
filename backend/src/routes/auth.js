const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { adminLogin, labboyLogin, getMe } = require('../controllers/authController');

router.post('/admin-login',  adminLogin);
router.post('/labboy-login', labboyLogin);
router.get('/me',            authenticate, getMe);

module.exports = router;
