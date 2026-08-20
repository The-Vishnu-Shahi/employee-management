const departmentModel = require('../models/departmentModel');

async function list(req, res) {
  res.json(await departmentModel.findAll());
}

async function create(req, res) {
  const department = await departmentModel.create(req.body.name);
  res.status(201).json(department);
}

async function update(req, res) {
  const existing = await departmentModel.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Department not found' });

  const department = await departmentModel.update(req.params.id, req.body.name);
  res.json(department);
}

async function remove(req, res) {
  const deleted = await departmentModel.remove(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Department not found' });
  res.status(204).send();
}

module.exports = { list, create, update, remove };