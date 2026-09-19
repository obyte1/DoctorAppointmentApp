const { failure } = require('../utils/response');

const notFound = (req, res) => failure(res, 404, `Route not found: ${req.originalUrl}`);

const errorHandler = (error, req, res, next) => {
  if (error.code === 11000) return failure(res, 409, 'A record with that value already exists.');
  if (error.name === 'ValidationError') return failure(res, 400, error.message);
  if (error.statusCode) return failure(res, error.statusCode, error.message);
  console.error(error);
  return failure(res, 500, process.env.NODE_ENV === 'production' ? 'Internal server error.' : error.message);
};

module.exports = { notFound, errorHandler };
