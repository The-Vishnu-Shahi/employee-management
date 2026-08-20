const pool = require('../config/db');

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM departments ORDER BY name');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM departments WHERE id = ?', [id]);
  return rows[0];
}

async function create(name) {
  const [result] = await pool.query('INSERT INTO departments (name) VALUES (?)', [name]);
  return findById(result.insertId);
}

async function update(id, name) {
  await pool.query('UPDATE departments SET name = ? WHERE id = ?', [name, id]);
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM departments WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };