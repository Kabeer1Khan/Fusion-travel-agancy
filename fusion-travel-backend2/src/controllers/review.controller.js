const Review = require('../models/Review');
const TourPackage = require('../models/TourPackage');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/packages/:packageId/reviews
exports.getPackageReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ tourPackage: req.params.packageId }).populate('user', 'name').sort('-createdAt');
  res.json({ success: true, count: reviews.length, data: reviews });
});

// POST /api/packages/:packageId/reviews  (login ज़रूरी)  body: { rating, comment }
exports.createReview = asyncHandler(async (req, res) => {
  const pkg = await TourPackage.findById(req.params.packageId);
  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }
  if (await Review.findOne({ user: req.user._id, tourPackage: pkg._id })) {
    res.status(409);
    throw new Error('You have already reviewed this package');
  }

  const rating = Number(req.body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be a whole number from 1 to 5');
  }

  const review = await Review.create({
    user: req.user._id,
    tourPackage: pkg._id,
    rating,
    comment: req.body.comment,
  });
  await Review.calcAverage(pkg._id);

  res.status(201).json({ success: true, data: review });
});

// DELETE /api/reviews/:id  (मालिक या admin)
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (!review.user.equals(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You cannot delete this review');
  }
  await review.deleteOne();
  await Review.calcAverage(review.tourPackage);
  res.json({ success: true, message: 'Review deleted' });
});
