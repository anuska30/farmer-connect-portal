// backend/routes/authRoutes.js

console.log("AUTH ROUTES FILE LOADED");

const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const {
  signup,
  login,
  getProfile,
  updateFarmerProfile,
  changePassword
} = require('../controllers/authController');

// ─── PUBLIC ROUTES ────────────────────────────────────
router.post('/signup', signup);
router.post('/login', login);

// ─── PROTECTED ROUTES ─────────────────────────────────
router.get('/me', protect, getProfile);
router.put('/update-profile', protect, updateFarmerProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;