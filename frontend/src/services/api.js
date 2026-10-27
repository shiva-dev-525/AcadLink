import axios from 'axios';

/**
 * Centralized Axios HTTP Client
 * Uses proxy in local development (/api) or deployed backend in production
 */
const resolveBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL !== '/api') {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (import.meta.env.PROD) {
    return 'https://acad-link-pi.vercel.app/api';
  }
  return '/api';
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize error format and handle expired session
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized occurs on an authenticated endpoint, token is invalid/expired
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      const isAuthCheck = error.config?.url?.includes('/auth/me');
      if (isAuthCheck) {
        localStorage.removeItem('token');
      }
    }

    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

/**
 * Foundation Health Service
 */
export const healthService = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

/**
 * Phase 2 Authentication Service
 */
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default api;
