const router = require('express').Router();
const {
  createBooking, getMyBookings, getAllBookings, getBooking, cancelBooking, updateBookingStatus,
} = require('../controllers/booking.controller');
const { protect, optionalAuth, adminOnly } = require('../middleware/auth');

// POST /api/bookings can be called by guests or logged-in users
router.post('/', optionalAuth, createBooking);

// Protected routes (login required)
router.get('/', protect, adminOnly, getAllBookings);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBooking);
router.patch('/:id/cancel', protect, cancelBooking);
router.patch('/:id/status', protect, adminOnly, updateBookingStatus);

module.exports = router;

