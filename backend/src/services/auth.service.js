const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { createToken } = require('../utils/jwt');

const publicUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const register = async (payload) => {
  const { name, email, password, role, phone, specialization, licenseNumber, bio, profileImage } = payload;
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, phone, specialization, license_number, bio, profile_image)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING id, name, email, role, phone, specialization, license_number AS "licenseNumber", bio, profile_image AS "profileImage", is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt"`,
    [name, email, passwordHash, role, phone || null, specialization || null, licenseNumber || null, bio || null, profileImage || null]
  );
  const user = result.rows[0];
  return { user, token: createToken({ _id: user.id, role: user.role, email: user.email }) };
};

const login = async (email, password) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1 AND is_active = TRUE', [email]);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) throw Object.assign(new Error('Invalid email or password.'), { statusCode: 401 });
  const safeUser = { ...user, licenseNumber: user.license_number, profileImage: user.profile_image, isActive: user.is_active, createdAt: user.created_at, updatedAt: user.updated_at };
  delete safeUser.license_number; delete safeUser.profile_image; delete safeUser.is_active; delete safeUser.created_at; delete safeUser.updated_at;
  return { user: publicUser(safeUser), token: createToken({ _id: user.id, role: user.role, email: user.email }) };
};

module.exports = { register, login, publicUser };
