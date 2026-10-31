const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tourPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'TourPackage', required: true },
    rating: { type: Number, required: [true, 'Rating is required'], min: [1, 'Rating must be 1-5'], max: [5, 'Rating must be 1-5'] },
    comment: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

// एक user एक package पर सिर्फ एक review दे सकता है
reviewSchema.index({ user: 1, tourPackage: 1 }, { unique: true });

// Review जुड़ने/हटने पर package की average rating दोबारा निकालता है
reviewSchema.statics.calcAverage = async function (packageId) {
  const stats = await this.aggregate([
    { $match: { tourPackage: packageId } },
    { $group: { _id: '$tourPackage', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await mongoose.model('TourPackage').findByIdAndUpdate(packageId, {
    ratingsAverage: stats.length ? Math.round(stats[0].avg * 10) / 10 : 0,
    ratingsCount: stats.length ? stats[0].count : 0,
  });
};

module.exports = mongoose.model('Review', reviewSchema);
