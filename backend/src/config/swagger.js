module.exports = {
  openapi: '3.0.0',
  info: { title: 'Doctor Appointment API', version: '1.0.0', description: 'Backend-only appointment management API.' },
  servers: [{ url: 'http://localhost:5000' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } }
  },
  paths: {
    '/api/health': { get: { summary: 'Health check', responses: { 200: { description: 'Healthy' } } } },
    '/api/auth/register': { post: { summary: 'Register a patient or doctor', responses: { 201: { description: 'Registered' }, 400: { description: 'Validation error' } } } },
    '/api/auth/login': { post: { summary: 'Login and receive a JWT', responses: { 200: { description: 'Logged in' }, 401: { description: 'Invalid credentials' } } } },
    '/api/doctors': { get: { summary: 'Find active doctors', parameters: [{ name: 'name', in: 'query', schema: { type: 'string' } }, { name: 'specialization', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'Doctors' } } } },
    '/api/doctors/{doctorId}/availability': { get: { summary: 'View doctor availability', parameters: [{ name: 'doctorId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Availability periods' } } } },
    '/api/appointments': { post: { summary: 'Book an appointment', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Booked' }, 409: { description: 'Conflict' } } } },
    '/api/appointments/my': { get: { summary: 'View patient appointments', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Appointments' } } } },
    '/api/doctor/appointments': { get: { summary: 'View doctor appointments', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Appointments' } } } }
  }
};
