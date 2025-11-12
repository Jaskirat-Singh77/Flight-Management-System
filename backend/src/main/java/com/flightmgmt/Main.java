package com.flightmgmt; // <-- Using your package name

import com.flightmgmt.config.CORSFilter;
import com.flightmgmt.servlet.AdminServlet;
import com.flightmgmt.servlet.BookingServlet;
import com.flightmgmt.servlet.FlightServlet;
import jakarta.servlet.DispatcherType; // <-- Make sure imports are jakarta
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

import java.util.EnumSet;

public class Main {

    public static void main(String[] args) throws Exception {
        // Create a Jetty server on port 8080
        Server server = new Server(8080);

        // Create a context handler
        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");

        // === This replaces your web.xml ===

        // 1. Add the CORSFilter
        context.addFilter(CORSFilter.class, "/api/*", EnumSet.of(DispatcherType.REQUEST));

        // 2. Add the AdminServlet
        context.addServlet(new ServletHolder(new AdminServlet()), "/api/admin/*");

        // 3. Add the FlightServlet
        context.addServlet(new ServletHolder(new FlightServlet()), "/api/flights/*");

        // 4. Add the BookingServlet
        context.addServlet(new ServletHolder(new BookingServlet()), "/api/bookings/*");

        // === End of web.xml replacement ===

        // Set the context handler for the server
        server.setHandler(context);

        System.out.println("Starting Jetty Server on http://localhost:8080");

        // Start the server
        server.start();
        // Wait for the server to stop
        server.join();
    }
}