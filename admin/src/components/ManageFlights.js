import React, { useState, useEffect } from 'react';
import { getAllFlights, addFlight, updateFlight, deleteFlight } from '../services/api';
import {
  Button,
  Box,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlightFormModal from './FlightFormModal'; // We still use the modal

function ManageFlights() {
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    try {
      const response = await getAllFlights();
      setFlights(response.data); // No need to add 'id' anymore
    } catch (err) {
      setError('Failed to load flights');
    }
  };

  const handleOpenAdd = () => {
    setSelectedFlight(null);
    setOpenModal(true);
  };

  /**
   * This logic is still required for the <input> in the modal.
   * It formats "YYYY-MM-DD HH:mm:ss" to "YYYY-MM-DDTHH:mm"
   */
  const handleOpenEdit = (flight) => {
    const formatSqlForInput = (sqlString) => {
      if (!sqlString) return '';
      return sqlString.replace(' ', 'T').slice(0, 16);
    };

    const formattedFlight = {
        ...flight,
        departureTime: formatSqlForInput(flight.departureTime),
        arrivalTime: formatSqlForInput(flight.arrivalTime),
    };
    
    setSelectedFlight(formattedFlight);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFlight(null);
  };

  /**
   * This logic is also still required to save data from the modal.
   */
  const handleSave = async (flight) => {
    try {
      const flightData = {
          ...flight,
          departureTime: new Date(flight.departureTime).toISOString(),
          arrivalTime: new Date(flight.arrivalTime).toISOString(),
          price: parseFloat(flight.price),
          totalSeats: parseInt(flight.totalSeats),
          availableSeats: parseInt(flight.availableSeats),
      };
      
      if (flight.flightId) {
        await updateFlight(flightData);
      } else {
        await addFlight(flightData);
      }
      loadFlights();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save flight');
    }
  };

  const handleDelete = async (flightId) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      try {
        await deleteFlight(flightId);
        loadFlights();
      } catch (err) {
        setError('Failed to delete flight');
      }
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
        Manage Flights
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenAdd}
        sx={{ mb: 2 }}
      >
        Add New Flight
      </Button>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {/* --- This replaces the DataGrid --- */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Flight No.</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Departure</TableCell>
              <TableCell>Arrival</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((flight) => (
              <TableRow
                key={flight.flightId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{flight.flightNumber}</TableCell>
                <TableCell>{flight.source}</TableCell>
                <TableCell>{flight.destination}</TableCell>
                {/* We use the simple display method, just like MyBookings.js */}
                <TableCell>{formatSqlDate(flight.departureTime)}</TableCell>
                <TableCell>{formatSqlDate(flight.arrivalTime)}</TableCell>
                <TableCell>{flight.price}</TableCell>
                <TableCell>{flight.availableSeats}</TableCell>
                <TableCell>{flight.totalSeats}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEdit(flight)} aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(flight.flightId)} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* --- End of Table --- */}

      <FlightFormModal
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        flight={selectedFlight}
      />
    </Box>
  );
}

export default ManageFlights;