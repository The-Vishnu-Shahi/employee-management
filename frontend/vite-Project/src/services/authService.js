import api from './api';

export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password });
  localStorage.setItem('ems_token', data.token);
  localStorage.setItem('ems_user', JSON.stringify(data.user));
  return data.user;
}

export async function register(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export function logout() {
  localStorage.removeItem('ems_token');
  localStorage.removeItem('ems_user');
}

export function getStoredUser() {
  const raw = localStorage.getItem('ems_user');
  return raw ? JSON.parse(raw) : null;
}