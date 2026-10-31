const mongoose = require('mongoose');
const Inquiry = require('../models/Inquiry');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/inquiries  (public: Contact Us / "Enquire now" form)
exports.createInquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message, tourPackage } = req.body;
  const inquiry = await Inquiry.create({
    name,
    email,
    phone,
    subject,
    message,
    tourPackage: mongoose.isValidObjectId(tourPackage) ? tourPackage : undefined,
  });
  res.status(201).json({ success: true, message: 'Thank you! We will contact you soon.', data: inquiry });
});

// GET /api/inquiries?status=new  (admin)
exports.getInquiries = asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: String(req.query.status) } : {};
  const inquiries = await Inquiry.find(filter).populate('tourPackage', 'title').sort('-createdAt').limit(500);
  res.json({ success: true, count: inquiries.length, data: inquiries });
});

// PATCH /api/inquiries/:id/status  (admin)  body: { status }
exports.updateInquiryStatus = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    res.status(404);
    throw new Error('Inquiry not found');
  }
  if (!['new', 'contacted', 'closed'].includes(req.body.status)) {
    res.status(400);
    throw new Error('Status must be new, contacted or closed');
  }
  inquiry.status = req.body.status;
  await inquiry.save();
  res.json({ success: true, data: inquiry });
});
