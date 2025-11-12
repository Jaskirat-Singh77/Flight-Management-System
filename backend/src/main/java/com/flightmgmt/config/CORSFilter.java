package com.flightmgmt.config;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CORSFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialization code, if needed
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        HttpServletRequest request = (HttpServletRequest) servletRequest;

        // Get the 'Origin' header from the incoming request
        String origin = request.getHeader("Origin");

        // Allow requests specifically from our two React frontends
        if (origin != null && (origin.equals("http://localhost:3000") || origin.equals("http://localhost:3001"))) {
            response.setHeader("Access-Control-Allow-Origin", origin);
        }

        // Define allowed methods (GET, POST, etc.)
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
        // Define allowed headers
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        // Allow credentials (like cookies, if we were using them)
        response.setHeader("Access-Control-Allow-Credentials", "true");
        // How long the browser can cache this "preflight" response
        response.setHeader("Access-Control-Max-Age", "3600");

        // --- Handle HTTP OPTIONS "preflight" request ---
        // Browsers send an OPTIONS request first for complex requests (like PUT/DELETE or POST with JSON)
        // We just need to respond with 200 OK and the headers above.
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            // It's a normal request (GET, POST, etc.), let it pass through to the servlet
            filterChain.doFilter(servletRequest, servletResponse);
        }
    }

    @Override
    public void destroy() {
        // Cleanup code, if needed
    }
}