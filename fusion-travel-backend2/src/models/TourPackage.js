const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: String,
  },
  { _id: false }
);

const tourPackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
    slug: { type: String, unique: true },
    destination: { type: String, required: [true, 'Destination is required'], trim: true },
    country: { type: String, trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
    currency: { type: String, default: 'USD' },
    durationDays: { type: Number, required: [true, 'Duration (days) is required'], min: 1 },
    category: {
      type: String,
      enum: ['Adventure', 'Beach', 'Cultural', 'Honeymoon', 'Family', 'Luxury', 'Religious', 'City'],
      default: 'Family',
    },
    images: [String],
    itinerary: [itinerarySchema],
    inclusions: [String],
    exclusions: [String],
    maxGroupSize: { type: Number, default: 20, min: 1 },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    ratingsAverage: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Title से URL-friendly slug बनता है, जैसे "Hunza Valley Tour" -> "hunza-valley-tour-k3f2"
tourPackageSchema.pre('validate', function () {
  if (this.isNew && !this.slug && this.title) {
    const base = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    this.slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }
});

module.exports = mongoose.model('TourPackage', tourPackageSchema);
