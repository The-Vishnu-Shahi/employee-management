const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// NOTE: left open (no auth) so there's a way to create the very first account.
// Once you have an admin user, move this behind verifyToken + authorizeRoles('admin').
async function register(req, res) {
  const { username, password, role, employeeId } = req.body;

  const existing = await userModel.findByUsername(username);
  if (existing) {
    return res.status(409).json({ message: 'Username already taken' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.create({ username, passwordHash, role, employeeId });

  res.status(201).json({ message: 'User registered', user });
}

async function login(req, res) {
  const { username, password } = req.body;

  const user = await userModel.findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, employeeId: user.employee_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
}

module.exports = { register, login };