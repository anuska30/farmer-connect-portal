// backend/models/Crop.js

const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,    // crop name is compulsory
    trim: true
  },

  description: {
    type: String,
    required: true     // details about the crop
  },

  price: {
    type: Number,
    required: true     // price per unit
  },

  unit: {
    type: String,
    enum: ['kg', 'quintal', 'ton', 'piece'],  // allowed units
    default: 'kg'
  },

  quantity: {
    type: Number,
    required: true     // how much is available
  },

  category: {
    type: String,
    enum: ['vegetables', 'fruits', 'grains', 'dairy', 'other'],
    default: 'other'
  },

  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',       // links crop to the farmer who created it
    required: true
  },

  isAvailable: {
    type: Boolean,
    default: true      // crop is available by default
  }

}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);