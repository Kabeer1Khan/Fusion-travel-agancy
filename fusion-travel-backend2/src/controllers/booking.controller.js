const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const TourPackage = require('../models/TourPackage');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/bookings
exports.createBooking = asyncHandler(async (req, res) => {
  const packageId = req.body.tourPackage || req.body.package;
  const travelDate = req.body.travelDate;
  const numberOfTravelers = req.body.numberOfTravelers || req.body.travelers || 1;
  const specialRequests = req.body.specialRequests || req.body.message || '';
  const name = req.body.name || (req.user && req.user.name) || '';
  const email = req.body.email || (req.user && req.user.email) || '';
  const phone = req.body.phone || (req.user && req.user.phone) || '';

  // FIX: बिना नाम/संपर्क के booking आती थी, जिससे admin customer तक पहुँच ही नहीं पाता था
  if (!name.trim() || (!email.trim() && !phone.trim())) {
    res.status(400);
    throw new Error('Name and an email or phone number are required');
  }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    res.status(400);
    throw new Error('Please enter a valid email');
  }
  if (!packageId) {
    res.status(400);
    throw new Error('Please choose a tour package');
  }

  let pkg = null;
  if (packageId) {
    const query = mongoose.isValidObjectId(packageId) ? { _id: packageId } : { slug: packageId };
    pkg = await TourPackage.findOne({ ...query, isActive: true });
    if (!pkg) {
      res.status(404);
      throw new Error('Package not found');
    }
  }

  let date = null;
  if (travelDate) {
    date = new Date(travelDate);
    if (Number.isNaN(date.getTime())) {
      res.status(400);
      throw new Error('Travel date must be a valid date');
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      res.status(400);
      throw new Error('Travel date cannot be in the past');
    }
  }

  const travelers = Number(numberOfTravelers);
  if (!Number.isInteger(travelers) || travelers < 1) {
    res.status(400);
    throw new Error('Travelers count must be at least 1');
  }

  if (pkg && pkg.maxGroupSize && travelers > pkg.maxGroupSize) {
    res.status(400);
    throw new Error(`Travelers must be between 1 and ${pkg.maxGroupSize}`);
  }

  const totalPrice = pkg ? (pkg.price || 0) * travelers : 0;

  const booking = await Booking.create({
    user: req.user ? req.user._id : undefined,
    tourPackage: pkg ? pkg._id : undefined,
    packageTitle: pkg ? pkg.title : (req.body.packageTitle || undefined),
    name,
    email,
    phone,
    travelDate: date || undefined,
    numberOfTravelers: travelers,
    specialRequests,
    totalPrice,
  });

  res.status(201).json({
    success: true,
    message: 'Booking received successfully! We will contact you soon.',
    data: booking,
  });
});

// GET /api/bookings/my
exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('tourPackage', 'title slug destination images price currency')
    .sort('-createdAt');
  res.json({ success: true, count: bookings.length, data: bookings });
});

// GET /api/bookings?status=pending&page=1&limit=20  (admin)
exports.getAllBookings = asyncHandler(async (req, res) => {
  const { status, paymentStatus, search, page, limit } = req.query;
  const filter = {};
  if (status) filter.status = String(status);
  if (paymentStatus) filter.paymentStatus = String(paymentStatus);
  if (search) {
    const rx = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { packageTitle: rx }];
  }
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  const [total, bookings] = await Promise.all([
    Booking.countDocuments(filter),
    Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('tourPackage', 'title destination slug')
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
  ]);

  res.json({ success: true, total, page: pageNum, pages: Math.ceil(total / limitNum), data: bookings });
});

// GET /api/bookings/:id  (मालिक या admin)
exports.getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('tourPackage', 'title slug destination images price currency');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  const isOwner = booking.user && (booking.user._id ? booking.user._id.equals(req.user._id) : booking.user.equals(req.user._id));
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You cannot view this booking');
  }
  res.json({ success: true, data: booking });
});

// PATCH /api/bookings/:id/cancel  (मालिक या admin)
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  const isOwner = booking.user && (booking.user._id ? booking.user._id.equals(req.user._id) : booking.user.equals(req.user._id));
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You cannot cancel this booking');
  }
  if (!['pending', 'confirmed'].includes(booking.status)) {
    res.status(400);
    throw new Error(`A ${booking.status} booking cannot be cancelled`);
  }
  booking.status = 'cancelled';
  await booking.save();
  res.json({ success: true, data: booking });
});

// PATCH /api/bookings/:id/status  (admin)  body: { status, paymentStatus }
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  const { status, paymentStatus } = req.body;
  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;
  await booking.save(); // गलत value हुई तो enum validation अपने-आप 400 देगा
  res.json({ success: true, data: booking });
});
