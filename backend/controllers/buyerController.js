// backend/controllers/buyerController.js

const Crop = require('../models/Crop');
const Order = require('../models/Order');
const User = require('../models/User');

// ─── BROWSE ALL CROPS ─────────────────────────────────
const browseCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ isAvailable: true })
      .populate('farmer', 'name email');
    res.status(200).json({
      message: '✅ Crops fetched!',
      count: crops.length,
      crops
    });
  } catch (error) {
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
};

// ─── SEARCH CROPS ─────────────────────────────────────
const searchCrops = async (req, res) => {
  try {
    const { name, category } = req.query;
    let filter = { isAvailable: true };
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (category) filter.category = category;
    const crops = await Crop.find(filter)
      .populate('farmer', 'name email');
    res.status(200).json({
      message: '✅ Search results!',
      count: crops.length,
      crops
    });
  } catch (error) {
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
};

// ─── PLACE ORDER ──────────────────────────────────────
const placeOrder = async (req, res) => {
  try {
    const { cropId, quantity, deliveryAddress, paymentId, paymentStatus } = req.body;

    // Step 1: Check all fields
    if (!cropId || !quantity || !deliveryAddress) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    // Step 2: Find the crop
    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ message: '❌ Crop not found' });
    }

    // Step 3: Check quantity available
    if (quantity > crop.quantity) {
      return res.status(400).json({
        message: `❌ Only ${crop.quantity} ${crop.unit} available`
      });
    }

    // Step 4: Calculate total price
    const totalPrice = quantity * crop.price;

    // ✅ Step 5: Calculate Commission
    const commissionRate = 10; // 10%
    const commissionAmount = (totalPrice * commissionRate) / 100;
    const farmerEarning = totalPrice - commissionAmount;

    // Step 6: Create the order
    const order = await Order.create({
      crop: cropId,
      buyer: req.user.id,
      farmer: crop.farmer,
      quantity,
      totalPrice,
      deliveryAddress,
      paymentId: paymentId || null,
      paymentStatus: paymentStatus || 'pending',
      commissionRate,
      commissionAmount,
      farmerEarning
    });

    // Step 7: Reduce crop quantity
    await Crop.findByIdAndUpdate(cropId, {
      quantity: crop.quantity - quantity
    });

    // ✅ Step 8: Update Farmer Earnings
    await User.findByIdAndUpdate(crop.farmer, {
      $inc: {
        'earnings.totalEarnings': farmerEarning,
        'earnings.pendingAmount': farmerEarning
      }
    });

    res.status(201).json({
      message: '✅ Order placed successfully!',
      order,
      commission: {
        totalPrice,
        commissionRate: `${commissionRate}%`,
        commissionAmount,
        farmerEarning
      }
    });

  } catch (error) {
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
};

// ─── GET MY ORDERS ────────────────────────────────────
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('crop', 'name price unit')
      .populate('farmer', 'name email');
    res.status(200).json({
      message: '✅ Your orders fetched!',
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
};

module.exports = { browseCrops, searchCrops, placeOrder, getMyOrders };