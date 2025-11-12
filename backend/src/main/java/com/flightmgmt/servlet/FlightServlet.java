package com.flightmgmt.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

import com.flightmgmt.dao.FlightDAO;
import com.flightmgmt.model.Flight;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class FlightServlet extends HttpServlet {
    private FlightDAO flightDAO;
    private Gson gson;

    @Override
    public void init() {
        flightDAO = new FlightDAO();
        // **Critical**: Configure Gson to handle SQL Timestamps correctly
        // This format (ISO 8601) is easily parsed by JavaScript new Date()
        gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").create();
    }

    /**
     * Handles:
     * 1. GET /api/flights (Get all flights)
     * 2. GET /api/flights?source=...&destination=...&date=... (Search flights)
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        
        try {
            String source = req.getParameter("source");
            String destination = req.getParameter("destination");
            String date = req.getParameter("date");

            List<Flight> flights;
            if (source != null && destination != null && date != null) {
                // Search for flights
                flights = flightDAO.searchFlights(source, destination, date);
            } else {
                // Get all flights
                flights = flightDAO.getAllFlights();
            }
            out.print(gson.toJson(flights));
        } catch (SQLException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\": false, \"message\":\"Database error: " + e.getMessage() + "\"}");
        }
        out.flush();
    }

    /**
     * Handles: POST /api/flights (Add new flight)
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String body = req.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        
        // Convert incoming JSON to a Flight object
        Flight flight = gson.fromJson(body, Flight.class);
        
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        
        try {
            flightDAO.addFlight(flight);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            out.print("{\"success\":true, \"message\":\"Flight added successfully\"}");
        } catch (SQLException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\":false, \"message\":\"Database error: " + e.getMessage() + "\"}");
        }
        out.flush();
    }

    /**
     * Handles: PUT /api/flights/{id} (Update existing flight)
     * Note: The React app will send the ID in the JSON body, so we use that.
     */
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String body = req.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        Flight flight = gson.fromJson(body, Flight.class);
        
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        try {
            flightDAO.updateFlight(flight);
            out.print("{\"success\":true, \"message\":\"Flight updated successfully\"}");
        } catch (SQLException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\":false, \"message\":\"Database error: " + e.getMessage() + "\"}");
        }
        out.flush();
    }

    /**
     * Handles: DELETE /api/flights/{id} (Delete a flight)
     */
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        
        try {
            // Get the ID from the path: /api/flights/12 -> pathInfo is "/12"
            String pathInfo = req.getPathInfo();
            if (pathInfo == null || pathInfo.equals("/")) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"success\":false, \"message\":\"Flight ID required\"}");
                out.flush();
                return;
            }
            
            // Get "12" from "/12"
            String flightIdStr = pathInfo.substring(1);
            int flightId = Integer.parseInt(flightIdStr);
            
            flightDAO.deleteFlight(flightId);
            out.print("{\"success\":true, \"message\":\"Flight deleted successfully\"}");
            
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"success\":false, \"message\":\"Invalid Flight ID format\"}");
        } catch (SQLException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\":false, \"message\":\"Database error: " + e.getMessage() + "\"}");
        }
        out.flush();
    }
}