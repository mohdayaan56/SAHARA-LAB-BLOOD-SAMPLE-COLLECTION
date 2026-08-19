const router = require('express').Router();
const { getPatientAnalytics } = require('../controllers/analyticsController');

// Public patient analytics endpoint (query by phone or bookingId)
router.get('/analytics', getPatientAnalytics);

module.exports = router;
