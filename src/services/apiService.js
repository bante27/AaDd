import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const apiService = {
  // Assets
  getAssets: async () => {
    const response = await api.get('/assets');
    return response.data;
  },
  getAssetById: async (id) => {
    const response = await api.get(`/assets/${id}`);
    return response.data;
  },

  // Courses
  getCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },
  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Portfolios
  getPortfolios: async () => {
    const response = await api.get('/portfolios');
    return response.data;
  },

  // Editing Services
  getEditingServices: async () => {
    const response = await api.get('/editing');
    return response.data;
  },

  // Home Video / Content
  getHomeContent: async () => {
    const response = await api.get('/home');
    return response.data;
  },

  // Inquiries / Contact / Newsletter
  submitInquiry: async (data) => {
    const response = await api.post('/inquiries', data);
    return response.data;
  },
  subscribeNewsletter: async (email) => {
    const response = await api.post('/newsletter', { email });
    return response.data;
  },

  // Payments
  createPaymentIntent: async (data) => {
    const response = await api.post('/payments/create-intent', data);
    return response.data;
  },
};

export default apiService;
