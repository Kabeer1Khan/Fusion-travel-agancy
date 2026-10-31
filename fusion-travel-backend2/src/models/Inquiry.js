const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 60 },
    email: { type: String, required: [true, 'Email is required'], lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true, maxlength: 120 },
    message: { type: String, required: [true, 'Message is required'], maxlength: 2000 },
    tourPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'TourPackage' },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
