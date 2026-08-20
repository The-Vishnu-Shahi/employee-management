import api from './api';

export async function listEmployees(params = {}) {
  const { data } = await api.get('/employees', { params });
  return data; // { data: [...], pagination: {...} }
}

export async function getEmployee(id) {
  const { data } = await api.get(`/employees/${id}`);
  return data;
}

export async function createEmployee(payload) {
  const { data } = await api.post('/employees', payload);
  return data;
}

export async function updateEmployee(id, payload) {
  const { data } = await api.put(`/employees/${id}`, payload);
  return data;
}

export async function deleteEmployee(id) {
  await api.delete(`/employees/${id}`);
}