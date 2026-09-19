const { body, param } = require('express-validator');

const objectId = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const time = /^([01]\d|2[0-3]):[0-5]\d$/;
const date = /^\d{4}-\d{2}-\d{2}$/;

const appointmentRules = [
  body('doctorId').custom(objectId).withMessage('A valid doctor ID is required.'),
  body('appointmentDate').matches(date).withMessage('Date must use YYYY-MM-DD format.'),
  body('startTime').matches(time).withMessage('Start time must use HH:mm format.'),
  body('endTime').matches(time).withMessage('End time must use HH:mm format.'),
  body('reason').optional().trim().isLength({ max: 500 }).withMessage('Reason is too long.')
];

const appointmentIdRules = [param('appointmentId').custom(objectId).withMessage('A valid appointment ID is required.')];

const availabilityRules = [
  body('date').matches(date).withMessage('Date must use YYYY-MM-DD format.'),
  body('startTime').matches(time).withMessage('Start time must use HH:mm format.'),
  body('endTime').matches(time).withMessage('End time must use HH:mm format.')
];

const availabilityIdRules = [param('availabilityId').custom(objectId).withMessage('A valid availability ID is required.')];

module.exports = { appointmentRules, appointmentIdRules, availabilityRules, availabilityIdRules };
