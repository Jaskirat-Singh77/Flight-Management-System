package com.flightmgmt.dao;

import com.flightmgmt.config.DBConnection;
import com.flightmgmt.model.Booking;
import com.flightmgmt.model.Flight;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BookingDAO {

    /**
     * Helper to map a JOINED result set to a Booking object (with its Flight)
     */
    private Booking mapResultSetToBookingWithFlight(ResultSet rs) throws SQLException {
        // Map Booking fields
        Booking booking = new Booking();
        booking.setBookingId(rs.getInt("b.booking_id"));
        booking.setFlightId(rs.getInt("b.flight_id"));
        booking.setUserName(rs.getString("b.user_name"));
        booking.setSeatsBooked(rs.getInt("b.seats_booked"));
        booking.setBookingDate(rs.getTimestamp("b.booking_date"));

        // Map joined Flight fields
        Flight flight = new Flight();
        flight.setFlightId(rs.getInt("f.flight_id"));
        flight.setFlightNumber(rs.getString("f.flight_number"));
        flight.setSource(rs.getString("f.source"));
        flight.setDestination(rs.getString("f.destination"));
        flight.setDepartureTime(rs.getTimestamp("f.departure_time"));
        flight.setArrivalTime(rs.getTimestamp("f.arrival_time"));
        flight.setPrice(rs.getDouble("f.price"));
        flight.setTotalSeats(rs.getInt("f.total_seats"));
        flight.setAvailableSeats(rs.getInt("f.available_seats"));
        
        // Attach the flight object to the booking
        booking.setFlight(flight);
        return booking;
    }

    /**
     * Creates a booking in a transaction.
     * 1. Decrements available seats on the flight.
     * 2. Inserts the new booking record.
     * Rolls back if either step fails.
     */
    public boolean createBooking(Booking booking) {
        String sqlUpdateFlight = "UPDATE flight SET available_seats = available_seats - ? WHERE flight_id = ? AND available_seats >= ?";
        String sqlInsertBooking = "INSERT INTO booking (flight_id, user_name, seats_booked, booking_date) VALUES (?, ?, ?, NOW())";
        
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); // Start transaction

            // 1. Attempt to update flight seats
            try (PreparedStatement psFlight = conn.prepareStatement(sqlUpdateFlight)) {
                psFlight.setInt(1, booking.getSeatsBooked());
                psFlight.setInt(2, booking.getFlightId());
                psFlight.setInt(3, booking.getSeatsBooked());
                
                int rowsAffected = psFlight.executeUpdate();
                if (rowsAffected == 0) {
                    // No rows affected means not enough seats or flight doesn't exist
                    conn.rollback();
                    return false;
                }
            }

            // 2. Insert booking record
            try (PreparedStatement psBooking = conn.prepareStatement(sqlInsertBooking)) {
                psBooking.setInt(1, booking.getFlightId());
                psBooking.setString(2, booking.getUserName());
                psBooking.setInt(3, booking.getSeatsBooked());
                psBooking.executeUpdate();
            }

            conn.commit(); // Commit transaction
            return true;

        } catch (SQLException e) {
            e.printStackTrace();
            if (conn != null) {
                try {
                    conn.rollback(); // Rollback on error
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            return false;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * Cancels a booking in a transaction.
     * 1. Deletes the booking record.
     * 2. Increments available seats back to the flight.
     * Rolls back if either step fails.
     */
    public boolean cancelBooking(int bookingId) {
        String sqlSelectBooking = "SELECT flight_id, seats_booked FROM booking WHERE booking_id = ?";
        String sqlDeleteBooking = "DELETE FROM booking WHERE booking_id = ?";
        String sqlUpdateFlight = "UPDATE flight SET available_seats = available_seats + ? WHERE flight_id = ?";

        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); // Start transaction

            int flightId = 0;
            int seatsBooked = 0;

            // 1. Get booking details (flight_id and seats_booked) before deleting
            try (PreparedStatement psSelect = conn.prepareStatement(sqlSelectBooking)) {
                psSelect.setInt(1, bookingId);
                try (ResultSet rs = psSelect.executeQuery()) {
                    if (rs.next()) {
                        flightId = rs.getInt("flight_id");
                        seatsBooked = rs.getInt("seats_booked");
                    } else {
                        conn.rollback(); // Booking not found
                        return false;
                    }
                }
            }
            
            // 2. Delete the booking
            try (PreparedStatement psDelete = conn.prepareStatement(sqlDeleteBooking)) {
                psDelete.setInt(1, bookingId);
                int rowsAffected = psDelete.executeUpdate();
                 if (rowsAffected == 0) {
                    conn.rollback(); // Should not happen if select worked, but good practice
                    return false;
                }
            }

            // 3. Add seats back to flight
            try (PreparedStatement psUpdate = conn.prepareStatement(sqlUpdateFlight)) {
                psUpdate.setInt(1, seatsBooked);
                psUpdate.setInt(2, flightId);
                psUpdate.executeUpdate();
            }

            conn.commit(); // Commit transaction
            return true;

        } catch (SQLException e) {
            e.printStackTrace();
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            return false;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public List<Booking> getAllBookings() throws SQLException {
        List<Booking> bookings = new ArrayList<>();
        // JOIN to get flight details along with booking. Use aliases for clarity.
        String sql = "SELECT b.*, f.* FROM booking b JOIN flight f ON b.flight_id = f.flight_id ORDER BY b.booking_date DESC";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                bookings.add(mapResultSetToBookingWithFlight(rs));
            }
        }
        return bookings;
    }

    public List<Booking> getBookingsByUserName(String userName) throws SQLException {
        List<Booking> bookings = new ArrayList<>();
        String sql = "SELECT b.*, f.* FROM booking b JOIN flight f ON b.flight_id = f.flight_id WHERE b.user_name = ? ORDER BY b.booking_date DESC";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, userName);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    bookings.add(mapResultSetToBookingWithFlight(rs));
                }
            }
        }
        return bookings;
    }
}