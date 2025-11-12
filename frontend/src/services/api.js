import axios from 'axios';

// This is the base URL of your Java backend
const API_URL = 'http://localhost:8080/api';

// Create a pre-configured axios instance
const api = axios.create({
  baseURL: API_URL,
});

/**
 * Searches for flights.
 * GET /api/flights?source=...&destination=...&date=...
 */
export const searchFlights = (source, destination, date) =>
  api.get(`/flights`, { params: { source, destination, date } });

/**
 * Books a flight.
 * POST /api/bookings
 */
export const bookFlight = (bookingData) => api.post('/bookings', bookingData);

/**
 * Gets bookings for a specific user.
 * GET /api/bookings?userName=...
 */
export const getMyBookings = (userName) =>
  api.get('/bookings', { params: { userName } });

/**
 * Cancels a booking by its ID.
 * DELETE /api/bookings/{id}
 */
export const cancelBooking = (bookingId) => api.delete(`/bookings/${bookingId}`);

export default api;