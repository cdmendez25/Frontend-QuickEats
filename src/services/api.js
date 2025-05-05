import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
};

// Servicios para restaurantes
export const restaurantService = {
  getAll: () => api.get('/restaurants'),
  getById: (id) => api.get(`/restaurants/${id}`),
  getDishes: (id) => api.get(`/restaurants/${id}/dishes`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`)
};

// Servicios para platos
export const dishService = {
  getAll: () => api.get('/dishes'),
  getByRestaurant: (restaurantId) => api.get(`/restaurants/${restaurantId}/dishes`),
  getById: (id) => api.get(`/dishes/${id}`),
  create: (data) => api.post('/dishes', data),
  update: (id, data) => api.put(`/dishes/${id}`, data),
  delete: (id) => api.delete(`/dishes/${id}`)
};

// Servicios para órdenes
export const orderService = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  cancel: (id) => api.put(`/orders/${id}/cancel`, {}),
  delete: (id) => api.delete(`/orders/${id}`)
};

// Servicios para el carrito
export const cartService = {
  addItem: (item) => api.post('/cart', item),
  getItems: () => api.get('/cart'),
  removeItem: (id) => api.delete(`/cart/${id}`),
  checkout: (data) => api.post('/orders', data)
};

export default api;