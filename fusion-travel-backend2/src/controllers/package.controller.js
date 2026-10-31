const mongoose = require('mongoose');
const TourPackage = require('../models/TourPackage');
const asyncHandler = require('../utils/asyncHandler');

// सिर्फ यही fields बाहर से बदलने दी जाएँगी (rating जैसी fields protected हैं)
const ALLOWED_FIELDS = [
  'title', 'destination', 'country', 'description', 'price', 'currency', 'durationDays',
  'category', 'images', 'itinerary', 'inclusions', 'exclusions', 'maxGroupSize', 'featured', 'isActive',
];

const pick = (obj, keys) =>
  keys.reduce((acc, k) => {
    if (obj[k] !== undefined) acc[k] = obj[k];
    return acc;
  }, {});

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORT_OPTIONS = { price: 'price', '-price': '-price', newest: '-createdAt', rating: '-ratingsAverage', duration: 'durationDays', title: 'title' };

// GET /api/packages?search=bali&category=Beach&minPrice=100&maxPrice=900&featured=true&sort=price&page=1&limit=12
exports.getPackages = asyncHandler(async (req, res) => {
  const { search, category, destination, minPrice, maxPrice, featured, sort, page, limit, all } = req.query;
  // FIX: admin dashboard को inactive packages भी दिखनी चाहिए (?all=true, सिर्फ admin token के साथ)
  const isAdmin = req.user && req.user.role === 'admin';
  const filter = isAdmin && all === 'true' ? {} : { isActive: true };

  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: rx }, { destination: rx }, { country: rx }];
  }
  if (destination) {
    filter.destination = new RegExp(escapeRegex(destination), 'i');
  }
  if (category) filter.category = String(category);
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (featured === 'true') filter.featured = true;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);

  const [total, packages] = await Promise.all([
    TourPackage.countDocuments(filter),
    TourPackage.find(filter)
      .sort(SORT_OPTIONS[sort] || '-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
  ]);

  res.json({ success: true, total, page: pageNum, pages: Math.ceil(total / limitNum), count: packages.length, data: packages });
});

// GET /api/packages/:id   (id या slug दोनों चलेंगे)
exports.getPackage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };
  const isAdmin = req.user && req.user.role === 'admin';
  const pkg = await TourPackage.findOne(isAdmin ? query : { ...query, isActive: true });
  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }
  res.json({ success: true, data: pkg });
});

// POST /api/packages  (admin)
exports.createPackage = asyncHandler(async (req, res) => {
  const pkg = await TourPackage.create(pick(req.body, ALLOWED_FIELDS));
  res.status(201).json({ success: true, data: pkg });
});

// PUT /api/packages/:id  (admin)
exports.updatePackage = asyncHandler(async (req, res) => {
  const pkg = await TourPackage.findById(req.params.id);
  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }
  pkg.set(pick(req.body, ALLOWED_FIELDS));
  await pkg.save();
  res.json({ success: true, data: pkg });
});

// DELETE /api/packages/:id  (admin)
exports.deletePackage = asyncHandler(async (req, res) => {
  const pkg = await TourPackage.findById(req.params.id);
  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }
  await pkg.deleteOne();
  res.json({ success: true, message: 'Package deleted' });
});
