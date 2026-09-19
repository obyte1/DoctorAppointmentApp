const express = require('express');
const controller = require('../controllers/doctor.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validation.middleware');
const { availabilityRules, availabilityIdRules } = require('../validators/appointment.validator');

const router = express.Router();
router.get('/', controller.list);
router.patch('/profile', authenticate, authorize('doctor'), controller.editProfile);
router.get('/availability', authenticate, authorize('doctor'), controller.myAvailability);
router.post('/availability', authenticate, authorize('doctor'), availabilityRules, validate, controller.addAvailability);
router.patch('/availability/:availabilityId', authenticate, authorize('doctor'), availabilityIdRules, availabilityRules, validate, controller.editAvailability);
router.delete('/availability/:availabilityId', authenticate, authorize('doctor'), availabilityIdRules, validate, controller.removeAvailability);
router.get('/appointments', authenticate, authorize('doctor'), controller.appointments);
router.get('/:doctorId/availability', controller.availability);
router.get('/:doctorId', controller.profile);

module.exports = router;
