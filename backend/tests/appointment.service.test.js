const { toMinutes } = require('../src/services/appointment.service');

test('appointment times convert to minutes for overlap comparisons', () => {
  expect(toMinutes('09:30')).toBe(570);
  expect(toMinutes('17:00')).toBe(1020);
});
