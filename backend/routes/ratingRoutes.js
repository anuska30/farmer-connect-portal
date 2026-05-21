// backend/routes/ratingRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const Rating = require('../models/Rating');
const Crop = require('../models/Crop');
const Order = require('../models/Order');

// ✅ Add Rating
router.post('/add', protect, async (req, res) => {
  try {
    const { cropId, orderId, rating, comment } = req.body;

    if (!cropId || !orderId || !rating) {
      return res.status(400).json({ message: 'All fields required' });
    }

    // Check if order exists and belongs to buyer
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if already rated
    const existingRating = await Rating.findOne({
      order: orderId,
      crop: cropId
    });

    if (existingRating) {
      return res.status(400).json({ message: 'Already rated this order!' });
    }

    // Create rating
    const newRating = await Rating.create({
      crop: cropId,
      buyer: req.user.id,
      farmer: order.farmer,
      order: orderId,
      rating,
      comment
    });

    // Update crop average rating
    const allRatings = await Rating.find({ crop: cropId });
    const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    await Crop.findByIdAndUpdate(cropId, {
      averageRating: Math.round(avgRating * 10) / 10,
      totalRatings: allRatings.length
    });

    res.status(201).json({
      success: true,
      message: '✅ Rating added successfully!',
      rating: newRating
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already rated this order!' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ Get Ratings for a Crop
router.get('/crop/:cropId', async (req, res) => {
  try {
    const ratings = await Rating.find({ crop: req.params.cropId })
      .populate('buyer', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, ratings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;