const pool = require('../config/db');

const UPDATABLE_FIELDS = [
  'first_name', 'last_name', 'email', 'phone',
  'department_id', 'designation_id', 'date_of_joining', 'salary', 'status',
];

async function findAll({ search, departmentId, designationId, status, page = 1, limit = 10 }) {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push('(e.first_name LIKE ? OR e.last_name LIKE ? OR e.email LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (departmentId) {
    conditions.push('e.department_id = ?');
    params.push(departmentId);
  }
  if (designationId) {
    conditions.push('e.designation_id = ?');
    params.push(designationId);
  }
  if (status) {
    conditions.push('e.status = ?');
    params.push(status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * limit;

  const [rows] = await pool.query(
    `SELECT e.*, d.name AS department_name, ds.title AS designation_title
     FROM employees e
     LEFT JOIN departments d ON d.id = e.department_id
     LEFT JOIN designations ds ON ds.id = e.designation_id
     ${whereClause}
     ORDER BY e.id DESC
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM employees e ${whereClause}`,
    params
  );

  return { rows, total: countRows[0].total };
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT e.*, d.name AS department_name, ds.title AS designation_title
     FROM employees e
     LEFT JOIN departments d ON d.id = e.department_id
     LEFT JOIN designations ds ON ds.id = e.designation_id
     WHERE e.id = ?`,
    [id]
  );
  return rows[0];
}

async function create(data) {
  const {
    first_name, last_name, email, phone,
    department_id, designation_id, date_of_joining, salary, status,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO employees
      (first_name, last_name, email, phone, department_id, designation_id, date_of_joining, salary, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      first_name, last_name || null, email, phone || null,
      department_id || null, designation_id || null,
      date_of_joining || null, salary || null, status || 'active',
    ]
  );

  return findById(result.insertId);
}

async function update(id, data) {
  const fields = [];
  const params = [];

  for (const key of UPDATABLE_FIELDS) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      params.push(data[key]);
    }
  }

  if (!fields.length) return findById(id);

  params.push(id);
  await pool.query(`UPDATE employees SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM employees WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };