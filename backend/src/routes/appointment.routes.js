const express = require('express');
const controller = require('../controllers/appointment.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validation.middleware');
const { appointmentRules, appointmentIdRules } = require('../validators/appointment.validator');

const router = express.Router();
router.post('/', authenticate, authorize('patient'), appointmentRules, validate, controller.book);
router.get('/my', authenticate, authorize('patient'), controller.mine);
router.get('/:appointmentId', authenticate, appointmentIdRules, validate, controller.details);
router.patch('/:appointmentId/cancel', authenticate, appointmentIdRules, validate, controller.cancel);
module.exports = router;
