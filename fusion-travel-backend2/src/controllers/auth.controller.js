const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');

const sendToken = (user, status, res) => {
  res.status(status).json({
    success: true,
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  });
};

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const cleanEmail = String(email).toLowerCase().trim();
  if (await User.findOne({ email: cleanEmail })) {
    res.status(409);
    throw new Error('Email already registered');
  }

  // role हमेशा "user" रहेगा. बाहर से कोई खुद को admin नहीं बना सकता
  const user = await User.create({ name, email: cleanEmail, password, phone });
  sendToken(user, 201, res);
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
  if (!user || !(await user.matchPassword(String(password)))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  sendToken(user, 200, res);
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// PUT /api/auth/me  (सिर्फ name और phone बदल सकते हैं)
exports.updateMe = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  if (name !== undefined) req.user.name = name;
  if (phone !== undefined) req.user.phone = phone;
  await req.user.save();
  res.json({ success: true, user: req.user });
});
