const { body } = require('express-validator');

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required.'),
  body('password').isStrongPassword({ minLength: 8, minSymbols: 0 }).withMessage('Password must be at least 8 characters with letters and numbers.'),
  body('role').isIn(['patient', 'doctor']).withMessage('Role must be patient or doctor.'),
  body('specialization').if(body('role').equals('doctor')).trim().notEmpty().withMessage('Specialization is required for doctors.'),
  body('licenseNumber').if(body('role').equals('doctor')).trim().notEmpty().withMessage('License number is required for doctors.')
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.')
];

module.exports = { registerRules, loginRules };
