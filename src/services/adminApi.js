import axios from 'axios';

const ADMIN_API = axios.create({ baseURL: 'http://localhost:5000/api' });

ADMIN_API.interceptors.request.use((config) => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo && userInfo !== 'undefined' && userInfo !== 'null') {
      const parsed = JSON.parse(userInfo);
      if (parsed && parsed.token && parsed.token !== 'undefined') {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
  } catch (e) {
    console.error('Error parsing userInfo token:', e);
  }
  return config;
});

// 1. Authentication & Payment
export const loginAdmin = (email, password) => ADMIN_API.post('/auth/login', { email, password });
export const simulatePaymentAdmin = (data) => ADMIN_API.post('/payments/simulate-success', data);

// 2. Courses (/api/courses)
export const getCoursesAdmin = () => ADMIN_API.get('/courses');
export const createCourseAdmin = (data) => ADMIN_API.post('/courses', data);
export const updateCourseAdmin = (id, data) => ADMIN_API.put(`/courses/${id}`, data);
export const deleteCourseAdmin = (id) => ADMIN_API.delete(`/courses/${id}`);

// 3. Editing Plans & Orders (/api/editing or /api/editing-plans)
export const getEditingPlansAdmin = () => {
  return ADMIN_API.get('/editing/plans?all=true').catch(() => ADMIN_API.get('/editing?all=true'));
};
export const createEditingPlanAdmin = (data) => {
  return ADMIN_API.post('/editing/plans', data).catch(() => ADMIN_API.post('/editing', data));
};
export const updateEditingPlanAdmin = (id, data) => {
  return ADMIN_API.put(`/editing/plans/${id}`, data).catch(() => ADMIN_API.put(`/editing/${id}`, data));
};
export const deleteEditingPlanAdmin = (id) => {
  return ADMIN_API.delete(`/editing/plans/${id}`).catch(() => ADMIN_API.delete(`/editing/${id}`));
};
export const getEditingOrdersAdmin = () => ADMIN_API.get('/editing/orders');
export const updateEditingOrderStatusAdmin = (id, status) => ADMIN_API.put(`/editing/orders/${id}/status`, { status });

// 4. Assets (/api/assets)
export const getAssetsAdmin = () => ADMIN_API.get('/assets');
export const createAssetAdmin = (data) => ADMIN_API.post('/assets', data);
export const updateAssetAdmin = (id, data) => ADMIN_API.put(`/assets/${id}`, data);
export const deleteAssetAdmin = (id) => ADMIN_API.delete(`/assets/${id}`);

// 5. Portfolio (/api/portfolio or /api/portfolios)
export const getPortfoliosAdmin = () => ADMIN_API.get('/portfolio').catch(() => ADMIN_API.get('/portfolios'));
export const createPortfolioAdmin = (data) => ADMIN_API.post('/portfolio', data).catch(() => ADMIN_API.post('/portfolios', data));
export const updatePortfolioAdmin = (id, data) => ADMIN_API.put(`/portfolio/${id}`, data).catch(() => ADMIN_API.put(`/portfolios/${id}`, data));
export const deletePortfolioAdmin = (id) => ADMIN_API.delete(`/portfolio/${id}`).catch(() => ADMIN_API.delete(`/portfolios/${id}`));

// 6. Home Video (/api/home-video)
export const createHomeVideoAdmin = (data) => ADMIN_API.post('/home-video', data);
export const updateHomeVideoAdmin = (data) => ADMIN_API.put('/home-video', data);

// 7. Contact Messages (/api/contact)
export const getContactMessagesAdmin = () => ADMIN_API.get('/contact');

// 8. Service Inquiries (/api/services/inquiries)
export const getServiceInquiriesAdmin = async () => {
  try {
    return await ADMIN_API.get('/services/inquiries');
  } catch {
    try {
      return await ADMIN_API.get('/inquiries');
    } catch {
      return await ADMIN_API.get('/service-inquiries');
    }
  }
};
export const replyServiceInquiryAdmin = async (id, data) => {
  try {
    return await ADMIN_API.post(`/services/inquiries/${id}/reply`, data);
  } catch (err1) {
    try {
      return await ADMIN_API.post(`/services/${id}/reply`, data);
    } catch (err2) {
      try {
        return await ADMIN_API.post(`/inquiries/${id}/reply`, data);
      } catch (err3) {
        return await ADMIN_API.post(`/service-inquiries/${id}/reply`, data);
      }
    }
  }
};

// 9. Newsletter (/api/newsletter)
export const getNewsletterSubscribersAdmin = () => ADMIN_API.get('/newsletter/subscribers');
export const sendNewsletterBroadcastAdmin = (data) => ADMIN_API.post('/newsletter/broadcast', data);

// 10. Platform Stats (/api/stats)
export const getPlatformStatsAdmin = () => ADMIN_API.get('/stats');

