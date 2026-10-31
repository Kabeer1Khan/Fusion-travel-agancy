const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tourPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'TourPackage' },
    packageTitle: { type: String, trim: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    travelDate: { type: Date },
    numberOfTravelers: { type: Number, default: 1, min: 1 },
    totalPrice: { type: Number, default: 0 },
    specialRequests: { type: String, maxlength: 1000 },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);

