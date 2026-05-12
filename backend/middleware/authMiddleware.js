// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    console.log('🔍 JWT_SECRET:', process.env.JWT_SECRET); // debug line
    console.log('🔍 Auth Header:', req.headers.authorization); // debug line

    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    token = token.split(' ')[1];
    console.log('🔍 Token:', token); // debug line

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔍 Decoded:', decoded); // debug line

    req.user = decoded;
    next();

  } catch (error) {
    console.log('❌ JWT Error:', error.message); // debug line
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = protect;