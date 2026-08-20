const pool = require('../config/db');

async function findByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT u.id, u.username, u.role, u.employee_id, e.first_name, e.last_name, e.email
     FROM users u
     LEFT JOIN employees e ON e.id = u.employee_id
     WHERE u.id = ?`,
    [id]
  );
  return rows[0];
}

async function create({ username, passwordHash, role, employeeId }) {
  const [result] = await pool.query(
    'INSERT INTO users (username, password_hash, role, employee_id) VALUES (?, ?, ?, ?)',
    [username, passwordHash, role || 'employee', employeeId || null]
  );
  return findById(result.insertId);
}

module.exports = { findByUsername, findById, create };