const employeeModel = require('../models/employeeModel');

async function list(req, res) {
  const { search, departmentId, designationId, status, page, limit } = req.query;
  const safeLimit = Number(limit) || 10;
  const safePage = Number(page) || 1;

  const { rows, total } = await employeeModel.findAll({
    search, departmentId, designationId, status, page: safePage, limit: safeLimit,
  });

  res.json({
    data: rows,
    pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) },
  });
}

async function getOne(req, res) {
  const employee = await employeeModel.findById(req.params.id);
  if (!employee) return res.status(404).json({ message: 'Employee not found' });
  res.json(employee);
}

async function create(req, res) {
  const employee = await employeeModel.create(req.body);
  res.status(201).json(employee);
}

async function update(req, res) {
  const existing = await employeeModel.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Employee not found' });

  const employee = await employeeModel.update(req.params.id, req.body);
  res.json(employee);
}

async function remove(req, res) {
  const deleted = await employeeModel.remove(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Employee not found' });
  res.status(204).send();
}

module.exports = { list, getOne, create, update, remove };