// backend/routes/buyerRoutes.js

console.log("BUYER ROUTES FILE LOADED");

const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const {
  browseCrops,
  searchCrops,
  placeOrder,
  getMyOrders
} = require('../controllers/buyerController');

// ─── PUBLIC ROUTES (no login needed) ─────────────────
router.get('/crops', browseCrops);           // browse all crops
router.get('/crops/search', searchCrops);    // search crops

// ─── PROTECTED ROUTES (login required) ───────────────
router.post('/order', protect, placeOrder);        // place order
router.get('/orders', protect, getMyOrders);       // my orders

module.exports = router;