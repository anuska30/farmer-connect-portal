// backend/models/Crop.js
const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: ['kg', 'quintal', 'ton', 'piece'],
    default: 'kg'
  },
  quantity: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['vegetables', 'fruits', 'grains', 'dairy', 'other'],
    default: 'other'
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },

  // ✅ NEW: Rating Fields
  averageRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);