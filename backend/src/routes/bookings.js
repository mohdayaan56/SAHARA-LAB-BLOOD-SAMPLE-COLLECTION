const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const {
  createBooking, getAllBookings, getMyBookings, searchBookings,
  getBooking, assignBooking, collectSample, markProcessing, saveReport, updateBooking,
} = require('../controllers/bookingController');

// ── Specific named routes MUST come before /:id ────────────

// Public
router.post('/',              createBooking);
router.get('/search',         searchBookings);

// Authenticated — Admin (GET / must be before /:id)
router.get('/',               authenticate, requireRole('admin'),  getAllBookings);

// Authenticated — Lab boy (/my/list must be before /:id)
router.get('/my/list',        authenticate, requireRole('labboy'), getMyBookings);

// Public wildcard — must be last among GETs
router.get('/:id',            getBooking);

// Mutations (order doesn't matter here as the prefix varies)
router.patch('/:id/assign',   authenticate, requireRole('admin'),  assignBooking);
router.patch('/:id/process',  authenticate, requireRole('admin'),  markProcessing);
router.patch('/:id/report',   authenticate, requireRole('admin'),  saveReport);
router.patch('/:id/collect',  authenticate, requireRole('labboy'), collectSample);
router.patch('/:id',          authenticate, requireRole('admin'),  updateBooking);

module.exports = router;

