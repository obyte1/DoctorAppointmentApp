const { pool } = require('../config/db');
const { publicUser } = require('./auth.service');

const serviceError = (message, statusCode = 400) => Object.assign(new Error(message), { statusCode });
const userColumns = `id, name, email, role, phone, specialization, license_number AS "licenseNumber", bio, profile_image AS "profileImage", is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt"`;

const findDoctors = async (query) => {
  const values = [];
  const filters = ["role = 'doctor'", 'is_active = TRUE'];
  if (query.specialization) { values.push(`%${query.specialization}%`); filters.push(`specialization ILIKE $${values.length}`); }
  if (query.name) { values.push(`%${query.name}%`); filters.push(`name ILIKE $${values.length}`); }
  const result = await pool.query(`SELECT ${userColumns} FROM users WHERE ${filters.join(' AND ')} ORDER BY name`, values);
  return result.rows;
};

const getDoctor = async (doctorId) => {
  const result = await pool.query(`SELECT ${userColumns} FROM users WHERE id = $1 AND role = 'doctor' AND is_active = TRUE`, [doctorId]);
  return result.rows[0] || null;
};

const getAvailability = async (doctorId, date) => {
  const values = [doctorId];
  const dateFilter = date ? (values.push(date), ` AND date = $${values.length}`) : '';
  const result = await pool.query(`SELECT id, doctor_id AS "doctorId", date, TO_CHAR(start_time, 'HH24:MI') AS "startTime", TO_CHAR(end_time, 'HH24:MI') AS "endTime" FROM availability WHERE doctor_id = $1${dateFilter} ORDER BY date, start_time`, values);
  return result.rows;
};

const createAvailability = async (doctorId, payload) => {
  if (payload.startTime >= payload.endTime) throw serviceError('Availability end time must be after start time.');
  const overlap = await pool.query('SELECT id FROM availability WHERE doctor_id = $1 AND date = $2 AND start_time < $4 AND end_time > $3', [doctorId, payload.date, payload.startTime, payload.endTime]);
  if (overlap.rowCount) throw serviceError('Availability periods cannot overlap.', 409);
  const result = await pool.query(`INSERT INTO availability (doctor_id, date, start_time, end_time) VALUES ($1,$2,$3,$4) RETURNING id, doctor_id AS "doctorId", date, TO_CHAR(start_time, 'HH24:MI') AS "startTime", TO_CHAR(end_time, 'HH24:MI') AS "endTime"`, [doctorId, payload.date, payload.startTime, payload.endTime]);
  return result.rows[0];
};

const updateAvailability = async (doctorId, availabilityId, payload) => {
  if (payload.startTime >= payload.endTime) throw serviceError('Availability end time must be after start time.');
  const result = await pool.query(`UPDATE availability SET date = $1, start_time = $2, end_time = $3, updated_at = NOW() WHERE id = $4 AND doctor_id = $5 RETURNING id, doctor_id AS "doctorId", date, TO_CHAR(start_time, 'HH24:MI') AS "startTime", TO_CHAR(end_time, 'HH24:MI') AS "endTime"`, [payload.date, payload.startTime, payload.endTime, availabilityId, doctorId]);
  if (!result.rowCount) throw serviceError('Availability not found.', 404);
  return result.rows[0];
};

const deleteAvailability = async (doctorId, availabilityId) => {
  const result = await pool.query('DELETE FROM availability WHERE id = $1 AND doctor_id = $2 RETURNING id', [availabilityId, doctorId]);
  if (!result.rowCount) throw serviceError('Availability not found.', 404);
};

const updateProfile = async (doctorId, payload) => {
  const result = await pool.query(`UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone), specialization = COALESCE($3, specialization), license_number = COALESCE($4, license_number), bio = COALESCE($5, bio), profile_image = COALESCE($6, profile_image), updated_at = NOW() WHERE id = $7 AND role = 'doctor' RETURNING ${userColumns}`, [payload.name, payload.phone, payload.specialization, payload.licenseNumber, payload.bio, payload.profileImage, doctorId]);
  if (!result.rowCount) throw serviceError('Doctor not found.', 404);
  return publicUser(result.rows[0]);
};

const getDoctorAppointments = async (doctorId, query) => {
  const values = [doctorId];
  const filters = ['a.doctor_id = $1'];
  if (query.date) { values.push(query.date); filters.push(`a.appointment_date = $${values.length}`); }
  if (query.status) { values.push(query.status); filters.push(`a.status = $${values.length}`); }
  const result = await pool.query(`SELECT a.*, u.name AS "patientName", u.email AS "patientEmail" FROM appointments a JOIN users u ON u.id = a.patient_id WHERE ${filters.join(' AND ')} ORDER BY a.appointment_date, a.start_time`, values);
  return result.rows;
};

module.exports = { findDoctors, getDoctor, getAvailability, createAvailability, updateAvailability, deleteAvailability, updateProfile, getDoctorAppointments };
