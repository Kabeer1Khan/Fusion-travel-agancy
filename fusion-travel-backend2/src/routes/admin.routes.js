const router = require('express').Router();
const { getStats, getReviews, getSubscribers, getUsers } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/reviews', getReviews);
router.get('/subscribers', getSubscribers);
router.get('/users', getUsers);

module.exports = router;
