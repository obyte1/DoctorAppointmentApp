const express = require('express');
const rateLimit = require('express-rate-limit');
const controller = require('../controllers/auth.controller');
const { validate } = require('../middleware/validation.middleware');
const { registerRules, loginRules } = require('../validators/auth.validator');

const router = express.Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, message: { success: false, message: 'Too many authentication attempts.', data: null } });
router.post('/register', limiter, registerRules, validate, controller.register);
router.post('/login', limiter, loginRules, validate, controller.login);
module.exports = router;
