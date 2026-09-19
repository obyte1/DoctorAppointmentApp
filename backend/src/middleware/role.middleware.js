const { failure } = require('../utils/response');

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return failure(res, 403, 'You are not allowed to access this resource.');
  next();
};

module.exports = { authorize };
