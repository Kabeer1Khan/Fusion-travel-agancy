const router = require('express').Router();
const { deleteReview } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth');
const Review = require('../models/Review');
const Subscriber = require('../models/Subscriber');
const asyncHandler = require('../utils/asyncHandler');

router.use('/auth', require('./auth.routes'));
router.use('/packages', require('./package.routes'));
router.use('/bookings', require('./booking.routes'));
router.use('/inquiries', require('./inquiry.routes'));
router.use('/admin', require('./admin.routes'));

// Frontend contact forms के aliases
router.use('/contact', require('./inquiry.routes'));
router.use('/enquiries', require('./inquiry.routes'));

// Newsletter
router.post('/subscribe', asyncHandler(async (req, res) => {
  const email = String((req.body && req.body.email) || '').trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }
  try {
    await Subscriber.create({ email });
  } catch (err) {
    if (err.code !== 11000) throw err; // पहले से subscribed है तो भी success
  }
  res.status(201).json({ success: true, message: 'Subscribed successfully to the newsletter!' });
}));

// Testimonials (home page पर दिखाने के लिए)
router.get('/testimonials', asyncHandler(async (req, res) => {
  const reviews = await Review.find().populate('user', 'name').populate('tourPackage', 'title slug').sort('-createdAt').limit(20);
  res.json({ success: true, count: reviews.length, data: reviews });
}));

router.delete('/reviews/:id', protect, deleteReview);

module.exports = router;
