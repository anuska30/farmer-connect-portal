// backend/models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',        // links to the Crop model
    required: true
  },

  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',        // links to the User who is buying
    required: true
  },

  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',        // links to the User who is selling
    required: true
  },

  quantity: {
    type: Number,
    required: true      // how much buyer wants to buy
  },

  totalPrice: {
    type: Number,
    required: true      // quantity × crop price
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'  // order starts as pending
  },

  deliveryAddress: {
    type: String,
    required: true      // where to deliver
  }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);