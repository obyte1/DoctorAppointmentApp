const authService = require('../services/auth.service');
const { success } = require('../utils/response');

const register = async (req, res, next) => { try { return success(res, 201, 'Registration successful.', await authService.register(req.body)); } catch (error) { next(error); } };
const login = async (req, res, next) => { try { return success(res, 200, 'Login successful.', await authService.login(req.body.email, req.body.password)); } catch (error) { error.statusCode = 401; next(error); } };
module.exports = { register, login };
