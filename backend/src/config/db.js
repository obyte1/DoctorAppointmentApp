const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const connectDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(120) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL, password TEXT NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'doctor')),
        phone VARCHAR(40), specialization VARCHAR(120), license_number VARCHAR(120),
        bio TEXT, profile_image TEXT, is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS availability (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL, start_time TIME NOT NULL, end_time TIME NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CHECK (start_time < end_time)
      );
      CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), patient_id UUID NOT NULL REFERENCES users(id),
        doctor_id UUID NOT NULL REFERENCES users(id), appointment_date DATE NOT NULL,
        start_time TIME NOT NULL, end_time TIME NOT NULL, reason TEXT, status VARCHAR(20) NOT NULL DEFAULT 'booked'
          CHECK (status IN ('booked', 'cancelled', 'completed')), notes TEXT,
        cancelled_by VARCHAR(20) CHECK (cancelled_by IN ('patient', 'doctor')),
        cancellation_reason TEXT, cancelled_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CHECK (start_time < end_time)
      );
      CREATE INDEX IF NOT EXISTS availability_doctor_date_idx ON availability (doctor_id, date);
      CREATE INDEX IF NOT EXISTS appointments_doctor_date_idx ON appointments (doctor_id, appointment_date);
      CREATE INDEX IF NOT EXISTS appointments_patient_date_idx ON appointments (patient_id, appointment_date);
    `);
    console.log('PostgreSQL connected and schema ready.');
  } finally {
    client.release();
  }
};

module.exports = { pool, connectDatabase };
