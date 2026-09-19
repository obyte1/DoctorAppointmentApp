process.env.JWT_SECRET = 'test-secret';
const request = require('supertest');
const app = require('../src/app');

test('GET /api/health returns the standard response shape', async () => {
  const response = await request(app).get('/api/health');
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(expect.objectContaining({ success: true, message: 'API is healthy.' }));
});

test('protected booking route rejects unauthenticated requests', async () => {
  const response = await request(app).post('/api/appointments').send({});
  expect(response.statusCode).toBe(401);
  expect(response.body.success).toBe(false);
});
