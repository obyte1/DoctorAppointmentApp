const express = require('express');
const controller = require('../controllers/appointment.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validation.middleware');
const { appointmentIdRules } = require('../validators/appointment.validator');

const router = express.Router();
router.get('/', authenticate, authorize('doctor'), require('../controllers/doctor.controller').appointments);
router.get('/:appointmentId', authenticate, authorize('doctor'), appointmentIdRules, validate, controller.details);
router.patch('/:appointmentId/cancel', authenticate, authorize('doctor'), appointmentIdRules, validate, controller.cancel);
module.exports = router;
