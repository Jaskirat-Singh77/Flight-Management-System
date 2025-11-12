import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import FlightSearch from './components/FlightSearch';
import MyBookings from './components/MyBookings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* Header is the navigation bar, present on all pages */}
      <Header />
      
      <main style={{ padding: '1rem' }}>
        <Routes>
          {/* The home page is the flight search */}
          <Route path="/" element={<FlightSearch />} />
          
          {/* The "My Bookings" page */}
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;