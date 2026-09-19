const { validationResult } = require('express-validator');
const { failure } = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return failure(res, 400, errors.array()[0].msg, errors.array());
  next();
};

module.exports = { validate };
