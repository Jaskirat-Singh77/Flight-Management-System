import axios from 'axios';

// 👇 THE ONLY CHANGE IS HERE
const API_URL = 'http://localhost:8080/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
});

// ... (rest of the file is the same) ...
// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin Auth
export const login = (username, password) => 
  api.post('/admin/login', { username, password });

// Flight Management
export const getAllFlights = () => api.get('/flights');
export const addFlight = (flightData) => api.post('/flights', flightData);
export const updateFlight = (flightData) => api.put(`/flights/${flightData.flightId}`, flightData);
export const deleteFlight = (flightId) => api.delete(`/flights/${flightId}`);

// Booking Management
export const getAllBookings = () => api.get('/bookings');

export default api;