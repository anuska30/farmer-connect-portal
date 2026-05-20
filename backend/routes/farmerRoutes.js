// backend/routes/farmerRoutes.js

console.log("FARMER ROUTES FILE LOADED");

const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const {
  addCrop,
  getAllCrops,
  getMyCrops,
  updateCrop,
  deleteCrop,
  getCropById
} = require('../controllers/farmerController');

// ─── PUBLIC ROUTE (no login needed) ──────────────────
router.get('/crops', getAllCrops);

// ─── PROTECTED ROUTES (login required) ───────────────
router.post('/crop', protect, addCrop);
router.get('/my-crops', protect, getMyCrops);
router.get('/crop/:id', protect, getCropById);
router.put('/crop/:id', protect, updateCrop);
router.delete('/crop/:id', protect, deleteCrop);

// ✅ NEW: Bank Details Routes
router.post('/bank-details', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const { accountHolderName, accountNumber, ifscCode, bankName } = req.body;

    if (!accountHolderName || !accountNumber || !ifscCode || !bankName) {
      return res.status(400).json({ message: 'All bank details are required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        bankDetails: {
          accountHolderName,
          accountNumber,
          ifscCode,
          bankName,
          isVerified: false
        }
      },
      { new: true }
    ).select('-password');

    res.json({ success: true, message: 'Bank details saved!', user });
  } catch (error) {
    console.error('Bank details error:', error);
    res.status(500).json({ message: 'Failed to save bank details' });
  }
});

router.get('/bank-details', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, bankDetails: user.bankDetails, earnings: user.earnings });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get bank details' });
  }
});

// ✅ NEW: Earnings Route
router.get('/earnings', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id).select('earnings commissionRate');
    res.json({ success: true, earnings: user.earnings, commissionRate: user.commissionRate });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get earnings' });
  }
});

module.exports = router;