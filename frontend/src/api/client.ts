import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach userId to every request (temp until JWT)
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth_user');
  if (raw) {
    const user = JSON.parse(raw);
    if (user?.id) {
      config.headers['X-User-Id'] = user.id;
    }
  }
  return config;
});

export default api;
