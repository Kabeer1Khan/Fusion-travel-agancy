const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { register, login, getMe, updateMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

// Login/Register पर ज़्यादा सख़्त limit: 15 मिनट में 20 कोशिशें (password guess करने वालों से बचाव)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.route('/me').get(protect, getMe).put(protect, updateMe);

module.exports = router;
