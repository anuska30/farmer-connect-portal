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
  },

  // ✅ Bank Details
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    isVerified: {
      type: Boolean,
      default: false
    }
  },

  // ✅ Earnings
  earnings: {
    totalEarnings: {
      type: Number,
      default: 0
    },
    pendingAmount: {
      type: Number,
      default: 0
    },
    paidAmount: {
      type: Number,
      default: 0
    }
  },

  // ✅ Commission
  commissionRate: {
    type: Number,
    default: 10
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);