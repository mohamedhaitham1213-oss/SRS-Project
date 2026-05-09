const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const SALT_ROUNDS = 10;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

const ALLOWED_ROLES = [
  'community_member',
  'facility_manager',
  'worker',
  'admin',
];

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES },
  );
}

/**
 * POST /api/auth/register
 * Body: { email, password, role? } — role defaults to community_member
 */
async function register(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const userRole = role || 'community_member';
    if (!ALLOWED_ROLES.includes(userRole)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const normalizedEmail = String(email).toLowerCase().trim();

    const result = await db.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, $3)
       RETURNING id, email, role`,
      [normalizedEmail, passwordHash, userRole],
    );

    const user = result.rows[0];
    const token = signToken(user);

    return res.status(201).json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    console.error('register error:', err);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const result = await db.query(
      `SELECT id, email, password_hash, role FROM users WHERE email = $1`,
      [normalizedEmail],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const row = result.rows[0];
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = { id: row.id, email: row.email, role: row.role };
    const token = signToken(user);

    return res.json({ token, user });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
}

/**
 * POST /api/auth/logout
 * JWT is stateless; client removes the token. This endpoint confirms session end.
 */
async function logout(req, res) {
  return res.json({ message: 'Logged out successfully.' });
}

module.exports = {
  register,
  login,
  logout,
};
