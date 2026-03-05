import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('markai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('markai_token');
      localStorage.removeItem('markai_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Content API
export const contentAPI = {
  generate: (data) => api.post('/content/generate', data),
  getHistory: () => api.get('/content/history'),
  toggleFavorite: (id) => api.put(`/content/${id}/favorite`),
};

// Campaign API
export const campaignAPI = {
  create: (data) => api.post('/campaigns', data),
  getAll: () => api.get('/campaigns'),
  getById: (id) => api.get(`/campaigns/${id}`),
  updateStatus: (id, status) => api.put(`/campaigns/${id}/status`, { status }),
  delete: (id) => api.delete(`/campaigns/${id}`),
  getDashboard: () => api.get('/campaigns/dashboard'),
};

// Social Media API
export const socialAPI = {
  connectAccount: (data) => api.post('/social/accounts/connect', data),
  getAccounts: () => api.get('/social/accounts'),
  disconnectAccount: (id) => api.delete(`/social/accounts/${id}`),
  getAuthUrl: (platform) => api.get(`/social/auth-url/${platform}`),
  schedulePost: (data) => api.post('/social/schedule', data),
  bulkSchedule: (data) => api.post('/social/schedule/bulk', data),
  getQueue: () => api.get('/social/queue'),
  getPending: () => api.get('/social/queue/pending'),
  getQueueStats: () => api.get('/social/queue/stats'),
  cancelPost: (id) => api.put(`/social/queue/${id}/cancel`),
  reschedulePost: (id, scheduledAt) => api.put(`/social/queue/${id}/reschedule`, { scheduledAt }),
};

// Email Campaign API
export const emailAPI = {
  create: (data) => api.post('/email', data),
  getAll: () => api.get('/email'),
  getById: (id) => api.get(`/email/${id}`),
  send: (id) => api.post(`/email/${id}/send`),
  cancel: (id) => api.put(`/email/${id}/cancel`),
};

// A/B Testing API
export const abTestAPI = {
  create: (data) => api.post('/ab-tests', data),
  getAll: () => api.get('/ab-tests'),
  start: (id) => api.post(`/ab-tests/${id}/start`),
  getResults: (id) => api.get(`/ab-tests/${id}/results`),
  end: (id) => api.post(`/ab-tests/${id}/end`),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: (days = 30) => api.get(`/analytics/dashboard?days=${days}`),
};

// Billing API
export const billingAPI = {
  getPricing: (country = 'US') => api.get(`/billing/pricing?country=${country}`),
  getSubscription: () => api.get('/billing/subscription'),
  createCheckout: (data) => api.post('/billing/checkout', data),
  confirmPayment: (data) => api.post('/billing/confirm', data),
  cancelSubscription: () => api.post('/billing/cancel'),
  getUsage: () => api.get('/billing/usage'),
};

export default api;

