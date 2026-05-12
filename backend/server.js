// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const buyerRoutes = require('./routes/buyerRoutes');   // ← NEW
const protect = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/buyer', buyerRoutes);     // ← NEW

app.get('/', (req, res) => {
  res.send('API Running');
});

app.get('/profile', protect, (req, res) => {
  res.json({
    message: 'Protected profile route accessed',
    user: req.user
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});