const { pool } = require('../config/db');

const serviceError = (message, statusCode = 400) => Object.assign(new Error(message), { statusCode });
const toMinutes = (time) => { const [hours, minutes] = time.split(':').map(Number); return hours * 60 + minutes; };
const isPast = (date, time) => new Date(`${date}T${time}:00`) <= new Date();
const appointmentColumns = `a.id, a.patient_id AS "patientId", a.doctor_id AS "doctorId", a.appointment_date AS "appointmentDate", TO_CHAR(a.start_time, 'HH24:MI') AS "startTime", TO_CHAR(a.end_time, 'HH24:MI') AS "endTime", a.reason, a.status, a.notes, a.cancelled_by AS "cancelledBy", a.cancellation_reason AS "cancellationReason", a.cancelled_at AS "cancelledAt", a.created_at AS "createdAt", a.updated_at AS "updatedAt"`;

const createAppointment = async (patientId, payload) => {
  const { doctorId, appointmentDate, startTime, endTime } = payload;
  if (toMinutes(startTime) >= toMinutes(endTime)) throw serviceError('Appointment end time must be after start time.');
  if (isPast(appointmentDate, startTime)) throw serviceError('Appointment time must be in the future.');
  const doctor = await pool.query("SELECT id FROM users WHERE id = $1 AND role = 'doctor' AND is_active = TRUE", [doctorId]);
  if (!doctor.rowCount) throw serviceError('Doctor not found or inactive.', 404);
  const availability = await pool.query('SELECT id FROM availability WHERE doctor_id = $1 AND date = $2 AND start_time <= $3 AND end_time >= $4', [doctorId, appointmentDate, startTime, endTime]);
  if (!availability.rowCount) throw serviceError('Doctor is not available at the selected time.');
  const overlap = 'appointment_date = $2 AND status <> \'cancelled\' AND start_time < $4 AND end_time > $3';
  if ((await pool.query(`SELECT id FROM appointments WHERE doctor_id = $1 AND ${overlap} LIMIT 1`, [doctorId, appointmentDate, startTime, endTime])).rowCount) throw serviceError('Appointment time is already booked.', 409);
  if ((await pool.query(`SELECT id FROM appointments WHERE patient_id = $1 AND ${overlap} LIMIT 1`, [patientId, appointmentDate, startTime, endTime])).rowCount) throw serviceError('You already have an appointment at this time.', 409);
  const result = await pool.query(`INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, end_time, reason) VALUES ($1,$2,$3,$4,$5,$6) RETURNING ${appointmentColumns}`, [patientId, doctorId, appointmentDate, startTime, endTime, payload.reason || null]);
  return result.rows[0];
};

const getPatientAppointments = async (patientId) => {
  const result = await pool.query(`SELECT ${appointmentColumns}, u.name AS "doctorName", u.email AS "doctorEmail", u.specialization FROM appointments a JOIN users u ON u.id = a.doctor_id WHERE a.patient_id = $1 ORDER BY a.appointment_date DESC, a.start_time`, [patientId]);
  return result.rows;
};

const getAppointment = async (id) => {
  const result = await pool.query(`SELECT ${appointmentColumns}, p.name AS "patientName", p.email AS "patientEmail", d.name AS "doctorName", d.email AS "doctorEmail", d.specialization FROM appointments a JOIN users p ON p.id = a.patient_id JOIN users d ON d.id = a.doctor_id WHERE a.id = $1`, [id]);
  return result.rows[0] || null;
};

const cancelAppointment = async (id, userId, role, reason) => {
  const ownerColumn = role === 'doctor' ? 'doctor_id' : 'patient_id';
  const result = await pool.query(`UPDATE appointments SET status = 'cancelled', cancelled_by = $1, cancellation_reason = $2, cancelled_at = NOW(), updated_at = NOW() WHERE id = $3 AND ${ownerColumn} = $4 AND status <> 'cancelled' RETURNING ${appointmentColumns}`, [role, reason || 'No reason provided.', id, userId]);
  if (!result.rowCount) throw serviceError('Appointment not found or already cancelled.', 404);
  return result.rows[0];
};

module.exports = { toMinutes, createAppointment, getPatientAppointments, getAppointment, cancelAppointment };
