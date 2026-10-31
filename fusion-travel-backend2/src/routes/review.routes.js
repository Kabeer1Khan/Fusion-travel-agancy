const router = require('express').Router({ mergeParams: true }); // mergeParams: ताकि :packageId मिल सके
const { getPackageReviews, createReview } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth');

router.route('/').get(getPackageReviews).post(protect, createReview);

module.exports = router;
