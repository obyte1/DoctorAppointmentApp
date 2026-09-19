# Doctor Appointment API

Backend-only REST API for patients and doctors, built with Node.js, Express, PostgreSQL, JWT, and bcrypt.

## Setup

1. Install PostgreSQL locally or provide a PostgreSQL connection string.
2. Install dependencies and create your environment file:

```bash
npm install
copy .env.example .env
```

3. Set a unique `JWT_SECRET` in `.env` and start the API:

```bash
npm run dev
```

The API runs on `http://localhost:5000`. Swagger is available at `http://localhost:5000/api-docs`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start with Nodemon |
| `npm start` | Start normally |
| `npm test` | Run Jest/Supertest tests |
| `npm run seed` | Reset and load sample doctors, patient, and availability |

## Authentication

Register at `POST /api/auth/register`, then login at `POST /api/auth/login`. Send the returned token on protected routes:

```http
Authorization: Bearer <token>
```

Patients can book and cancel their own appointments. Doctors can manage their profile and availability, view their appointments, and cancel appointments assigned to them.

## Main endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/doctors?specialization=Cardiologist&name=Sarah`
- `GET /api/doctors/:doctorId`
- `GET /api/doctors/:doctorId/availability`
- `POST /api/doctors/availability` (doctor)
- `PATCH /api/doctors/availability/:availabilityId` (doctor)
- `DELETE /api/doctors/availability/:availabilityId` (doctor)
- `POST /api/appointments` (patient)
- `GET /api/appointments/my` (patient)
- `GET /api/appointments/:appointmentId` (owner)
- `PATCH /api/appointments/:appointmentId/cancel` (owner)
- `GET /api/doctor/appointments` (doctor)
- `GET /api/doctor/appointments/:appointmentId` (doctor)
- `PATCH /api/doctor/appointments/:appointmentId/cancel` (doctor)

Booking validates doctor status, availability containment, future time, and overlapping active appointments for both doctor and patient. Cancellation preserves history and releases the slot.

PostgreSQL tables are created automatically on startup. Replace `DATABASE_URL` in `.env` with your real PostgreSQL connection string before running the app.

## Seed accounts

After `npm run seed`, the sample accounts use `Password123`:

- `sarah@example.com` - Cardiologist
- `michael@example.com` - Dermatologist
- `emily@example.com` - General Practitioner
- `john@example.com` - Patient
