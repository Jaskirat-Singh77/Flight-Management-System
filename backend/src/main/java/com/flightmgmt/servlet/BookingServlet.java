package com.flightmgmt.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

import com.flightmgmt.dao.BookingDAO;
import com.flightmgmt.model.Booking;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class BookingServlet extends HttpServlet {
    private BookingDAO bookingDAO;
    private Gson gson;

    @Override
    public void init() {
        bookingDAO = new BookingDAO();
        // Use the same date format for consistency
        gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").create();
    }

    /**
     * Handles:
     * 1. GET /api/bookings (Get all bookings - for Admin)
     * 2. GET /api/bookings?userName=... (Get user's bookings - for User)
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        
        try {
            String userName = req.getParameter("userName");
            List<Booking> bookings;

            if (userName != null) {
                // Get bookings for a specific user
                bookings = bookingDAO.getBookingsByUserName(userName);
            } else {
                // Get all bookings (for admin)
                bookings = bookingDAO.getAllBookings();
            }
            out.print(gson.toJson(bookings));
        } catch (SQLException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\": false, \"message\":\"Database error: " + e.getMessage() + "\"}");
        }
        out.flush();
    }

    /**
     * Handles: POST /api/bookings (Create a new booking)
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String body = req.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        Booking booking = gson.fromJson(body, Booking.class);

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        // The DAO method handles the transaction and returns true/false
        boolean success = bookingDAO.createBooking(booking);

        if (success) {
            resp.setStatus(HttpServletResponse.SC_CREATED);
            out.print("{\"success\":true, \"message\":\"Booking successful\"}");
        } else {
            // 409 Conflict is a good status for "request conflicts with server state"
            // e.g., trying to book more seats than are available.
            resp.setStatus(HttpServletResponse.SC_CONFLICT); 
            out.print("{\"success\":false, \"message\":\"Booking failed. Not enough seats or flight not found.\"}");
        }
        out.flush();
    }

    /**
     * Handles: DELETE /api/bookings/{id} (Cancel a booking)
     */
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        
        try {
            // Get the ID from the path: /api/bookings/5 -> pathInfo is "/5"
            String pathInfo = req.getPathInfo();
            if (pathInfo == null || pathInfo.equals("/")) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"success\":false, \"message\":\"Booking ID required\"}");
                out.flush();
                return;
            }

            int bookingId = Integer.parseInt(pathInfo.substring(1));
            
            // The DAO method handles the transaction and returns true/false
            boolean success = bookingDAO.cancelBooking(bookingId);

            if (success) {
                out.print("{\"success\":true, \"message\":\"Booking cancelled successfully\"}");
            } else {
                // 404 Not Found is appropriate if the bookingId didn't exist
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print("{\"success\":false, \"message\":\"Cancellation failed. Booking not found.\"}");
            }
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"success\":false, \"message\":\"Invalid Booking ID format\"}");
        }
        out.flush();
    }
}