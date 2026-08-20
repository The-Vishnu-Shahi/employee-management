const designationModel = require('../models/designationModel');

async function list(req, res) {
  res.json(await designationModel.findAll());
}

async function create(req, res) {
  const designation = await designationModel.create(req.body.title);
  res.status(201).json(designation);
}

async function update(req, res) {
  const existing = await designationModel.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Designation not found' });

  const designation = await designationModel.update(req.params.id, req.body.title);
  res.json(designation);
}

async function remove(req, res) {
  const deleted = await designationModel.remove(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Designation not found' });
  res.status(204).send();
}

module.exports = { list, create, update, remove };