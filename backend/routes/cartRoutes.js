// backend/routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

// ─── PROTECTED ROUTES (login required) ───────────────
router.post('/add', protect, addToCart);
router.get('/', protect, getCart);
router.delete('/remove/:cropId', protect, removeFromCart);
router.delete('/clear', protect, clearCart);

module.exports = router;