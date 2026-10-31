const router = require('express').Router();
const { getPackages, getPackage, createPackage, updatePackage, deletePackage } = require('../controllers/package.controller');
const { protect, optionalAuth, adminOnly } = require('../middleware/auth');
const reviewRoutes = require('./review.routes');

// /api/packages/:packageId/reviews -> review routes
router.use('/:packageId/reviews', reviewRoutes);

router.route('/').get(optionalAuth, getPackages).post(protect, adminOnly, createPackage);
router
  .route('/:id')
  .get(optionalAuth, getPackage)
  .put(protect, adminOnly, updatePackage)
  .delete(protect, adminOnly, deletePackage);

module.exports = router;
