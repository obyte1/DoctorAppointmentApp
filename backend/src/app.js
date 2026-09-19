const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/auth.routes');
const doctorRoutes = require('./routes/doctor.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const doctorAppointmentRoutes = require('./routes/doctorAppointment.routes');
const swaggerDocument = require('./config/swagger');
const { notFound, errorHandler } = require('./middleware/error.middleware');
const { success } = require('./utils/response');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  success(res, 200, 'API is healthy.', { service: 'doctor-appointment-api' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctor/appointments', doctorAppointmentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
