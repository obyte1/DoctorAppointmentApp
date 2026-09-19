const jwt = require('jsonwebtoken');
const { failure } = require('../utils/response');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return failure(res, 401, 'Authentication required.');
  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    next();
  } catch (error) {
    return failure(res, 401, 'Invalid or expired token...');
  }
};

module.exports = { authenticate };
