import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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

// Auth endpoints
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getUser: () => api.get('/auth/user'),
};

// Aircraft endpoints
export const aircraftAPI = {
  getAll: () => api.get('/aircraft/'),
  getById: (id: number) => api.get(`/aircraft/${id}`),
  recommend: (routeId: number) => api.get(`/aircraft/recommend?route_id=${routeId}`),
  filter: (params: any) => api.get('/aircraft/filter', { params }),
};

// Routes endpoints
export const routesAPI = {
  getAll: () => api.get('/routes/'),
  getById: (id: number) => api.get(`/routes/${id}`),
  create: (data: any) => api.post('/routes/', data),
  update: (id: number, data: any) => api.put(`/routes/${id}`, data),
  delete: (id: number) => api.delete(`/routes/${id}`),
  recommend: (hub: string, aircraftId?: number) => {
    let url = `/routes/recommend?hub=${hub}`;
    if (aircraftId) {
      url += `&aircraft=${aircraftId}`;
    }
    return api.get(url);
  },
};

// Configuration endpoints
export const configAPI = {
  recommend: (aircraftId: number, routeId: number) => 
    api.get(`/config/recommend?aircraft=${aircraftId}&route=${routeId}`),
  optimize: (data: any) => api.post('/config/optimize', data),
};

export default api;
