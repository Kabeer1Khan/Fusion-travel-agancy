// चलाने के लिए: npm run seed
// यह admin user बनाता है और sample packages भरता है (पुराने packages हट जाते हैं!)
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User = require('./models/User');
const TourPackage = require('./models/TourPackage');

const packages = [
  {
    title: 'Hunza Valley Adventure', destination: 'Hunza', country: 'Pakistan', category: 'Adventure',
    price: 450, durationDays: 7, maxGroupSize: 12, featured: true,
    description: 'Seven days through Karakoram valleys, Attabad Lake, Baltit Fort and Passu Cones.',
    inclusions: ['Hotel stay', 'Breakfast & dinner', 'Private transport', 'Local guide'],
    exclusions: ['Flights', 'Lunch', 'Personal expenses'],
    itinerary: [
      { day: 1, title: 'Arrival in Gilgit', description: 'Pickup and transfer to Hunza.' },
      { day: 2, title: 'Karimabad', description: 'Baltit Fort and Altit Fort visit.' },
      { day: 3, title: 'Attabad Lake & Passu', description: 'Boat ride and Passu Cones viewpoint.' },
    ],
  },
  {
    title: 'Maldives Beach Escape', destination: 'Malé', country: 'Maldives', category: 'Honeymoon',
    price: 1800, durationDays: 5, maxGroupSize: 6, featured: true,
    description: 'Overwater villa, snorkeling and sunset cruises on turquoise water.',
    inclusions: ['Resort stay', 'All meals', 'Speedboat transfers', 'Snorkeling trip'],
    exclusions: ['Flights', 'Spa treatments'],
    itinerary: [
      { day: 1, title: 'Arrival & Check-in', description: 'Speedboat transfer to your resort.' },
      { day: 2, title: 'Snorkeling', description: 'Guided reef snorkeling trip.' },
    ],
  },
  {
    title: 'Dubai City Break', destination: 'Dubai', country: 'UAE', category: 'City',
    price: 950, durationDays: 4, maxGroupSize: 20, featured: true,
    description: 'Burj Khalifa, desert safari, Dubai Mall and marina dhow cruise.',
    inclusions: ['4-star hotel', 'Breakfast', 'Desert safari', 'Airport transfers'],
    exclusions: ['Flights', 'Visa fee'],
  },
  {
    title: 'Bali Island Retreat', destination: 'Bali', country: 'Indonesia', category: 'Beach',
    price: 1100, durationDays: 6, maxGroupSize: 15,
    description: 'Rice terraces in Ubud, temples, surf beaches and a sunset at Uluwatu.',
    inclusions: ['Villa stay', 'Breakfast', 'Private driver'],
    exclusions: ['Flights', 'Lunch & dinner'],
  },
  {
    title: 'Istanbul & Cappadocia', destination: 'Istanbul', country: 'Turkey', category: 'Cultural',
    price: 1300, durationDays: 7, maxGroupSize: 18,
    description: 'Hagia Sophia, Bosphorus cruise and a hot-air balloon ride over Cappadocia.',
    inclusions: ['Hotels', 'Breakfast', 'Domestic flight', 'Guided tours'],
    exclusions: ['International flights', 'Balloon ride (optional)'],
  },
  {
    title: 'Swiss Alps Luxury Tour', destination: 'Interlaken', country: 'Switzerland', category: 'Luxury',
    price: 2900, durationDays: 8, maxGroupSize: 10,
    description: 'Scenic trains, Jungfraujoch, lakeside luxury hotels and fine dining.',
    inclusions: ['5-star hotels', 'Swiss Travel Pass', 'Daily breakfast'],
    exclusions: ['Flights', 'Visa fee'],
  },
];

(async () => {
  if (process.env.NODE_ENV === 'production') {
    console.error('Seeding is blocked when NODE_ENV=production');
    process.exit(1);
  }
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI missing in .env');
    process.exit(1);
  }

  const conn = await connectDB();
  if (!conn) {
    console.error('Seeding aborted: Could not connect to database.');
    process.exit(1);
  }

  const email = (process.env.ADMIN_EMAIL || 'admin@fusiontravel.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  if (!(await User.findOne({ email }))) {
    await User.create({ name: 'Admin', email, password, role: 'admin' });
    console.log(`Admin created -> ${email}`);
  } else {
    console.log(`Admin already exists -> ${email}`);
  }

  await TourPackage.deleteMany({});
  await TourPackage.create(packages); // create() से slug वाला hook भी चलता है
  console.log(`${packages.length} sample packages added`);

  await mongoose.disconnect();
  process.exit(0);
})();
