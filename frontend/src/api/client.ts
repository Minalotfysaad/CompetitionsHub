import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth_user');
  if (raw) {
    const user = JSON.parse(raw);
    if (user?.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
  }
  return config;
});

// Handle 401 Unauthorized responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
