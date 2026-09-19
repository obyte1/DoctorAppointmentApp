require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool, connectDatabase } = require('./config/db');

const seed = async () => {
  await connectDatabase();
  await pool.query('TRUNCATE appointments, availability, users CASCADE');
  const password = await bcrypt.hash('Password123', 12);
  const users = await pool.query(`
    INSERT INTO users (name, email, password, role, specialization, license_number, bio)
    VALUES
      ('Dr. Sarah Johnson', 'sarah@example.com', $1, 'doctor', 'Cardiologist', 'MED123456', 'Experienced cardiologist.'),
      ('Dr. Michael Brown', 'michael@example.com', $1, 'doctor', 'Dermatologist', 'MED123457', NULL),
      ('Dr. Emily Williams', 'emily@example.com', $1, 'doctor', 'General Practitioner', 'MED123458', NULL),
      ('John Doe', 'john@example.com', $1, 'patient', NULL, NULL, NULL)
    RETURNING id, email
  `, [password]);
  const sarah = users.rows.find((user) => user.email === 'sarah@example.com');
  const michael = users.rows.find((user) => user.email === 'michael@example.com');
  const emily = users.rows.find((user) => user.email === 'emily@example.com');
  await pool.query(`
    INSERT INTO availability (doctor_id, date, start_time, end_time)
    VALUES ($1, '2026-10-05', '09:00', '12:00'), ($1, '2026-10-05', '14:00', '17:00'),
           ($2, '2026-10-06', '10:00', '16:00'), ($3, '2026-10-07', '08:00', '12:00')
  `, [sarah.id, michael.id, emily.id]);
  console.log('Seeded sample doctors, patient, and availability. Password: Password123');
};

seed().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => pool.end());
