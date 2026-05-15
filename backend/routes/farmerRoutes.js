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
router.get('/crop/:id', protect, getCropById);
router.put('/crop/:id', protect, updateCrop);
router.delete('/crop/:id', protect, deleteCrop);

module.exports = router;