const Booking = require('../models/Booking');
const TourPackage = require('../models/TourPackage');
const Inquiry = require('../models/Inquiry');
const Review = require('../models/Review');
const User = require('../models/User');
const Subscriber = require('../models/Subscriber');
const asyncHandler = require('../utils/asyncHandler');

const pageParams = (q, def = 20) => ({
  page: Math.max(parseInt(q.page, 10) || 1, 1),
  limit: Math.min(Math.max(parseInt(q.limit, 10) || def, 1), 100),
});

// GET /api/admin/stats  -> dashboard के सारे numbers एक ही call में (सारी bookings से, सिर्फ 5 से नहीं)
exports.getStats = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const [
    bookingsTotal, byStatusRaw, money, monthlyRaw, topRaw,
    packagesTotal, packagesActive, packagesFeatured,
    inquiriesTotal, inquiriesNew, reviewsAgg, usersTotal, subscribersTotal,
    recentBookings, recentInquiries,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: '$paymentStatus', total: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
    ]),
    Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: 'cancelled' } } },
      { $group: {
        _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
        bookings: { $sum: 1 },
        revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalPrice', 0] } },
        value: { $sum: '$totalPrice' },
      } },
    ]),
    Booking.aggregate([
      { $match: { tourPackage: { $ne: null }, status: { $ne: 'cancelled' } } },
      { $group: { _id: '$tourPackage', bookings: { $sum: 1 }, value: { $sum: '$totalPrice' } } },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'tourpackages', localField: '_id', foreignField: '_id', as: 'pkg' } },
      { $project: { bookings: 1, value: 1, title: { $arrayElemAt: ['$pkg.title', 0] } } },
    ]),
    TourPackage.countDocuments(),
    TourPackage.countDocuments({ isActive: true }),
    TourPackage.countDocuments({ featured: true }),
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: 'new' }),
    Review.aggregate([{ $group: { _id: null, count: { $sum: 1 }, avg: { $avg: '$rating' } } }]),
    User.countDocuments({ role: 'user' }),
    Subscriber.countDocuments(),
    Booking.find().populate('tourPackage', 'title').sort('-createdAt').limit(6),
    Inquiry.find().sort('-createdAt').limit(6),
  ]);

  const byStatus = { pending: 0, confirmed: 0, cancelled: 0, completed: 0 };
  byStatusRaw.forEach((r) => { byStatus[r._id] = r.count; });

  // revenue = सिर्फ paid bookings. pending payment = cancelled को छोड़कर unpaid bookings
  const paid = money.find((m) => m._id === 'paid') || { total: 0, count: 0 };
  const unpaid = money.find((m) => m._id === 'unpaid') || { total: 0, count: 0 };

  // पिछले 6 महीने, खाली महीने भी 0 के साथ
  const monthly = [];
  const cursor = new Date(sixMonthsAgo);
  for (let i = 0; i < 6; i += 1) {
    const y = cursor.getFullYear();
    const m = cursor.getMonth() + 1;
    const hit = monthlyRaw.find((r) => r._id.y === y && r._id.m === m);
    monthly.push({
      label: cursor.toLocaleString('en-GB', { month: 'short' }),
      year: y,
      bookings: hit ? hit.bookings : 0,
      revenue: hit ? hit.revenue : 0,
      value: hit ? hit.value : 0,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  res.json({
    success: true,
    data: {
      bookings: { total: bookingsTotal, byStatus },
      revenue: { paid: paid.total, pending: unpaid.total, paidCount: paid.count, unpaidCount: unpaid.count },
      packages: { total: packagesTotal, active: packagesActive, featured: packagesFeatured },
      inquiries: { total: inquiriesTotal, new: inquiriesNew },
      reviews: { total: reviewsAgg[0] ? reviewsAgg[0].count : 0, average: reviewsAgg[0] ? Math.round(reviewsAgg[0].avg * 10) / 10 : 0 },
      customers: usersTotal,
      subscribers: subscribersTotal,
      monthly,
      topPackages: topRaw,
      recentBookings,
      recentInquiries,
    },
  });
});

// GET /api/admin/reviews?page=1&limit=20  (package का नाम और customer के साथ)
exports.getReviews = asyncHandler(async (req, res) => {
  const { page, limit } = pageParams(req.query);
  const [total, reviews] = await Promise.all([
    Review.countDocuments(),
    Review.find().populate('user', 'name email').populate('tourPackage', 'title slug')
      .sort('-createdAt').skip((page - 1) * limit).limit(limit),
  ]);
  res.json({ success: true, total, page, pages: Math.ceil(total / limit), data: reviews });
});

// GET /api/admin/subscribers
exports.getSubscribers = asyncHandler(async (req, res) => {
  const { page, limit } = pageParams(req.query, 50);
  const [total, subs] = await Promise.all([
    Subscriber.countDocuments(),
    Subscriber.find().sort('-createdAt').skip((page - 1) * limit).limit(limit),
  ]);
  res.json({ success: true, total, page, pages: Math.ceil(total / limit), data: subs });
});

// GET /api/admin/users?search=ali
exports.getUsers = asyncHandler(async (req, res) => {
  const { page, limit } = pageParams(req.query);
  const filter = {};
  if (req.query.search) {
    const rx = new RegExp(String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }
  const [total, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit),
  ]);
  res.json({ success: true, total, page, pages: Math.ceil(total / limit), data: users });
});
