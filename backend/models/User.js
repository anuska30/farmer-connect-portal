const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  role: {
    type: String,
    enum: ['farmer', 'buyer', 'admin'],
    default: 'farmer'
  },

  phone: {
    type: String
  },

  farmerProfile: {
    village: String,
    state: String,
    farmSize: String,
    crops: [String]
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);