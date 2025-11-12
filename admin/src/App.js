import React from 'react';
import {
  BrowserRouter, // <-- Will be used as the outer wrapper
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import AdminLayout from './components/AdminLayout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ManageFlights from './components/ManageFlights';
import ManageBookings from './components/ManageBookings';
import './App.css';

// Import MUI Theme components
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a professional dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

// Private Route wrapper
function PrivateRoute({ children }) {
  const auth = useAuth();
  return auth.isAuthenticated ? children : <Navigate to="/login" />;
}

// This is the component that will render all your routes
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        {/* Nested routes render inside AdminLayout's <Outlet /> */}
        <Route index element={<Dashboard />} />
        <Route path="flights" element={<ManageFlights />} />
        <Route path="bookings" element={<ManageBookings />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* 👇 BrowserRouter MUST be on the outside */}
      <BrowserRouter>
        {/* 👇 AuthProvider is now INSIDE the router */}
        <AuthProvider>
          {/* We render the routes here */}
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;