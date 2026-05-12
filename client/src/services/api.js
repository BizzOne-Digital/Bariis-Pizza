import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://bariis-pizza-api.vercel.app/api';

const api = axios.create({ baseURL: API_URL });

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bariis_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Menu
export const getMenuItems = (params) => api.get('/menu', { params });
export const getFeaturedItems = () => api.get('/menu/featured');
export const getMenuItem = (id) => api.get(`/menu/${id}`);
export const createMenuItem = (data) => api.post('/menu', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateMenuItem = (id, data) => api.put(`/menu/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteMenuItem = (id) => api.delete(`/menu/${id}`);
export const seedMenu = () => api.post('/menu/seed/default');

// Orders
export const placeOrder = (data) => api.post('/orders', data);
export const trackOrder = (id) => api.get(`/orders/track/${id}`);
export const getOrders = (params) => api.get('/orders', { params });
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status });
export const getOrderStats = () => api.get('/orders/stats/summary');

// Settings
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);

export default api;
