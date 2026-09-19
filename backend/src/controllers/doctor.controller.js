const service = require('../services/doctor.service');
const { success, failure } = require('../utils/response');

const list = async (req, res, next) => { try { return success(res, 200, 'Doctors retrieved.', await service.findDoctors(req.query)); } catch (e) { next(e); } };
const profile = async (req, res, next) => { try { const doctor = await service.getDoctor(req.params.doctorId); return doctor ? success(res, 200, 'Doctor retrieved.', doctor) : failure(res, 404, 'Doctor not found.'); } catch (e) { next(e); } };
const availability = async (req, res, next) => { try { return success(res, 200, 'Availability retrieved.', await service.getAvailability(req.params.doctorId, req.query.date)); } catch (e) { next(e); } };
const myAvailability = async (req, res, next) => { try { return success(res, 200, 'Availability retrieved.', await service.getAvailability(req.user.userId, req.query.date)); } catch (e) { next(e); } };
const addAvailability = async (req, res, next) => { try { return success(res, 201, 'Availability created.', await service.createAvailability(req.user.userId, req.body)); } catch (e) { next(e); } };
const editAvailability = async (req, res, next) => { try { return success(res, 200, 'Availability updated.', await service.updateAvailability(req.user.userId, req.params.availabilityId, req.body)); } catch (e) { next(e); } };
const removeAvailability = async (req, res, next) => { try { await service.deleteAvailability(req.user.userId, req.params.availabilityId); return success(res, 200, 'Availability deleted.'); } catch (e) { next(e); } };
const editProfile = async (req, res, next) => { try { return success(res, 200, 'Profile updated.', await service.updateProfile(req.user.userId, req.body)); } catch (e) { next(e); } };
const appointments = async (req, res, next) => { try { return success(res, 200, 'Appointments retrieved.', await service.getDoctorAppointments(req.user.userId, req.query)); } catch (e) { next(e); } };

module.exports = { list, profile, availability, myAvailability, addAvailability, editAvailability, removeAvailability, editProfile, appointments };
