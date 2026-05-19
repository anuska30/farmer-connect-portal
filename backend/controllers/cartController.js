// backend/controllers/cartController.js

const Cart = require('../models/Cart');
const Crop = require('../models/Crop');

// ─── ADD TO CART ──────────────────────────────────────
const addToCart = async (req, res) => {
  try {
    const { cropId, quantity } = req.body;

    if (!cropId || !quantity) {
      return res.status(400).json({ message: 'Please provide cropId and quantity' });
    }

    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    if (quantity > crop.quantity) {
      return res.status(400).json({ message: `Only ${crop.quantity} kg available` });
    }

    let cart = await Cart.findOne({ buyer: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        buyer: req.user.id,
        items: [{ crop: cropId, quantity, price: crop.price }],
        totalPrice: crop.price * quantity
      });
    } else {
      const existingItem = cart.items.find(
        item => item.crop.toString() === cropId
      );

      if (existingItem) {
        existingItem.quantity += Number(quantity);
      } else {
        cart.items.push({ crop: cropId, quantity, price: crop.price });
      }

      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity, 0
      );

      await cart.save();
    }

    res.status(200).json({ message: '✅ Added to cart!', cart });

  } catch (error) {
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
};

// ─── GET CART ─────────────────────────────────────────
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ buyer: req.user.id })
      .populate('items.crop', 'name price quantity unit');

    if (!cart) {
      return res.status(200).json({ message: 'Cart is empty', items: [], totalPrice: 0 });
    }

    res.status(200).json({ message: '✅ Cart fetched!', cart });

  } catch (error) {
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
};

// ─── REMOVE FROM CART ─────────────────────────────────
const removeFromCart = async (req, res) => {
  try {
    const { cropId } = req.params;

    const cart = await Cart.findOne({ buyer: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.crop.toString() !== cropId
    );

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );

    await cart.save();

    res.status(200).json({ message: '✅ Item removed from cart!', cart });

  } catch (error) {
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
};

// ─── CLEAR CART ───────────────────────────────────────
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ buyer: req.user.id });
    res.status(200).json({ message: '✅ Cart cleared!' });
  } catch (error) {
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
};

module.exports = { addToCart, getCart, removeFromCart, clearCart };