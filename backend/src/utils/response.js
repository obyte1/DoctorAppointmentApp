const success = (res, statusCode, message, data = null) =>
  res.status(statusCode).json({ success: true, message, data });

const failure = (res, statusCode, message, data = null) =>
  res.status(statusCode).json({ success: false, message, data });

module.exports = { success, failure };
