const router = require('express').Router();
const { createInquiry, getInquiries, updateInquiryStatus } = require('../controllers/inquiry.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/').post(createInquiry).get(protect, adminOnly, getInquiries);
router.patch('/:id/status', protect, adminOnly, updateInquiryStatus);

module.exports = router;
