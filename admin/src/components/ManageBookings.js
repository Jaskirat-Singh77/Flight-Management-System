import React, { useState, useEffect } from 'react';
import { getAllBookings } from '../services/api';
import {
  Box,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await getAllBookings();
      // We can use the nested data directly, no flattening needed
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
    }
  };

  /**
   * Helper to safely format the SQL date string for display.
   * We replace the space with a 'T' to be safe.
   */
  const formatSqlDate = (sqlString) => {
    if (!sqlString) return 'N/A';
    return new Date(sqlString.replace(' ', 'T')).toLocaleString();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        All Bookings
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {/* --- This replaces the DataGrid --- */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="bookings table">
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Passenger</TableCell>
              <TableCell>Flight No.</TableCell>
              <TableCell>From-To</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>Booking Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow
                key={booking.bookingId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{booking.bookingId}</TableCell>
                <TableCell>{booking.userName}</TableCell>
                {/* Access nested flight data */}
                <TableCell>{booking.flight.flightNumber}</TableCell>
                <TableCell>{booking.flight.source} to {booking.flight.destination}</TableCell>
                <TableCell>{booking.seatsBooked}</TableCell>
                
                {/* Apply the date fix */}
                <TableCell>{formatSqlDate(booking.bookingDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* --- End of Table --- */}
    </Box>
  );
}

export default ManageBookings;