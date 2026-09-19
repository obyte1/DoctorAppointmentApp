const jwt = require('jsonwebtoken');

const createToken = (user) => jwt.sign(
  { userId: user._id.toString(), role: user.role, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
);

module.exports = { createToken };
