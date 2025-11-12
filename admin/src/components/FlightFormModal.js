import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box
} from '@mui/material';

const emptyFlight = {
  flightNumber: '',
  source: '',
  destination: '',
  departureTime: '',
  arrivalTime: '',
  price: '',
  totalSeats: '',
  availableSeats: '',
};

function FlightFormModal({ open, onClose, onSave, flight }) {
  const [formData, setFormData] = useState(emptyFlight);

  useEffect(() => {
    setFormData(flight || emptyFlight);
  }, [flight, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Keep availableSeats same as totalSeats when adding new
      ...(name === 'totalSeats' && !flight ? { availableSeats: value } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{flight ? 'Edit Flight' : 'Add New Flight'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="flightNumber"
                label="Flight Number"
                value={formData.flightNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="source"
                label="Source"
                value={formData.source}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="destination"
                label="Destination"
                value={formData.destination}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="departureTime"
                label="Departure Time"
                type="datetime-local"
                value={formData.departureTime}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="arrivalTime"
                label="Arrival Time"
                type="datetime-local"
                value={formData.arrivalTime}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="totalSeats"
                label="Total Seats"
                type="number"
                value={formData.totalSeats}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="availableSeats"
                label="Available Seats"
                type="number"
                value={formData.availableSeats}
                onChange={handleChange}
                fullWidth
                required
                // Disable if it's a new flight
                disabled={!flight} 
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default FlightFormModal;