package com.flightmgmt.dao;

import com.flightmgmt.config.DBConnection;
import com.flightmgmt.model.Flight;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FlightDAO {

    /**
     * Helper method to map a ResultSet row to a Flight object
     */
    private Flight mapResultSetToFlight(ResultSet rs) throws SQLException {
        Flight flight = new Flight();
        flight.setFlightId(rs.getInt("flight_id"));
        flight.setFlightNumber(rs.getString("flight_number"));
        flight.setSource(rs.getString("source"));
        flight.setDestination(rs.getString("destination"));
        flight.setDepartureTime(rs.getTimestamp("departure_time"));
        flight.setArrivalTime(rs.getTimestamp("arrival_time"));
        flight.setPrice(rs.getDouble("price"));
        flight.setTotalSeats(rs.getInt("total_seats"));
        flight.setAvailableSeats(rs.getInt("available_seats"));
        return flight;
    }

    public List<Flight> getAllFlights() throws SQLException {
        List<Flight> flights = new ArrayList<>();
        String sql = "SELECT * FROM flight ORDER BY departure_time";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                flights.add(mapResultSetToFlight(rs));
            }
        }
        return flights;
    }

    public List<Flight> searchFlights(String source, String destination, String date) throws SQLException {
        List<Flight> flights = new ArrayList<>();
        // Use DATE() function to compare only the date part of the DATETIME column
        String sql = "SELECT * FROM flight WHERE source = ? AND destination = ? AND DATE(departure_time) = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, source);
            ps.setString(2, destination);
            ps.setString(3, date); // JDBC driver handles date string conversion
            
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    flights.add(mapResultSetToFlight(rs));
                }
            }
        }
        return flights;
    }

    public void addFlight(Flight flight) throws SQLException {
        String sql = "INSERT INTO flight (flight_number, source, destination, departure_time, arrival_time, price, total_seats, available_seats) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, flight.getFlightNumber());
            ps.setString(2, flight.getSource());
            ps.setString(3, flight.getDestination());
            ps.setTimestamp(4, flight.getDepartureTime());
            ps.setTimestamp(5, flight.getArrivalTime());
            ps.setDouble(6, flight.getPrice());
            ps.setInt(7, flight.getTotalSeats());
            ps.setInt(8, flight.getAvailableSeats()); // Often same as total_seats on creation
            ps.executeUpdate();
        }
    }

    public void updateFlight(Flight flight) throws SQLException {
        String sql = "UPDATE flight SET flight_number = ?, source = ?, destination = ?, departure_time = ?, arrival_time = ?, price = ?, total_seats = ?, available_seats = ? WHERE flight_id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, flight.getFlightNumber());
            ps.setString(2, flight.getSource());
            ps.setString(3, flight.getDestination());
            ps.setTimestamp(4, flight.getDepartureTime());
            ps.setTimestamp(5, flight.getArrivalTime());
            ps.setDouble(6, flight.getPrice());
            ps.setInt(7, flight.getTotalSeats());
            ps.setInt(8, flight.getAvailableSeats());
            ps.setInt(9, flight.getFlightId());
            ps.executeUpdate();
        }
    }

    public void deleteFlight(int flightId) throws SQLException {
        String sql = "DELETE FROM flight WHERE flight_id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, flightId);
            ps.executeUpdate();
        }
    }
}