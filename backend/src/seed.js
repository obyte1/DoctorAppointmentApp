require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool, connectDatabase } = require('./config/db');

const seed = async () => {
  await connectDatabase();
  await pool.query('TRUNCATE appointments, availability, users CASCADE');
  const password = await bcrypt.hash('Password123', 12);
  const users = await pool.query(`
    
  const sarah = users.rows.find((user) => user.email === 'sarah@example.com');
  const michael = users.rows.find((user) => user.email === 'michael@example.com');
  const emily = users.rows.find((user) => user.email === 'emily@example.com');
  await

seed().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => pool.end());
