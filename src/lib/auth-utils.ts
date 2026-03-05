import api from './api';

export async function submitLogin(data: { email: string; password: string }) {
  const res = await api.post('/auth/login', data);
  return res.data;
}

export async function submitForgot(data: { email: string }) {
  const res = await api.post('/auth/forgot-password', data);
  return res.data;
}

export async function submitReset(token: string, data: { password: string }) {
  const res = await api.post(`/auth/reset-password?token=${token}`, data);
  return res.data;
}

export async function submitRegister(data: { name: string; email: string; password: string; token?: string }) {
  const res = await api.post('/auth/register', data);
  return res.data;
}
