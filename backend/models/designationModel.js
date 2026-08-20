const pool = require('../config/db');

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM designations ORDER BY title');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM designations WHERE id = ?', [id]);
  return rows[0];
}

async function create(title) {
  const [result] = await pool.query('INSERT INTO designations (title) VALUES (?)', [title]);
  return findById(result.insertId);
}

async function update(id, title) {
  await pool.query('UPDATE designations SET title = ? WHERE id = ?', [title, id]);
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM designations WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };