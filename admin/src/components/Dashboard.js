import React, { useState, useEffect } from 'react';
import { getAllBookings, getAllFlights } from '../services/api';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

// A simple card for showing key numbers
function KpiCard({ title, value, color }) {
  return (
    <Card sx={{ minHeight: 120 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ color: color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const flightsRes = await getAllFlights();
        const bookingsRes = await getAllBookings();
        setFlights(flightsRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchData();
  }, []);

  // --- Data Processing for Charts ---

  // 1. Calculate KPIs
  const totalRevenue = bookings
    .reduce((acc, booking) => acc + (booking.flight.price * booking.seatsBooked), 0)
    .toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  const totalBookings = bookings.length;
  const totalFlights = flights.length;

  // 2. Process data for "Bookings per Day" chart
  const bookingsByDay = bookings.reduce((acc, booking) => {
    const date = new Date(booking.bookingDate).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const bookingsChartData = Object.keys(bookingsByDay)
    .map((date) => ({
      date,
      bookings: bookingsByDay[date],
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // 3. Process data for "Flight Occupancy" chart
  const occupancyData = flights.map((flight) => ({
    name: flight.flightNumber,
    Occupancy: ((flight.totalSeats - flight.availableSeats) / flight.totalSeats) * 100,
  }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Airline Dashboard
      </Typography>
      
      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <KpiCard title="Total Revenue" value={totalRevenue} color="#4caf50" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KpiCard title="Total Bookings" value={totalBookings} color="#2196f3" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KpiCard title="Active Flights" value={totalFlights} color="#f44336" />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bookings per Day
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bookingsChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bookings" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Flight Occupancy (%)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={occupancyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="Occupancy" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;