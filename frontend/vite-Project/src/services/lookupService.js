import api from './api';

export const departmentService = {
  list: () => api.get('/departments').then((r) => r.data),
  create: (name) => api.post('/departments', { name }).then((r) => r.data),
  update: (id, name) => api.put(`/departments/${id}`, { name }).then((r) => r.data),
  remove: (id) => api.delete(`/departments/${id}`),
};

export const designationService = {
  list: () => api.get('/designations').then((r) => r.data),
  create: (title) => api.post('/designations', { title }).then((r) => r.data),
  update: (id, title) => api.put(`/designations/${id}`, { title }).then((r) => r.data),
  remove: (id) => api.delete(`/designations/${id}`),
};