const service = require('../services/appointment.service');
const { success, failure } = require('../utils/response');

const book = async (req, res, next) => { try { return success(res, 201, 'Appointment booked successfully.', await service.createAppointment(req.user.userId, req.body)); } catch (e) { next(e); } };
const mine = async (req, res, next) => { try { return success(res, 200, 'Appointments retrieved.', await service.getPatientAppointments(req.user.userId)); } catch (e) { next(e); } };
const details = async (req, res, next) => { try { const appointment = await service.getAppointment(req.params.appointmentId); if (!appointment) return failure(res, 404, 'Appointment not found.'); const owns = [appointment.patientId._id.toString(), appointment.doctorId._id.toString()].includes(req.user.userId); if (!owns) return failure(res, 403, 'You cannot access this appointment.'); return success(res, 200, 'Appointment retrieved.', appointment); } catch (e) { next(e); } };
const cancel = async (req, res, next) => { try { return success(res, 200, 'Appointment cancelled.', await service.cancelAppointment(req.params.appointmentId, req.user.userId, req.user.role, req.body.reason)); } catch (e) { next(e); } };
module.exports = { book, mine, details, cancel };
